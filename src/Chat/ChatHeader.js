import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { setDrawerRight } from '../actions/drawerAction';
import { setMenuChat } from "../actions/menuAction";
import { toastInfo } from '../shared/toastInfo';
import ChatMenu from '../Chat/ChatMenu';
import DrawerRight from './DrawerRight';
import TooltipCustom from '../shared/TooltipCustom';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './ChatHeader.css';


function ChatHeader( { roomCreatedBy, roomOwner, roomName, roomId, messages, db, history }) {
    const [{ user },  dispatch] = useStateValue();
    const [role, setRole] = useState("");
    
    useEffect(() => {
        const errorAbout = "errorAbout";
        if(user.uid) {
          db.collection("users")
            .doc(user.uid)
            .get().then(function(doc) {
                if (doc.exists) {
                    setRole(doc.data().role)
                } 
          }).catch(function(error) {
                toastInfo(`${error}`, errorAbout, "top-center");
          });  
        }

    }, [user.uid, user.displayName, user.isAnonymous]);
    
    const searchMessage = () => {
        const searchToastId = "search";
        toastInfo("Search function is not yet available!", searchToastId, "top-center");
        dispatch(setDrawerRight(true));
    }

    const contactInfo = () => {
        const contactInfo = "contactInfo";
        toastInfo("Contact Info is not yet available!", contactInfo, "top-center");
    }

    const selectMessages = () => {
        const selectMessages = "selectMessages";
        toastInfo("Select Messages is not yet  available!", selectMessages, "top-center");
    }

    const muteNotifications = () => {
        const muteNotifications = "muteNotifications";
        toastInfo("Mute Notifications is not yet available!", muteNotifications, "top-center");
    }

    const clearMessages = () => {
        const clearMessages = "clearMessages";
        toastInfo("Clear Messages is not yet available!", clearMessages, "top-center");
    }

    const deleteRoom = () => {
        const roomDeleted = "roomDeleted";

        if(roomOwner===user.uid || role==="admin"){
            db.collection("rooms")
            .doc(roomId)
            .delete().then(function() {
                toastInfo("Room successfully deleted!", roomDeleted, "top-center");

            }).catch(function(error) {
                toastInfo(`Error removing room! ${error}`, roomDeleted, "top-center");
            });
            dispatch(setMenuChat(null));
            history.push('/');
        }else{
            toastInfo(`You are not allowed to delete room ${roomName}. Only the admin or room owner ${roomCreatedBy}`, roomDeleted, "top-center");
        }
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

    return (
        <div className="chat__header">
            <DrawerRight />  

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
                <TooltipCustom 
                    name="Search" 
                    icon={<SearchOutlinedIcon/>} 
                    onClick={searchMessage}
                />
                <ChatMenu menuChatLists={menuChatLists} />
            </div>
        </div>
    )
}

export default ChatHeader
