var { buildSchema } = require('graphql');



exports.registerSchema = buildSchema(`
		input AddUserInput {
            user_name: String
            first_name: String
            last_name: String
            email: String
            password: String
            
        }       

        type User {
            user_name: String
            first_name: String
            last_name: String
            email: String
            password: String
            insertId: Int
            login: String
        }
        
        type Mutation {
            addUser(user: AddUserInput): Int
        }

        type Query {
            getUser(id: Int): User
          }
        `);
        
