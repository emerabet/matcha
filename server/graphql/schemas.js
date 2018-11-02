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
        country: String
        city: String
        zipcode: String
        gender: String
        orientation: String
        bio: String
        birthdate: String
        popularity: Int
        src: String
        tags: [Tag] 
        pictures: [Picture] 
        isMyProfile: Boolean
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

    type Notification {
        notification_id: Int
        type: String
        user_id_from: Int
        user_id_to: Int
        date: String
        is_read: Boolean
        login: String
        src: String
    }

    type Contact {
        chat_id: Int
        message_id: Int
        user_id_sender: Int
        message: String
        date: String
        read_date: String
        contact_id: Int
        contact_login: String
        contact_src: String
    }

    type Chat {
        chat_id: Int
        messages: [Message]
    }

    type Message {
        message_id: Int
        user_id_sender: Int
        login: String
        message: String
        date: String
        read_date: String
    }

    type Reported {
        user_id_reported: String
        user_reported_login: String
        user_reported_email: String
        user_id_reporter: String
        user_reporter_login: String
        user_reporter_email: String
        date: String
    }

    type IsLikedReported {
        liked: String,
        reported: String,
        report: String
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
        updateUser(user: AddUserInput!, profile: AddProfileInput!, address: AddAddressInput!): String,
        addPicture(token: String!, picture_id: Int!, url: String!, type: String!, delete_url: String): [Picture],
        deletePicture(picture_id: Int!, picture_src: String!): [Picture],
        likeUser(user_id_to_like: Int!): Int,
        addToBlackList(user_id_to_black_list: Int!): Boolean,
        addToReport(user_id_to_report: Int!): Boolean,
        addVisit(user_id_visited: Int!): Boolean,
        removeNotification(notification_id: Int!): Boolean,
        checkNotification(notification_id: Int!): Boolean,
        addMessage(chat_id: Int!, message: String!): Int,
        readChat(chat_id: Int!): Boolean,
        confirmAccount(registration_token: String!): Boolean,
        checkResetToken(reset_token: String!, password: String!): Boolean,
        resetPassword(login: String!): Boolean,
        updateUserLocation(address: AddAddressInput!): String
    }


    type Query {
        getUser(extended: Boolean, user_id2: Int): User,
        getUsers(extended: Boolean, orientation: String, gender: String): [User],
        getTags: [Tag],
        getAllTags: [Tag],
        getTagByUser(id: Int!): [Tag],
        getUserNotifications(search: String): [Notification],
        getLogin(login: String!): Boolean,
        getEmail(email: String!): Boolean,
        getPicture(token: String!, user_id2: Int) : [Picture],
        getContacts: [Contact],
        getMessages(chat_id: Int!): [Message],
        getStatusLikedReported(user_id2: Int!): IsLikedReported,
        getAllMessagesFromUser: [Chat],
        getReported: [Reported],
        checkProfile: Boolean
    }
`);