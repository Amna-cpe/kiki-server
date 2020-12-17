const Post = require("../../modules/post");
const checkAuth = require("../../util/checkAuth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        // descending order
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }, context, info) {
      try {
        const post = await Post.findById(postId);
        if (post) return post;
        else throw new Error("Post not found");
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context, info) {
      // only validaters users can create a post
      const user = checkAuth(context);

      if(body.trim()==='') throw new Error('Body must not be empty')
      
      console.log(user);
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      context.pubsub.publish('NEW_POST',{
        newPost:post
      })

      return post;
    },

    async deletePost(_, { postId }, context, info) {
      // only validaters users can create a post
      const user = checkAuth(context);
      // make sure the user is the same as post' user --> (get the post)
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted succefully";
        } else {
          throw new AuthenticationError("Not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context, info) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === user.username)) {
          // if he likes --> unlike
          post.likes = post.likes.filter(like=>like.username!==user.username)
          
        } else {
          // like
          post.likes.push({
            username:user.username,
            createdAt:new Date().toISOString()
          });
        }
        await post.save();
        return post;
      }else throw new UserInputError('Post not found');
    },
  },
  Subscription:{
     newPost:{
       subscribe:(_,__,{pubsub})=> pubsub.asyncIterator('NEW_POST')
     }
  }
};
