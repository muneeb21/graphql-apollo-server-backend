# Group-Chat Using Graphql (Backend)
Backend of a groupchat implementation using gql, subscription and apollo server


**Tech stack used**<br/>
  Nodejs, apollo-server, Mongodb, Graphql, Graphql subscriptions, Jwt-auth


**Model Schemas**
> User<br/>
  Has details about the user such as name, email, password<br/>
 >Message<br/> 
  Has details of group and user by whom message is sent<br/>
  >Group<br/>
  Has details of group and users in it

**Explaination of key features**

- Users can signup/register and the login<br/>
- Passwords are encrypted before being stored<br>
- Paginated api to get groups and their info (done using gql)<br>
- User if login can send messages to any group from the list and using subscriptions messages are published to other with groupId<br>
- All the messages will be fetched when user opens a group<br>
- When a user sends a msg to a group if it is his first message to that group user will be pushed to that group<br/>
- Subscription for new message sent by a user to a group and it is published with unique groupId<br>



