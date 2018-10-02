const { buildSchema } = require('graphql');

exports.registerSchema = buildSchema(`
    input AddUserInput {
        user_name: String
        first_name: String
        last_name: String
        email: String
        password: String
        old_password: String
    }       

    type User {
        age: Int
        user_id: Int
        login: String
        first_name: String
        last_name: String
        email: String
        insertId: Int
        share_location: Int
        last_visit: String
        latitude: Float
        longitude: Float
        gender: String
        orientation: String
        bio: String
        birthdate: String
        popularity: Int,
        tags: [Tag]
    }

    type Tag {
        owner_id: Int
        tag: String
    }

    input AddProfileInput {
        gender: String
        orientation: String
        bio: String
        popularity: Int
        birthdate: String
        old_password: String
        share_location: Int
        new_tags: [String]
        delete_tags: [String]
    }

    input AddAddressInput {
        latitude: Float
        longitude: Float
        ip: String
    }
        
    type Mutation {
        addUser(user: AddUserInput!, address: AddAddressInput!): Int,
        updateUser(token: String!, user: AddUserInput!, profile: AddProfileInput!, address: AddAddressInput!): String
    }


    type Query {
        getUser(token: String!, extended: Boolean): User,
        getUsers(extended: Boolean): [User],
        getTags: [Tag],
        getAllTags: [Tag],
        getLogin(login: String!): Boolean,
        getEmail(email: String!): Boolean
    }
`);