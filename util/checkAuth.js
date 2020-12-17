const jwt = require('jsonwebtoken');
const {SECRET} = require('../config')
const {AuthenticationError} = require('apollo-server')

module.exports = (context)=>{
    // context = {..header  }
   const AuthHeader = context.req.headers.authorization;

   if(AuthHeader){
       // bearer [token]
       const token = AuthHeader.split('bearer ')[1];
       if(token){
           try{
               const user = jwt.verify(token ,SECRET);
               return user;
           }
           catch(err){
              throw new AuthenticationError('Invalid/Expired Token');
           }
       }else{
        throw new Error('Auth Token must be bearer [token] ');
       }

   }else{
    throw new Error('Authprization header must be provided');
   }
}