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

export function setMenuProfile(open) {
    return{
        type: "SET_MENU_PROFILE",
        menuProfile: open,
    }
}
