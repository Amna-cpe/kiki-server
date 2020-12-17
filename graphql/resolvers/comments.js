const Post = require("../../modules/post");
const checkAuth = require("../../util/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Mutation: {
    addComment: async (_, { postId, body }, context, info) => {
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment must not be empty",
          },
        });
      }
      // only validaters users can comment
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, context, info) => {
      // only validaters users can delete
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentToBeDeleted_Index = post.comments.findIndex(
          (c) => c.id === commentId
        );
        if (
          post.comments[commentToBeDeleted_Index].username === user.username
        ) {
          post.comments.splice(commentToBeDeleted_Index, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Not allowed");
        }
      } else throw new UserInputError("Post not found");
    },
  },
};
