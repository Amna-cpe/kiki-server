const gql = require("graphql-tag");

module.exports =  gql`
type Post {
  id: ID!
  body: String!
  username: String!
  comments:[Comment]!
  likes:[Like]!
  likeCount:Int!
  commentCount:Int!
  createdAt:String!
}
type Comment{
  id:ID
  body:String
  createdAt:String
  username:String
}
type Like{
  id:ID
  createdAt:String
  username:String
}
type User {
  id:ID!
  username:String!
  createdAt:String!
  email:String!
  token:String!
}
input RegisterInput{
  username:String!,
  password:String!,
  confirmPassword:String!
  email:String!
}
type Query {
  getPosts: [Post]
  getPost(postId:ID!):Post!
}
type Mutation{
  register(registerInput: RegisterInput):User!
  login(username:String!,password:String!):User!
  createPost(body:String!):Post!
  deletePost(postId:ID!):String!
  addComment(postId:ID!,body:String! ):Post!
  deleteComment(postId:ID!, commentId:ID!):Post!
  likePost(postId:ID!):Post!
}

type Subscription{

newPost:Post!
}
`;
// Subsciption : mainly for chat app  
// each time when new post is created an notifier 
