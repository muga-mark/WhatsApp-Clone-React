import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PhotoIcon from '@material-ui/icons/Photo';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PersonIcon from '@material-ui/icons/Person';
import LaptopIcon from '@material-ui/icons/Laptop';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import { setDrawerRight, setDrawerBottom, setMenuChat } from '../actions/drawerAction';
import Divider from '@material-ui/core/Divider';
import DrawerBottom from './DrawerBottom';
import DrawerRight from './DrawerRight';
import Hidden from '@material-ui/core/Hidden';
import TooltipCustom from '../shared/TooltipCustom';
import ChatBody from './ChatBody';
import db from '../firebase';
import { auth, storage, firebase } from '../firebase';
import './Chat.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import whatsAppConnected from '../image/whatsapp-connect.jpg';
import ChatMenu from '../Chat/ChatMenu';
import { useHistory } from 'react-router-dom';

const attachFileLists = [
    {
        title: "Photos & Videos",
        icon: <PhotoIcon />,
    },
    {
        title: "Camera",
        icon: <CameraAltIcon />,
    },
    {
        title: "Document",
        icon: <InsertDriveFileIcon />,
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

function Chat() {
    const history = useHistory();
    const [{ user },  dispatch] = useStateValue();
    const [input, setInput] = useState('');
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [showAttachFile, setShowAttachFile] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const searchToastId = "search";
    const attachToastId = "attach";
    const menuToastId = "menu"
    const messagesEndRef = useRef(null);
   
    const notAvailable = () => {
        const menuToastId = "menu";
        toast.info("This is not available!", {
            toastId: menuToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
    }

    const menuChatLists = [
        {
            title: "Contact info",
            onClick: () => notAvailable(),
        },
        {
            title: "Select messages",
            onClick: () => notAvailable(),
        },
        {
            title: "Mute notifications",
            onClick: () => notAvailable(),
        },
        {
            title: "Clear messages",
            onClick: () => notAvailable(),
        },
        {
            title: "Delete Room",
            onClick: () => deleteRoom(),
        },
    ]

    
    const scrollToBottom = () => {
        if(roomId){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
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
    
    useEffect(() => {
        if(roomId) {
          db.collection("rooms")
            .doc(roomId)
            .onSnapshot(snapshot => (
                setRoomName(snapshot.data()?.name)
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

    console.log("chat user", user);

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
      
            toast.info("All icons have the same functions, you can only upload images and gifs!", {
                toastId: attachToastId,
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                }
            );
    };
    
    const handleClickAway = ()  => {
        setShowAttachFile(false);
    };

    const searchMessage = () => {
        toast.info("Search function is not available!", {
            toastId: searchToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
        dispatch(setDrawerRight(true));
    }
    
    const menu = () => { 
        toast.info("Menu function is not available!", {
            toastId: menuToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
    }

    const emoticons = () => {
        toast.info("Emoticons is not available!", {
            toastId: menuToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
    }

    const voiceMessage = () => {
        toast.info("Voice Message is not available!", {
            toastId: menuToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
    }

    const deleteRoom = () => {
        if(roomId){
            db.collection("rooms")
            .doc(roomId)
            .delete().then(function() {
                console.log("Document successfully deleted!");
                toast.info("Room successfully deleted!", {
                    toastId: menuToastId,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    }
                );
                
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        }
        
        // db.collection("cities").doc("DC").delete().then(function() {
        //     console.log("Document successfully deleted!");
        // }).catch(function(error) {
        //     console.error("Error removing document: ", error);
        // });
        dispatch(setMenuChat(null));
        history.push('/');
    }
    return (
        <div className="chat">
            {roomId ? <>
                <DrawerBottom fileUrl={fileUrl} roomId={roomId} />   
                <DrawerRight roomId={roomId} />  
                <ToastContainer 
                    position="bottom-right"
                    autoClose={5000}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                />
    
                <div className="chat__header">
                    
                    <Hidden smUp>
                        <Link to='/'>
                            <div className="chat__back_button">
                                <IconButton>
                                    <ArrowBackIcon /> 
                                </IconButton>
                            </div>
                        </Link>
                    </Hidden>
    
                    {/* <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} /> */}
                    <Avatar>{roomName[0]}</Avatar>
                        <div className="chat__headerInfo">
                            <h3>{roomName}</h3>
                            <Hidden only={['xs']}>
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
                            </Hidden>
                        </div>
                    
                    <div className="chat__headerRight">
                        <Hidden only={['xs']}>
                            <TooltipCustom name="Search" icon={<SearchOutlinedIcon/>} onClick={() => searchMessage()}/>
                        </Hidden>                                                    
                        <div>
                            {/* <IconButton onClick={attachFile}>
                                <AttachFileIcon />
                            </IconButton> */}
                            
                            <TooltipCustom name="Attach" icon={<AttachFileIcon/>} onClick={() => attachFile()}/>
                                
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
                        {/* <IconButton onClick={menu}>
                            <MoreVertIcon />
                        </IconButton> */}
                        <ChatMenu 
                            menuChatLists={menuChatLists} 
                            // anchorEl2={anchorEl2}
                        />
                        {/* <TooltipCustom name="Menu" icon={<MoreVertIcon/>} onClick={() => menu()}/> */}
                    </div>
                </div>
    
                
    
    
                <div className="chat__body">
                    <ChatBody messages={messages} user={user} messagesEndRef={messagesEndRef} />
                </div>
    
                <div className="chat__footer">
                    <TooltipCustom name="Emoticons" icon={<InsertEmoticonIcon />} onClick={() => emoticons()}/>
                    
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
                    
                    <TooltipCustom name="Voice Message" icon={<MicIcon />} onClick={() => voiceMessage()}/>
                </div>
                
            </>
            :
                <div className="chat__landingScreen"> 

                    <div>
                        <img src={whatsAppConnected} alt="whatsAppConnected" />
                    </div>

                    <div className="chat__landingScreen_title"> 
                        <p> 
                            Keep your phone connected 
                        </p>
                    </div>

                    <div>
                        <p>
                            WhatsApp connects to your phone to sync messages. To reduce data usage, connect to yor phone to Wi-Fi.
                        </p>
                    </div>

                    <Divider />

                    <div className="chat__landingScreen_footer">
                        
                        <LaptopIcon />
                        <p>
                             WhatsApp is available for Windows.
                        </p>
                        <a target="_blank" href="https://www.whatsapp.com/download">
                            Get it here.
                        </a>
                        
                    </div>

                </div>
            }
            
        </div>
    );
}

export default Chat
