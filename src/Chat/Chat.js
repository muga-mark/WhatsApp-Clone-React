import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { Fab, IconButton, Avatar, NoEncryptionIcon, MoreVertIcon, SearchOutlinedIcon, 
         AttachFileIcon, InsertEmoticonIcon, MicIcon, InsertDriveFileIcon, PhotoIcon, 
         CameraAltIcon, VideoCallIcon, PersonIcon, ClickAwayListener, Slide, Tooltip, Drawer, 
         CloseIcon } from '../shared/material-ui';

import { setDrawerBottom } from '../actions/drawerAction';
import { setDrawerRight } from '../actions/drawerAction';
import DrawerBottom from './DrawerBottom';
import DrawerRight from './DrawerRight';
import { ToastContainer, toast } from 'react-toastify';
import db from '../firebase';
import { storage } from '../firebase';
import firebase from 'firebase';
//material-ui

import { makeStyles, useTheme } from '@material-ui/core/styles';
import './Chat.css';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
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
}));

function Chat() {
    const classes = useStyles();
    const [input, setInput] = useState('');
    const {roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [{ user, drawerBottom },  dispatch] = useStateValue();
    const [messages, setMessages] = useState([]);
    const [showAttachFile, setShowAttachFile] = useState(false);
    const [fileUrl, setFileUrl] = React.useState(null);
    const messagesEndRef = useRef(null);
    const toastId = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages]);

    const onFileChange = async (e) => {
        console.log("photo attach clicked");
        const file = e.target.files[0];
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        setFileUrl(await fileRef.getDownloadURL());

        dispatch(setDrawerBottom(true));
    };

    // console.log("chat file url=>",fileUrl);
    
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
        
        if(input){
            db.collection("rooms").doc(roomId).collection('messages').add({
                message: input,
                name: user.displayName,
                uid: user.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
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

    const searchMessage = () => {
        if(! toast.isActive(toastId.current)) {
            toastId.current =
            toast.info("Search function is not available!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                }
            );
        }

        dispatch(setDrawerRight(true));
    }
    

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
                        <SearchOutlinedIcon onClick={searchMessage}/>
                        <ToastContainer 
                            position="top-center"
                            autoClose={5000}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                        />
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
                                                        <input id="file-input" type="file" onChange={onFileChange} accept="video/*,image/*"/>
                                                    {/* </form> */}
                                                </div>
                                            </Fab>
                                        </Tooltip>
                                    </Slide>
                                    )}
                                </div>
                            </ClickAwayListener>
                            ) : null }

                    </div>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <DrawerBottom fileUrl={fileUrl} roomId={roomId} />   
            <DrawerRight roomId={roomId} />   

            <div className="chat__body">
                <p className="chat__message_reminder">
                    <NoEncryptionIcon /> This is a whatsapp clone. Messages are not encrpyted.
                </p>
               
                {messages.map((message) => (
                    <div className={`chat__message ${ message.uid === user.uid && "chat__receiver"}`}>
                        <span className={`chat__name ${ message.uid === user.uid && "chat__name_sender"}`}>
                            {message.name}
                        </span>
                        
                        <div className="chat__body_image_container">
                            {message.photo? 
                                <img className="chat__body_image"src={message.photo} alt=""/>
                            : null}
                        </div>  

                        <div className="chat__message_box">
                            <div>
                                {message.message}
                                {message.caption}
                            </div>
                            
                            
                            <div className="chat__timestamp_container">
                                <span className="chat__timestamp">
                                    {/* {new Date(message.timestamp?.toDate()).toString()} */}
                                    {new Date(message.timestamp?.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}
                                    {/* {new Date(message.timestamp?.toDate()).toUTCString()} */}
                                </span>
                            </div>

                        </div>   
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input 
                        required 
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
