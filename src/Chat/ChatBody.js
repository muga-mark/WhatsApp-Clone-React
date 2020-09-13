import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import './ChatBody.css'


function ChatBody({ messages, user, roomId }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if(roomId){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }
    useEffect(scrollToBottom, [messages]);

    return (
        <div>
            {messages.length>0 ?
            <p className="chat__message_reminder">
                <NoEncryptionIcon /> This is a whatsapp clone. Messages are not encrpyted.
            </p>
            :null}
               
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

                    <div className="chat__body_video_container">
                        {message.video?
                            <div className='player-wrapper'>
                                <ReactPlayer
                                    className='react-player'
                                    width='100%'
                                    height='100%'
                                    url={message.video} 
                                    controls={true}
                                />
                            </div>  
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
