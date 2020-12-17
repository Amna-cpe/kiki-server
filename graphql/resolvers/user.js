const User = require("../../modules/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validate");
const { SECRET } = require("../../config");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET,
    { expiresIn: "1h" }
  );
};
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, confirmPassword, password } },
      context,
      info
    ) {
      //   validate user data

      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //make sure user not exist and email
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new UserInputError("Email already exist", {
          errors: {
            email: "Email already exist",
          },
        });
      }
      // hash password create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(_, { username, password }, context, info) {
      //   validate user data

      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
