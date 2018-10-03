import axios from 'axios';

export const handleBlur = async (e, data) => {
    console.log("in blur", e.target.name);
    let query, result;
    switch (e.target.name) {
        case 'email':
            query = `
            query getEmail($email: String!) {
                getEmail(email: $email)
            }
            `;
            result = await axios.post(`/api`, {   query: query,
                variables: { email: e.target.value }
            });
            return ({emailAlreadyTaken: result.data.data.getEmail});
        case 'userName':
        case 'login':
            query = `
            query getLogin($login: String!) {
                getLogin(login: $login)
            }
            `;
            result = await axios.post(`/api`, {   query: query,
                variables: { login: e.target.value }
            });
            return ({userNameAlreadyTaken: result.data.data.getLogin});
            case 'login':
            query = `
            query getLogin($login: String!) {
                getLogin(login: $login)
            }
            `;
            result = await axios.post(`/api`, {   query: query,
                variables: { login: e.target.value }
            });
            return ({userNameAlreadyTaken: result.data.data.getLogin});
        default:
            console.log("DEFAULT");
    }
}