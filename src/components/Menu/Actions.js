export const CLEAR_STORE = 'CLEAR_STORE';

export const clearStore =(userName, password, socket) => {
    return async dispatch => {
        try {
            dispatch({ type: CLEAR_STORE});
        } catch (err) {
        }
    }
}