import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Fab, IconButton, Avatar, NoEncryptionIcon, MoreVertIcon, SearchOutlinedIcon, 
         AttachFileIcon, InsertEmoticonIcon, MicIcon, InsertDriveFileIcon, PhotoIcon, 
         CameraAltIcon, VideoCallIcon, PersonIcon, ClickAwayListener, Slide, Tooltip, Drawer, 
         CloseIcon } from './material-ui';
import db from '../firebase';
import { storage } from '../firebase';
import firebase from 'firebase';
import './Chat.css';

const useStyles = makeStyles((theme) => ({
    drawer: {
        // width: '90vw',
        width: '100%',
    },
    drawerPaper: {
        // width: '90vw',
        height: '90vh',
        // marginLeft: '410px',
        width: '100%',
    },
}));

function Chat() {
    const classes = useStyles();
    const [input, setInput] = useState('');
    const {roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [{ user },  dispatch] = useStateValue();
    const [messages, setMessages] = useState([]);
    const [showAttachFile, setShowAttachFile] = useState(false);
    const [image, setImage] = useState(null);
    const [fileUrl, setFileUrl] = React.useState(null);
    const [open, setOpen] = useState(false);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setFileUrl(await fileRef.getDownloadURL());
        setOpen(true);
    };

    const handleUpload = () => {
        db.collection("rooms").doc(roomId).collection('messages').add({
            photo: fileUrl,
            name: user.displayName,
            uid: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }
    
    const attachFileLists = [
        {
            title: "Photos & Videos",
            icon: <PhotoIcon />,
            // attach:  attachPhoto(),
        },
        {
            title: "Camera",
            icon: <CameraAltIcon />,
        },
        {
            title: "Document",
            icon: <InsertDriveFileIcon />,
            // onClick: attachDocument,
        },
        {
            title: "Contact",
            icon: <PersonIcon />,
        },
        {
            title: "Room",
            icon: <VideoCallIcon />,
        },
    ]

   

    useEffect(() => {
        if(roomId) {
          db.collection("rooms")
            .doc(roomId)
            .onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ));
          
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot(snapshot => (
                setMessages(snapshot.docs.map((doc) => 
                    doc.data()))
            ));
               
        }
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log("You typed >>", input);
        db.collection("rooms").doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            uid: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setInput("");
    };

    const attachFile = () => {
        if(showAttachFile === false) {
            setShowAttachFile(true);
        } else {
            setShowAttachFile(false);
        }
    };
    
    const handleClickAway = ()  => {
        setShowAttachFile(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
        console.log("drawer open", open);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    

    // const attachDocument = () => {
        
    // }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />
                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                        <p>Last seen {" "}
                            {messages[messages.length-1] ? 
                            (new Date(messages[messages.length-1]?.timestamp?.toDate()).toLocaleTimeString([], { 
                                weekday: "long",
                                year: "numeric",
                                month:"long",
                                day:"numeric",
                                hour: 'numeric', 
                                hour12: true, 
                                minute: 'numeric'
                            })) : (" ")}
                        </p>
                    </div>
                
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon onClick={handleDrawerOpen}/>
                    </IconButton>
                    <div>
                        <IconButton onClick={attachFile}>
                            <AttachFileIcon />
                        </IconButton>
                            
                        { showAttachFile? (
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <div className="chat__attachFile">
                                    {attachFileLists.map((attachFileList) => 
                                    <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title={<span style={{fontSize: '14px', padding: '8px 5px 8px 5px'}}>
                                                            {attachFileList.title}
                                                        </span>} 
                                                placement="left">
                                            <Fab color="primary" aria-label="person">
                                                <div className="chat__icon">
                                                    {/* <form> */}
                                                        <label for="file-input">
                                                            {attachFileList.icon}
                                                        </label>
                                                        <input id="file-input" type="file" onChange={onFileChange} />
                                                    {/* </form> */}
                                                </div>
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    )}

                                    {/* <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title="Photos & Videos" placement="left">
                                            <Fab color="primary" aria-label="photo">
                                                <PhotoIcon />
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title="Camera" placement="left">
                                            <Fab color="primary" aria-label="camera">
                                                <CameraAltIcon />
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title="Document" placement="left">
                                            <Fab color="primary" aria-label="insertdrivefile">
                                                <InsertDriveFileIcon />
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title="Contact" placement="left">
                                            <Fab color="primary" aria-label="person">
                                                <PersonIcon />
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    <Slide direction="down" in={attachFile} mountOnEnter unmountOnExit>
                                        <Tooltip title="Room" placement="left">
                                            <Fab color="primary" aria-label="videocall">
                                                <VideoCallIcon />
                                            </Fab>
                                        </Tooltip>
                                    </Slide> */}
                                </div>
                            </ClickAwayListener>
                            ) : null }

                    </div>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            
            <Drawer
                className={classes.drawer}
                anchor="bottom"
                open={open}
                classes={{ paper: classes.drawerPaper }}
                >
                <div className="chat__attachFile_drawerHeader">
                    <div className="chat__attachFile_drawerHeader_container">
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon /> 
                        </IconButton>
                        <p>Preview</p>
                    </div>
                </div>
                
                <div className="chat__attachFile_drawerContent">
                    <div className="chat__attachFile_drawerContent_photo">
                        <img src={user.photoURL} alt="" />
                    </div>
                    {/* <div className="chat__attachFile_drawerContent_fileCaption">
                        <input type="text" />
                    </div> */}
                </div>
                
            </Drawer>
            

            <div className="chat__body">
                <p className="chat__message_reminder">
                    <NoEncryptionIcon /> Messages are not encrpyted. This is for practice purposes only.
                </p>
                {messages.map((message) => (
                    <p className={`chat__message ${ message.uid === user.uid && "chat__receiver"}`}>
                        <span className="chat__name">
                            {message.name}
                        </span>
                        {message.message}
                        {message.photo? <img src={message.photo} alt=""/>: null}
                        <span className="chat__timestamp">
                            {/* {new Date(message.timestamp?.toDate()).toString()} */}
                            {new Date(message.timestamp?.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}
                            {/* {new Date(message.timestamp?.toDate()).toUTCString()} */}
                        </span>
                    </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        placeholder="Type a message" type="text" 
                    />
                    <button 
                        onClick={sendMessage} 
                        type="submit">
                        Send a message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    );
}

export default Chat
