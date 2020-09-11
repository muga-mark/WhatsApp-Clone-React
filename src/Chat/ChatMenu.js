import React from 'react';
import { useStateValue } from '../StateProvider';
import { setMenuChat } from '../actions/menuAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

function DropDownMenu( { menuChatLists }) {
    const [{ menuChat },  dispatch] = useStateValue();

    const handleCloseDropDownMenu = () => {
        dispatch(setMenuChat(null));
    };

    const handleClickDropDownMenu = (event) => {
        dispatch(setMenuChat(event.currentTarget));
    };

    return (
        <div>
            <Tooltip title={<span style={{fontSize: '14px', 
                padding: '8px 5px 8px 5px'}}>Menu</span>} 
                placement="bottom-end">
                <IconButton onClick={handleClickDropDownMenu}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>

            <Menu id="simple-menu"
                anchorEl={menuChat}
                keepMounted
                open={Boolean(menuChat)}
                onClose={handleCloseDropDownMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                getContentAnchorEl={null}
                >
                {menuChatLists.map((menuChatList) =>
                    <MenuItem onClick={menuChatList.onClick}>
                        {menuChatList.title}
                    </MenuItem>
                )}
            </Menu>
        </div>
    )
}

export default DropDownMenu