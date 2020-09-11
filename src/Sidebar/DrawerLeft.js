import React, { useEffect, useState } from 'react';
import { useStateValue } from '../StateProvider';
import { setDrawerLeft } from '../actions/drawerAction';
import { setMenuProfile } from '../actions/menuAction';
import { auth } from '../firebase';
import { toastInfo } from '../shared/toastInfo';
import ProfileMenu from './ProfileMenu';
import db from '../firebase';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import './DrawerLeft.css';

const useStyles = makeStyles ((theme) => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        
        [theme.breakpoints.up('xs')]: {
            width: '100vw',
        },
        [theme.breakpoints.up('sm')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('md')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('lg')]: {
            width: '30vw',
        },
    },
}));

function DrawerLeft() {
    const classes = useStyles();
    const [{ user, drawerLeft, menuProfile },  dispatch] = useStateValue();
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [showEditName, setShowEditName] = useState(false);
    const [showEditAbout, setShowEditAbout] = useState(false);
    const [showProfilePhoto, setShowProfilePhoto] = useState(false);
    

    useEffect(() => {
        const errorAbout = "errorAbout";
        setName(user.displayName);

        if(user.uid) {
            
          db.collection("users").doc(user.uid).set({
            name: user.displayName,
            about: "Hey there! I am using WhatsApp.",
          },{ merge: true });

          db.collection("users")
            .doc(user.uid)
            .get().then(function(doc) {
                if (doc.exists) {
                    setAbout(doc.data()?.about)
                } else {
                    db.collection("users").doc(user.uid).set({
                        about: "Hey there! I am using WhatsApp.",
                    },{ merge: true });
                }
          }).catch(function(error) {
                toastInfo(`${error}`, errorAbout, "top-center");
          });  
        }

        if(user.isAnonymous === true) {
            db.collection("users").doc(user.uid).set({
                name: user.displayName,
                about: "Hey there! I am using WhatsApp.",
            },{ merge: true });
        }
        
    }, [user.uid, user.displayName, user.isAnonymous]);

    const updateName = (e) => {
        e.preventDefault();
        
        if(user.uid) {
            db.collection("users").doc(user.uid).set({
                name: name,
            },{ merge: true });

            auth.currentUser.updateProfile({
                displayName: name,
            });
        }
        setShowEditName(false);
    };

    const updateAbout = (e) => {
        e.preventDefault();
         
        if(user.uid) {
            db.collection("users").doc(user.uid).set({
                about: about,
            },{ merge: true });
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
        dispatch(setDrawerLeft(false));
        setShowEditName(false);
        setShowEditAbout(false);
    };

    const viewPhoto = () => {
        setShowProfilePhoto(true);
        dispatch(setMenuProfile(null));
    }

    const viewPhotoClose = () => {
        setShowProfilePhoto(false);
    }
    
    const takePhoto = () => {
        const takePhoto = "takePhoto";
        toastInfo("Take photo is not available!", takePhoto, "bottom-right");
    }

    const uploadPhoto = () => {
        const uploadPhoto = "uploadPhoto";
        toastInfo("Upload photo is not available!", uploadPhoto, "bottom-right");
    }

    const removedPhoto = () => {
        const removedPhoto = "removedPhoto";
        toastInfo("Removed photo is not available!", removedPhoto, "bottom-right");
    }

    const menuProfileLists = [
        {
            title: "View photo",
            onClick: () => viewPhoto(),
        },
        {
            title: "Take photo",
            onClick: () => takePhoto(),
        },
        {
            title: "Upload photo",
            onClick: () => uploadPhoto(),
        },
        {
            title: "Removed photo",
            onClick: () => removedPhoto(),
        },
    ]

    return (
        <div>
            <Drawer
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
                        {/* <Avatar src={user.photoURL} /> */}
                        <ProfileMenu 
                            menuProfileLists={menuProfileLists} 
                            user={user}
                            profilePhoto={user.photoURL}
                        />
                        <Dialog
                            open={showProfilePhoto}
                            fullScreen 
                            onClose={viewPhotoClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                <IconButton edge="end" color="inherit" onClick={viewPhotoClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <img src={user.photoURL} alt=""/>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="drawerLeft__content_name">
                        <p>Your Name</p>
                        <form>
                            { showEditName ? 
                            <>
                                <input 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    type="text"
                                    styles={{borderBottom: '1px solid green !important'}}
                                />
                                <CheckIcon onClick={updateName} /> 
                            </>
                            :
                            <>
                                <span>{name}</span>
                                <EditIcon onClick={editName}/> 
                            </>
                            }   
                        </form>          
                    </div>

                    <div className="drawerLeft__note">
                        <span>
                            This is not your username or pin. This name will be visible to your WhatsApp contacts.
                        </span>
                    </div>

                    <div className="drawerLeft__content_name">
                        <p>About</p>
                        <form>
                            { showEditAbout ? 
                            <>
                                <input 
                                    value={about} 
                                    onChange={e => setAbout(e.target.value)} 
                                    type="text" 
                                />
                                <CheckIcon onClick={updateAbout} /> 
                            </>
                            :
                            <>
                                <span>{about}</span>
                                <EditIcon onClick={editAbout}/> 
                            </>
                            }   
                        </form>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerLeft
