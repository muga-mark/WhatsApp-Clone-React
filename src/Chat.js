import React, { useEffect, useState } from 'react'
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFile';

function Chat() {
    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000)); 
        // return () => {
        //     cleanup
        // }
    }, [])

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

                    <div className="chat__headerInfo">
                        <h3>Room name</h3>
                        <p>Last seen at...</p>
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
                
            </div>

            <div className="chat__footer">

            </div>
        </div>
    )
}

export default Chat
