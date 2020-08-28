export const initialState = {
    user: null,
    drawerBottom: false,
    drawerLeft: false,
    drawerRight: false,
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_DRAWER_BOTTOM: "SET_DRAWER_BOTTOM",
    SET_DRAWER_LEFT: "SET_DRAWER_LEFT",
    SET_DRAWER_RIGHT: "SET_DRAWER_RIGHT",
}

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };

        case actionTypes.SET_DRAWER_BOTTOM:
            return {
                ...state,
                drawerBottom: action.drawerBottom,
            };
        
        case actionTypes.SET_DRAWER_LEFT:
            return {
                ...state,
                drawerLeft: action.drawerLeft,
            };

        case actionTypes.SET_DRAWER_RIGHT:
            return {
                ...state,
                drawerRight: action.drawerRight,
            };

        default:
            return state;
    }
}

export default reducer;