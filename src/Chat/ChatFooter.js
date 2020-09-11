import React, { useState } from 'react';
import { toastInfo } from '../shared/toastInfo';
import TooltipCustom from '../shared/TooltipCustom';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import './ChatFooter.css';

function ChatFooter( { roomId, db, firebase, user }) {
    const [input, setInput] = useState('');
    const emoticonToastId = "emoticon";
    const voiceMessageToastId = "voiceMessage";

    const sendMessage = (e) => {
        e.preventDefault();
        
        if(roomId){
            if(input){
                db.collection("rooms").doc(roomId).collection('messages').add({
                    message: input,
                    name: user.displayName,
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }
        }
        setInput("");
    };

    const emoticons = () => {
        toastInfo("Emoticons is not available!", emoticonToastId, "bottom-right");
    }

    const voiceMessage = () => {
        toastInfo("Voice Message is not available!", voiceMessageToastId, "bottom-right");
    }

    return (
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
    )
}

export default ChatFooter
