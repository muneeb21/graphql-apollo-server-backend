const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError, withFilter } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { Message } = require('../models/message');
const { User } = require('../models/user');
const { Group } = require('../models/group');



module.exports = {
  Query: {
      // paginated api to get 10 groups according to page no
    getGroups: async (_, { pageNo }, { user }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        let selectNoOfGroups=pageNo*10;
        let groups = await Group.find().skip(selectNoOfGroups).limit(10)
      
        return groups
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    // to get all messages belonging to a group in descending order, ordered by created at
    getMessages: async (parent, { groupId }, { user }) => {
        try {
          if (!user) throw new AuthenticationError('Unauthenticated')
  
            
          const messages = await Message.find({ groupId: groupId }).sort({ createdAt : -1 })
  
          return messages
        } catch (err) {
          console.log(err)
          throw err
        }
      },
      //login a user and return user object along with json webtoken
    login: async (_, args) => {
      const { email, password } = args
      let errors = {}

      try {
        if (email.trim() === '')
          errors.email = 'email must not be empty'
        if (password === '') errors.password = 'password must not be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors })
        }

        const user = await User.find({ email : email })

        if (!user) {
          errors.email = 'user not found'
          throw new UserInputError('user not found', { errors })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
          errors.password = 'password is incorrect'
          throw new UserInputError('password is incorrect', { errors })
        }

        const token = jwt.sign({ user }, "jwtSecret", {
          expiresIn: "1d",
        })

        return {
          ...user.toJSON(),
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { name, email, password, confirmPassword } = args
      let errors = {}

      try {
        
        if (email.trim() === '') errors.email = 'email must not be empty'
        if (name.trim() === '')
          errors.name = 'name must not be empty'
        if (password.trim() === '')
          errors.password = 'password must not be empty'
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'repeat password must not be empty'

        if (password !== confirmPassword)
          errors.confirmPassword = 'passwords must match'

   

        if (Object.keys(errors).length > 0) {
          throw errors
        }

        // Hash password
        password = await bcrypt.hash(password, 6)

        // Create user
        const user = await User.create({
          name,
          email,
          password,
        })

        // Return user
        return user
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    
    // send message to a group based on groupId and message is published to other users
    sendMessage: async (parent, { groupId, message }, { user, pubsub }) => {
        try {
          if (!user) throw new AuthenticationError('Unauthenticated')
  
  
          if (content.trim() === '') {
            throw new UserInputError('Message is empty')
          }
  
          let userAddedToGroup= await Message.find({ userId : user.ObjectId });
          if(!userAddedToGroup){
              await Group.update({ groupId : groupId },{ $push: { users: user.ObjectId } })
          }
          const newMessage = await Message.create({
            userId: user.ObjectId,
            groupId,
            message,
          })

  
          pubsub.publish('NEW_MESSAGE', { newMessage: newMessage })
  
          return message
        } catch (err) {
          console.log(err)
          throw err
        }
      },


  },

  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator('NEW_MESSAGE')
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.userId === user.ObjectId) {
            return true
          }

          return false
        }
      ),
    },
 
  },
}
