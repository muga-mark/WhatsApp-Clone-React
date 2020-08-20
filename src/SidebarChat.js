import React, { useEffect, useState } from 'react'
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';

function SidebarChat({ addNewChat }) {
    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000)); 
        // return () => {
        //     cleanup
        // }
    }, [])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");

        if(roomName) {

        }
    }

    return !addNewChat ? (
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
            <div className="sidebarChat__info">
                <h2>Room name</h2> 
                <p>Last message...</p>
            </div>
        </div>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new chat</h2>
        </div>
    );   
}

export default SidebarChat
