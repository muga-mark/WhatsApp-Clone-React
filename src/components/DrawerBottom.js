import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton, Drawer, CloseIcon, AddIcon, SendIcon, Fab } from './material-ui';
import { useStateValue } from '../StateProvider';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../firebase';
import firebase from 'firebase';
import db from '../firebase';
import './Drawer.css';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const useStyles = makeStyles({
    drawerPaper: {
        height: '90vh',
        width: '70vw',
    },
    paperAnchorBottom: {
        top: 65,
        left: 'auto',
        right: 0,
        bottom: 0,
        maxHeight: '100%',
    }
});

function DrawerBottom( fileUrl ) {
    const classes = useStyles();
    const [{ user, drawerBottom },  dispatch] = useStateValue();
    const [caption, setCaption] = useState([]); 
    const [anotherFileUrl, setAnotherFileUrl] = useState([]);
    const {roomId } = useParams();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        appendDots: dots => (
          <div
            style={{
              backgroundColor: "#ddd",
              borderRadius: "10px",
              padding: "10px"
            }}
          >
            <ul style={{ margin: "0px" }}> {dots} </ul>
          </div>
        ),
        customPaging: i => (
          <div
            style={{
              width: "30px",
              color: "blue",
              border: "1px blue solid"
            }}
          >
            {i + 1}
          </div>
        )
      };

    // const onFileChange = async (e) => {
    //     const file = e.target.files[0];
    //     const storageRef = storage.ref();
    //     const fileRef = storageRef.child(file.name);
    //     await fileRef.put(file);
    //     setAnotherFileUrl(await fileRef.getDownloadURL());
    // };

    const handleUpload = (e) => {
        e.preventDefault();
        // console.log("You typed in caption >>", caption);
        if(caption){
            db.collection("rooms").doc(roomId).collection('messages').add({
                photo: fileUrl.fileUrl,
                name: user.displayName,
                uid: user.uid,
                caption: caption,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            dispatch({
                type: 'SET_DRAWER_BOTTOM',
                drawerBottom: false,
            })
        }
        
        setCaption("");
    }

    const handleDrawerClose = () => {
        dispatch({
            type: 'SET_DRAWER_BOTTOM',
            drawerBottom: false,
          })
    };

    return (
        <div>
            {drawerBottom? 
                <Drawer
                    // transitionDuration={4000}
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
                            <p>Preview SHIT</p>
                        </div>
                    </div>
                    
                    <div className="drawerBottom__content">
                        <div className="drawerBottom__content_photo">
                            <img src={fileUrl.fileUrl} alt="" />
                            {/* <img src={user.photoURL} /> */}
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
                        {/* <Slider {...settings}>
                            <div>
                                <img src={user.photoURL} />
                            </div>
                            <div>
                                <img src={anotherFileUrl} />
                            </div>
                        </Slider> */}
                        <div>
                            <img src={fileUrl.fileUrl} />
                        </div>
                        <img src={anotherFileUrl} />
                        {/* <label for="file-input">
                            <AddIcon />
                        </label>
                        <input id="file-input" type="file" onChange={onFileChange} /> */}
                    </div>
                </Drawer>
            : null} 
            
        </div>
    )
}

export default DrawerBottom
