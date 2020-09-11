import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { setDrawerBottom } from '../actions/drawerAction';
import firebase from 'firebase';
import db from '../firebase';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import './DrawerBottom.css';

const useStyles = makeStyles ((theme) => ({
    drawerPaper: {
        height: '90vh',
        [theme.breakpoints.up('xs')]: {
            width: '100vw',
        },
        [theme.breakpoints.up('sm')]: {
            width: '70vw',
        },
        [theme.breakpoints.up('md')]: {
            width: '70vw',
        },
        [theme.breakpoints.up('lg')]: {
            width: '70vw',
        },
    },
    paperAnchorBottom: {
        left: 'auto',
        right: 0,
        bottom: 0,
        maxHeight: '100%',
        [theme.breakpoints.up('xs')]: {
            top: 52,
        },
        [theme.breakpoints.up('sm')]: {
            top: 65,
        },
        [theme.breakpoints.up('md')]: {
            top: 65,
        },
        [theme.breakpoints.up('lg')]: {
            top: 65,
        },
    }
}));

function DrawerBottom( fileUrl ) {
    const classes = useStyles();
    const [{ user, drawerBottom },  dispatch] = useStateValue();
    const [caption, setCaption] = useState([]); 
    const { roomId } = useParams();

    const handleUpload = (e) => {
        e.preventDefault();
        if(fileUrl){
            db.collection("rooms").doc(roomId).collection('messages').add({
                photo: fileUrl.fileUrl,
                name: user.displayName,
                uid: user.uid,
                caption: caption,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            dispatch(setDrawerBottom(false));
        }
        setCaption("");
    }

    const handleDrawerClose = () => {
        dispatch(setDrawerBottom(false));
    };

    return (
        <div>
            <Drawer
                variant="persistent"
                anchor="bottom"
                open={drawerBottom}
                classes={{ paper: classes.drawerPaper, paperAnchorBottom:  classes.paperAnchorBottom}}
                >
                <div className="drawerBottom__header">
                    <div className="drawerBottom__header_container">
                        <IconButton>
                            <CloseIcon onClick={handleDrawerClose}/> 
                        </IconButton>
                        <p>Preview</p>
                    </div>
                </div>
                
                <div className="drawerBottom__content">
                    <div className="drawerBottom__content_photo">
                        <img src={fileUrl.fileUrl} alt="" />
                    </div>
                    <div className="drawerBottom__content_caption">
                        <input 
                            type="text"
                            placeholder="Add a caption..."  
                            value={caption} 
                            onChange={e => setCaption(e.target.value)} 
                        />
                        <Fab color="primary" aria-label="send" size="large" onClick={handleUpload}>
                            <div className="chat__icon">
                                <SendIcon />
                            </div>
                        </Fab>
                    </div>
                </div>

                <div className="drawerBottom__footer">
                    <div>
                        <img src={fileUrl.fileUrl} alt=""/>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerBottom
