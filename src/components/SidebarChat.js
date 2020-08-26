import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {Avatar} from './material-ui';
import db from '../firebase';
import './SidebarChat.css';

function SidebarChat({ id, name, addNewChat }) {
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

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");

        if(roomName) {
          db.collection('rooms')
            .add({
                name: roomName,
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`} className="sidebarChat__link">
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`}/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2> 
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h3>Add new chat</h3>
        </div>
    );   
}

export default SidebarChat
