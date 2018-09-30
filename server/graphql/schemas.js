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
        login: String
        first_name: String
        last_name: String
        email: String
        insertId: Int
        share_location: Int
        last_visit: String
        latitude: Int
        longitude: Int
        gender: String
        orientation: String
        bio: String
        birthdate: String
        popularity: Int
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
        getUser(token: String): User,
        getUsers: [User]
    }
`);