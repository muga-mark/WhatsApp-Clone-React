import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useStateValue } from '../StateProvider';
import { IconButton, Avatar, Menu, MenuItem, Drawer, ArrowBackIcon, EditIcon, 
         SearchOutlinedIcon, DonutLargeIcon, ChatIcon, MoreVertIcon, CheckIcon } from './material-ui';
import { auth } from '../firebase';
import db from '../firebase';
import SidebarChat from './SidebarChat';
import './Sidebar.css';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: 415,
    },
    drawerPaper: {
      width: 415,
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
    const [showEditName, setShowEditName] = React.useState(false);
    const [showEditAbout, setShowEditAbout] = React.useState(false);
    
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
      setShowEditName(false);
      setShowEditAbout(false);
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

    const updateName = (e) => {
        e.preventDefault();
        
        auth.currentUser.updateProfile({
            displayName: name,
        });

        setShowEditName(false);
    };

    const updateAbout = (e) => {
        e.preventDefault();
         
        if(user.uid) {
            db.collection("users").doc(user.uid).set({
                about: about,
            })
        }
        setShowEditAbout(false);
    };

    const editName = () => {
        setShowEditName(true);
    };

    const editAbout = () => {
        setShowEditAbout(true);
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
                            <Avatar src={user.photoURL} />
                        </div>

                        <div className="sidebar__header_drawerName">
                            <p>Your Name</p>
                            { showEditName ? 
                                <form>
                                    <input 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        placeholder={user.displayName} 
                                        type="text"
                                    />
                                    <CheckIcon onClick={updateName} /> 
                                </form>
                                :   
                                <form>
                                    <input 
                                        value={user.displayName} 
                                        // onChange={e => setName(e.target.value)} 
                                        // placeholder={user.displayName} 
                                        // type="text" 
                                    />
                                    <EditIcon onClick={editName}/> 
                                </form>
                            }        
                        </div>

                        <div className="sidebar__header_drawerNote">
                            <span>
                                This is not your username or pin. This name will be visible to your WhatsApp contacts.
                            </span>
                        </div>

                        <div className="sidebar__header_drawerName">
                            <p>About</p>
                            { showEditAbout ? 
                                <form>
                                    <input 
                                        value={about} 
                                        onChange={e => setAbout(e.target.value)} 
                                        placeholder={about}
                                        type="text" 
                                    />
                                    <CheckIcon onClick={updateAbout} /> 
                                </form>
                                :   
                                <form>
                                    <input 
                                        value={about} 
                                        // onChange={e => setAbout(e.target.value)} 
                                        // placeholder={about}
                                        // type="text" 
                                    />
                                    <EditIcon onClick={editAbout} />
                                </form>
                            } 
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
                        <MenuItem onClick={handleDrawerOpen}>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={logout}>
                            Logout
                        </MenuItem>
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
