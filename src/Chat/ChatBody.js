import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'
import IconButton from '@material-ui/core/IconButton';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import PictureInPictureAltIcon from '@material-ui/icons/PictureInPictureAlt';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import './ChatBody.css'

function ChatBody({ messages, user, roomId }) {
    const messagesEndRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [pip, setPip] = useState(false);

    const scrollToBottom = () => {
        if(roomId){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }
    useEffect(scrollToBottom, [messages]);

    
    const handlePlayPause = () => {
        if(playing===false){
            setPlaying(true)
        }else{
            setPlaying(false)
        }
    }

    const handleStop = () => {
        setPlaying(false)
    }

    const handleTogglePIP = () => {
        if(pip===false){
            setPip(true)
        }else{
            setPip(false)
        }
    }

    const handleEnablePIP = () => {
        console.log('onEnablePIP')
        setPip(true);
    }
    
    const handleDisablePIP = () => {
        console.log('onDisablePIP')
        setPip(false);
    }

    return (
        <div>
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
                        {message.video?
                            <>
                            <ReactPlayer 
                                url={message.video} 
                                playing={playing}
                                pip={pip}
                                onEnablePIP={handleEnablePIP}
                                onDisablePIP={handleDisablePIP}
                            />
                            <div className="chat__body_image_container_buttons">
                                <IconButton onClick={handleStop}>
                                    <StopIcon />
                                </IconButton>
                                <IconButton onClick={handlePlayPause}>
                                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                                </IconButton>
                                <IconButton onClick={handleTogglePIP}>
                                    {pip ? <OpenInNewIcon /> : <PictureInPictureAltIcon />}
                                </IconButton>
                            </div>
                            </>
                        : null}
                    </div>  

                    <div className="chat__message_box">
                        <div>
                            {message.message}
                            {message.caption}
                        </div>
                        
                        <div className="chat__timestamp_container">
                            <span className="chat__timestamp">
                                {new Date(message.timestamp?.toDate())
                                    .toLocaleTimeString('en-US', 
                                        { 
                                            hour: 'numeric', 
                                            hour12: true, 
                                            minute: 'numeric' 
                                        }
                                    )
                                }
                            </span>
                        </div>

                    </div>   
                </div>
            ))}
            {/* it will automatically scroll drown everytime the user enters new chat message */}
            <div ref={messagesEndRef} />    
        </div>
    )
}

export default ChatBody
