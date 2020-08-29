export function setUser(authUser){
    return {
        type: 'SET_USER',
        user: authUser,
    }
}