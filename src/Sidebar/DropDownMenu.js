import React from 'react';
import { useStateValue } from '../StateProvider';
import { setMenuSidebar } from '../actions/drawerAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


function DropDownMenu( { menuLists }) {
    const [{ menuSidebar },  dispatch] = useStateValue();

    const handleCloseDropDownMenu = () => {
        dispatch(setMenuSidebar(null));
    };

    const handleClickDropDownMenu = (event) => {
        dispatch(setMenuSidebar(event.currentTarget));
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
                anchorEl={menuSidebar}
                keepMounted
                open={Boolean(menuSidebar)}
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
                
                {menuLists.map((menuList) =>
                    <MenuItem onClick={menuList.onClick}>
                        {menuList.title}
                    </MenuItem>
                )}
            </Menu>
                
        </div>
    )
}

export default DropDownMenu