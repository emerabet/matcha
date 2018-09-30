const { buildSchema } = require('graphql');

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
        old_password: String
        password: String
        insertId: Int
        login: String
        share_location: Int
        last_visit: String
    }

    input AddProfileInput {
        gender: String
        orientation: String
        bio: String
        popularity: Int
        birthdate: String
        old_password: String
        share_location: Boolean
    }
        
    type Mutation {
        addUser(user: AddUserInput): Int,
        updateUser(token: String, user: AddUserInput, profile: AddProfileInput): String
    }


    type Query {
        getUser(token: String): User
    }
`);