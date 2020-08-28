import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useStateValue } from '../StateProvider';
import { IconButton, Avatar, Menu, MenuItem, 
         SearchOutlinedIcon, DonutLargeIcon, ChatIcon, MoreVertIcon, Tooltip,
         Button,
         TextField,
         Dialog,
         DialogActions,
         DialogContent,
         DialogContentText,
         DialogTitle } from './material-ui';
import { auth } from '../firebase';
import db from '../firebase';
import SidebarChat from './SidebarChat';
import './Sidebar.css';
import DrawerLeft from './DrawerLeft';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        // width: '30vw',
    },
    drawerPaper: {
        width: '30vw',
    },
}));

function Sidebar() {
    const history = useHistory();
    const [rooms, setRooms] = useState([]);
    const [{ user },  dispatch] = useStateValue();
    const [openForm, setOpenForm] = useState(false);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [roomName, setRoomName] = useState("");
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        dispatch({
            type: 'SET_DRAWER_LEFT',
            drawerLeft: true,
        })
    };
  
    // const handleDrawerClose = () => {
    //   setOpen(false);
    //   setShowEditName(false);
    //   setShowEditAbout(false);
    // };
  
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

    const handleClickOpenForm = () => {
        setOpenForm(true);
    };
    
    const handleClickCloseForm = () => {
        setOpenForm(false);
        setRoomName("");
    };

    const createChat = (e) => {
        // const roomName = prompt("Please enter name for chat");
        e.preventDefault();
        console.log("You typed >>", roomName);

        if(roomName) {
          db.collection('rooms')
            .add({
                name: roomName,
            })
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar 
                    src={user.photoURL} 
                    onClick={handleDrawerOpen}
                />

                <DrawerLeft />

                <div className="sidebar__headerRight">
                    <Tooltip title={<span style={{fontSize: '14px', 
                        padding: '8px 5px 8px 5px'}}>Status</span>} 
                        placement="bottom-end">
                        <IconButton>
                            <DonutLargeIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<span style={{fontSize: '14px', 
                        padding: '8px 5px 8px 5px'}}>New Chat</span>} 
                        placement="bottom-end">
                        <IconButton onClick={handleClickOpenForm}>
                            <ChatIcon />
                        </IconButton>
                    </Tooltip>
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
                        <MenuItem onClick={handleDrawerOpen}>
                            Profile 
                        </MenuItem>
                        <MenuItem onClick={logout}>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <Dialog open={openForm} onClose={handleClickCloseForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Room Name</DialogTitle>
                <DialogContent>
                {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room Name"
                    type="text"
                    fullWidth
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClickCloseForm} color="primary">
                    Cancel
                </Button>
                <Button onClick={createChat} color="primary">
                    Create
                </Button>
                </DialogActions>
            </Dialog>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
            </div>

            <div className="sidebar__chats">
                <div className="sidebar__chatsContainer">
                    {/* <SidebarChat addNewChat /> */}
                    {rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar
