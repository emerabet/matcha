export const headers = () => {
    return {headers: {
                withCredentials: true,
                authorization: localStorage.getItem("token")
    }}
}