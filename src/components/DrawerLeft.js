import React, { useEffect, useState } from 'react';
import { useStateValue } from '../StateProvider';
import { IconButton, Avatar, Menu, MenuItem, Drawer, ArrowBackIcon, EditIcon, 
    SearchOutlinedIcon, DonutLargeIcon, ChatIcon, MoreVertIcon, CheckIcon } from './material-ui';
import { makeStyles } from '@material-ui/core/styles';
import db from '../firebase';
import { auth } from '../firebase';
import './Drawer.css';

const useStyles = makeStyles({
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
});

function DrawerLeft() {
    const classes = useStyles();
    const [{ user, drawerLeft },  dispatch] = useStateValue();
    const [name, setName] = useState("");
    const [about, setAbout] = useState([]);
    const [showEditName, setShowEditName] = useState(false);
    const [showEditAbout, setShowEditAbout] = useState(false);

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

    const handleDrawerClose = () => {
        dispatch({
            type: 'SET_DRAWER_LEFT',
            drawerLeft: false,
        })
        setShowEditName(false);
        setShowEditAbout(false);
    };

    useEffect(() => {
        if(user.uid) {
          db.collection("users")
            .doc(user.uid)
            .onSnapshot(snapshot => (
                setAbout(snapshot.data()?.about)
            ));
        }
       
    }, [user.uid]);


    return (
        <div>
            <Drawer
                // className={classes.drawer}
                anchor="left"
                variant="persistent"
                open={drawerLeft}
                classes={{ paper: classes.drawerPaper }}
                >
                <div className="drawerLeft__header">
                    <div className="drawerLeft__header_container">
                        <IconButton onClick={handleDrawerClose}>
                            <ArrowBackIcon /> 
                        </IconButton>
                        <p>Profile</p>
                    </div>
                </div>
                
                <div className="drawerLeft__content">
                    <div className="drawerLeft__content_photo">
                        <Avatar src={user.photoURL} />
                    </div>

                    <div className="drawerLeft__content_name">
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

                    <div className="drawerLeft__note">
                        <span>
                            This is not your username or pin. This name will be visible to your WhatsApp contacts.
                        </span>
                    </div>

                    <div className="drawerLeft__content_name">
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
        </div>
    )
}

export default DrawerLeft
