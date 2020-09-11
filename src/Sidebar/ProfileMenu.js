import React from 'react';
import { useStateValue } from '../StateProvider';
import { setMenuProfile } from '../actions/menuAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import './DrawerLeft.css';

function ProfileMenu( { menuProfileLists, user }) {
    const [{ menuProfile },  dispatch] = useStateValue();

    const handleCloseDropDownMenu = () => {
        dispatch(setMenuProfile(null));
    };

    const handleClickDropDownMenu = (event) => {
        dispatch(setMenuProfile(event.currentTarget));
    };

    return (
        <div className="profilePhoto">
            <Avatar 
                src={user.photoURL} 
                className="profilePhoto__layer_bottom"
            />
            <div className="profilePhoto__layer_top" onClick={handleClickDropDownMenu} >
                <div className="profilePhoto__text">
                    <PhotoCameraIcon />
                    <p>CHANGE</p>
                    <p>PROFILE PHOTO</p>
                </div>
            </div>
            
            <Menu 
                id="profile-menu"
                anchorEl={menuProfile}
                keepMounted
                open={Boolean(menuProfile)}
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
                
                {menuProfileLists.map((menuProfileList) =>
                    <MenuItem onClick={menuProfileList.onClick}>
                        {menuProfileList.title}
                    </MenuItem>
                )}
            </Menu>
                
        </div>
    )
}

export default ProfileMenu