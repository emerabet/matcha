var { buildSchema } = require('graphql');

const User = `
    type User {
        user_name: String,
        first_name: String,
        last_name: String,
        email: String,
        password: String
            }
    `

exports.registerSchema = buildSchema(`
		type Mutation {
			addUser(user: UserToAdd): User
        }       
        
        type User {
            user_name: String,
            first_name: String,
            last_name: String,
            email: String,
            password: String
                }
        `);
        
