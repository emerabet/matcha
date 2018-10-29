import axios from 'axios';

export const handleBlur = async (e, data) => {
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
            return ({emailAlreadyTaken: result ? result.data.data.getEmail : null});
        case 'login':
            query = `
            query getLogin($login: String!) {
                getLogin(login: $login)
            }
            `;
            result = await axios.post(`/api`, {   query: query,
                variables: { login: e.target.value }
            });
            return ({userNameAlreadyTaken: result ? result.data.data.getLogin : null});
        default:
            return ;
    }
}