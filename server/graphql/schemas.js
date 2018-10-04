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
        tags: [Tag],
        pictures: [Picture]
    }

    type Tag {
        owner_id: Int
        tag: String
    }

    type Picture {
        picture_id: Int
        user_id: Int
        src: String
        priority: Int
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
        updateUser(token: String!, user: AddUserInput!, profile: AddProfileInput!, address: AddAddressInput!): String,
        addPicture(token: String!, picture_id: Int!, url: String!, type: String!): [Picture],
        deletePicture(token: String!, picture_id: Int!): String
    }


    type Query {
        getUser(token: String!, extended: Boolean, user_id2: Int): User,
        getUsers(extended: Boolean): [User],
        getTags: [Tag],
        getAllTags: [Tag],
        getLogin(login: String!): Boolean,
        getEmail(email: String!): Boolean,
        getPicture(token: String!, user_id2: Int) : [Picture]
    }
`);