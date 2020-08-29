import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import db from '../firebase';
import './SidebarChat.css';

function SidebarChat({ id, name }) {
    const [messages, setMessages] = useState("");

    useEffect(() => {
        if(id){
          db.collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) =>
                doc.data()))
            ));
        }
    }, [])

    
    return (
        <Link to={`/rooms/${id}`} className="sidebarChat__link">
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`}/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2> 
                    <p>{messages[0]?.message}</p>
                    {messages[0]?.caption?
                        <div className="sideChat__photo">
                            <PhotoCameraIcon /> <span>Photo</span>
                        </div>
                    :null}
                </div>
            </div>
        </Link>
    );   
}

export default SidebarChat
