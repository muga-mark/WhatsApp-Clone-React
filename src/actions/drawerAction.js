export function setDrawerLeft(open) {
    return{
        type: "SET_DRAWER_LEFT",
        drawerLeft: open,
    };
}

export function setDrawerBottom(open) {
    return{
        type: "SET_DRAWER_BOTTOM",
        drawerBottom: open,
    };
}

export function setDrawerRight(open) {
    return{
        type: "SET_DRAWER_RIGHT",
        drawerRight: open,
    }
}