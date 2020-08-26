import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SidebarChat from './SidebarChat';
import './Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import db from './firebase';
import { useStateValue } from './StateProvider';
import Drawer from '@material-ui/core/Drawer';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { auth } from './firebase';


const drawerWidth = 415;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
    //   flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
  }));

function Sidebar() {
    const history = useHistory();
    const [rooms, setRooms] = useState([]);
    const [{ user },  dispatch] = useStateValue();
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [name, setName] = useState("");
    const [about, setAbout] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    const logout = () => {
        if(user){
            auth.signOut();
            history.push('/');
        }
    };

    useEffect(() => {
        const unsubscribe = db
            .collection("rooms")
            .onSnapshot((snapshot) => 
                setRooms(snapshot.docs.map(doc => 
                    ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
        
        return () => {
            unsubscribe();
        }

    }, []);

    useEffect(() => {
        if(user.uid) {
          db.collection("users")
            .doc(user.uid)
            .onSnapshot(snapshot => (
                setAbout(snapshot.data()?.about)
            ));

        }
       
    }, [user.uid]);

    console.log("sidebar about =>",about);

    const updateName = (e) => {
        e.preventDefault();
        console.log("You typed >>", name);
        
        auth.currentUser.updateProfile({
            displayName: name,
        });

    };

    const updateAbout = (e) => {
        e.preventDefault();
        console.log("You typed >>", about);
         
        if(user.uid) {
            db.collection("users").doc(user.uid).set({
                about: about,
            })
        }
        
        
    };



    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar 
                    src={user.photoURL} 
                    onClick={handleDrawerOpen}
                />
                
                <Drawer
                    className={classes.drawer}
                    anchor="left"
                    open={open}
                    classes={{ paper: classes.drawerPaper }}
                    >
                    <div className="sidebar__header_drawerHeader">
                        <div className="sidebar__header_drawerHeader_container">
                            <IconButton onClick={handleDrawerClose}>
                                <ArrowBackIcon /> 
                            </IconButton>
                            <p>Profile</p>
                        </div>
                    </div>
                    
                    <div className="sidebar__header_drawerContent">

                    <div className="sidebar__header_drawerPhoto">
                        <Avatar 
                            src={user.photoURL} 
                        />
                    </div>

                    <div className="sidebar__header_drawerName">
                        <p>Your Name</p>
                        {/* <span>{user.displayName} <EditIcon /> </span> */}
                        <form>
                            <input 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder={user.displayName} 
                                type="text" 
                            />
                            <EditIcon onClick={updateName} />
                        </form>
                    </div>

                    <div className="sidebar__header_drawerNote">
                        <span>
                            This is not your username or pin. This name will be visible to your WhatsApp contacts.
                        </span>
                    </div>

                    <div className="sidebar__header_drawerName">
                        <p>About</p>
                        {/* <span>Hey there! I am using WhatsApp. <EditIcon /> </span> */}
                        <form>
                            <input 
                                value={about} 
                                onChange={e => setAbout(e.target.value)} 
                                placeholder={about}
                                type="text" 
                            />
                            <EditIcon onClick={updateAbout} />
                        </form>
                        
                    </div>

                    </div>
                </Drawer>

                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
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
                        <MenuItem onClick={handleDrawerOpen}>Profile</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
                
            </div>

            <div className="sidebar__chats">
                <div className="sidebar__chatsContainer">
                    <SidebarChat addNewChat />
                    {rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar
