const postResolvers = require('./post')
const userResolvers = require('./user')
const commnetResolvers = require('./comments')


module.exports = {
    Post:{
     likeCount:(parent)=>parent.likes.length,
     commentCount:(parent)=>parent.comments.length

    },
    Query:{
        ...postResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commnetResolvers.Mutation
    },
    Subscription:{
        ...postResolvers.Subscription
    }
}