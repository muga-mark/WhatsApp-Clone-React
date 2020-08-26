import React, { useEffect, useState } from 'react'
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

function Chat() {
    const [input, setInput] = useState('');
    // const [seed, setSeed] = useState('');
    const {roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [{ user },  dispatch] = useStateValue();
    const [messages, setMessages] = useState([]);
    
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
    console.log('MESSAGES in chat.js', messages); 

    // useEffect(() => {
    //     setSeed(Math.floor(Math.random() * 5000)); 
    // }, [roomId]);

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

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />

                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                    <p>Last seen {" "}
                    {messages[messages.length-1]? (
                    new Date(messages[messages.length-1]?.timestamp?.toDate()).toLocaleTimeString([], { 
                        weekday: "long",
                        year: "numeric",
                        month:"long",
                        day:"numeric",
                        hour: 'numeric', 
                        hour12: true, 
                        minute: 'numeric'
                        })): (" ")}
                    </p>
                    </div>
                
 
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

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
