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

export function setMenuSidebar(open) {
    return{
        type: "SET_MENU_SIDEBAR",
        menuSidebar: open,
    }
}

export function setMenuChat(open) {
    return{
        type: "SET_MENU_CHAT",
        menuChat: open,
    }
}