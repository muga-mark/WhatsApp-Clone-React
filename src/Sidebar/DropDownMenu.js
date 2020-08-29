import React, { useState } from 'react';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router-dom';
import { setDrawerLeft } from '../actions/drawerAction';
import { auth } from '../firebase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


function DropDownMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const [{ user },  dispatch] = useStateValue();
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDrawerLeftOpen = () => {
        dispatch(setDrawerLeft(true));
        setAnchorEl(null);
    };

    const logout = () => {
        if(user){
            auth.signOut();
            history.push('/');
        }
    };

    return (
        <div>

            <Tooltip title={<span style={{fontSize: '14px', 
                padding: '8px 5px 8px 5px'}}>Menu</span>} 
                placement="bottom-end">
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>

            <Menu id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
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
                <MenuItem>
                    New Group     
                </MenuItem>
                <MenuItem>
                    Create a room   
                </MenuItem>
                <MenuItem onClick={handleDrawerLeftOpen}>
                    Profile 
                </MenuItem>
                <MenuItem>
                    Archived    
                </MenuItem>
                <MenuItem>
                    Starred   
                </MenuItem>
                <MenuItem>
                    Settings  
                </MenuItem>
                <MenuItem onClick={logout}>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    )
}

export default DropDownMenu