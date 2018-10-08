export const headers = () => {
    return {headers: {
                authorization: localStorage.getItem("token")
    }}
}