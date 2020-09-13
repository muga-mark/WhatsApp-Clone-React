import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { setDrawerRight, setDrawerBottom } from '../actions/drawerAction';
import { setMenuChat } from "../actions/menuAction";
import { toastInfo } from '../shared/toastInfo';
import ChatMenu from '../Chat/ChatMenu';
import DrawerBottom from './DrawerBottom';
import DrawerRight from './DrawerRight';
import TooltipCustom from '../shared/TooltipCustom';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PhotoIcon from '@material-ui/icons/Photo';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PersonIcon from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './ChatHeader.css';

// const attachFileLists = [
//     {
//         title: "Photos & Videos",
//         icon: <PhotoIcon />,
//     },
//     {
//         title: "Camera",
//         icon: <CameraAltIcon />,
//     },
//     {
//         title: "Document",
//         icon: <InsertDriveFileIcon />,
//     },
//     {
//         title: "Contact",
//         icon: <PersonIcon />,
//     },
//     {
//         title: "Room",
//         icon: <VideoCallIcon />,
//     },
// ]

function ChatHeader( { roomName, roomId, messages, db, storage, history }) {
    const [{ user },  dispatch] = useStateValue();
    // const [showAttachFile, setShowAttachFile] = useState(false);
    // const [fileUrl, setFileUrl] = useState(null);
    
    const searchMessage = () => {
        const searchToastId = "search";
        toastInfo("Search function is not available!", searchToastId, "top-center");
        dispatch(setDrawerRight(true));
    }

    // const attachFile = () => {
    //     const attachToastId = "attach";
    //     toastInfo("All icons have the same functions, you can only upload images and gifs!",attachToastId, "bottom-right");
    //     if(showAttachFile === false) {
    //         setShowAttachFile(true);
    //     } else {
    //         setShowAttachFile(false);
    //     }
    // };

    const contactInfo = () => {
        const contactInfo = "contactInfo";
        toastInfo("Contact Info is not available!", contactInfo, "bottom-right");
    }

    const selectMessages = () => {
        const selectMessages = "selectMessages";
        toastInfo("Select Messages is not available!", selectMessages, "bottom-right");
    }

    const muteNotifications = () => {
        const muteNotifications = "muteNotifications";
        toastInfo("Mute Notifications is not available!", muteNotifications, "bottom-right");
    }

    const clearMessages = () => {
        const clearMessages = "clearMessages";
        toastInfo("Clear Messages is not available!", clearMessages, "bottom-right");
    }

    const deleteRoom = () => {
        const roomDeleted = "roomDeleted";

        if(roomId){
            db.collection("rooms")
            .doc(roomId)
            .delete().then(function() {
                toastInfo("Room successfully deleted!", roomDeleted, "top-center");

            }).catch(function(error) {
                toastInfo(`Error removing room! ${error}`, roomDeleted, "top-center");
            });
        }

        dispatch(setMenuChat(null));
        history.push('/');
    }

    const menuChatLists = [
        {
            title: "Contact info",
            onClick: () => contactInfo(),
        },
        {
            title: "Select messages",
            onClick: () => selectMessages(),
        },
        {
            title: "Mute notifications",
            onClick: () => muteNotifications(),
        },
        {
            title: "Clear messages",
            onClick: () => clearMessages(),
        },
        {
            title: "Delete Room",
            onClick: () => deleteRoom(),
        },
    ]

    // const onFileChange = async (e) => {
    //     const file = e.target.files[0];
    //     const storageRef = storage.ref();
    //     const imagesRef = storageRef.child(`rooms/${roomName}/images`);
    //     const fileRef = imagesRef.child(file.name);
    //     await fileRef.put(file);
    //     setFileUrl(await fileRef.getDownloadURL());

    //     dispatch(setDrawerBottom(true));
    // };

    // console.log("CHAT HEADER", fileUrl);

    // const handleClickAway = ()  => {
    //     setShowAttachFile(false);
    // };

    return (
        <div className="chat__header">
            {/* <DrawerBottom 
                fileUrl={fileUrl} 
                roomId={roomId} 
            />  */}

            <DrawerRight 
                roomId={roomId} 
            />  

            <Hidden smUp>
                <Link to='/'>
                    <div className="chat__back_button">
                        <IconButton>
                            <ArrowBackIcon /> 
                        </IconButton>
                    </div>
                </Link>
            </Hidden>
            
            <Avatar>{roomName[0]}</Avatar>
            <div className="chat__headerInfo">
                <h3>{roomName}</h3>
                <Hidden only={['xs']}>
                    <p>
                        {messages[messages.length-1]? <>Last seen {" "} </>: null}
                        {messages[messages.length-1]? 
                            (new Date(messages[messages.length-1]?.timestamp?.toDate()).toLocaleTimeString([], { 
                                weekday: "long",
                                year: "numeric",
                                month:"long",
                                day:"numeric",
                                hour: 'numeric', 
                                hour12: true, 
                                minute: 'numeric'
                            })):(" ")
                        }
                    </p>
                </Hidden>
            </div>
            
            <div className="chat__headerRight">
                <Hidden only={['xs']}>
                    <TooltipCustom 
                        name="Search" 
                        icon={<SearchOutlinedIcon/>} 
                        onClick={searchMessage}
                    />
                </Hidden>     

                {/* <div>
                    <TooltipCustom 
                        name="Attach" 
                        icon={<AttachFileIcon/>} 
                        onClick={attachFile}
                    />
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
                                                <label for="file-input">
                                                    {attachFileList.icon}
                                                </label>
                                                <input 
                                                    id="file-input"
                                                    type="file" 
                                                    onChange={onFileChange} 
                                                    accept="video/*,image/*"
                                                />
                                            </div>
                                        </Fab>
                                    </Tooltip>
                                </Slide>
                                )}
                            </div>
                        </ClickAwayListener>
                    ):null}
                </div> */}
            
                <ChatMenu menuChatLists={menuChatLists} />
            </div>
        </div>
    )
}

export default ChatHeader
