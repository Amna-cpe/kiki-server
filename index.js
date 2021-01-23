const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req , pubsub}),
});
const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("Server running db");

    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log("Server running at 5000");
  })
  .catch(err=>{
    console.log(err);
  })
