import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router-dom';
import { storage, firebase } from '../firebase';
import db from '../firebase';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatLandingScreen from './ChatLandingScreen';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Chat.css';

function Chat() {
    const history = useHistory();
    const [{ user }] = useStateValue();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
  
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
               
        } else if (!roomId) {
            history.push('/');
        }
    }, [roomId]);

    return (
        <div className="chat">
            {roomId ? 
                <>
                    <ToastContainer 
                        position="bottom-right"
                        autoClose={5000}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                    />
        
                    <div>
                        <ChatHeader 
                            roomName={roomName} 
                            roomId={roomId} 
                            messages={messages}
                            db={db}
                            storage={storage}
                            history={history}
                            toast={toast}
                        />
                    </div>
        
                    <div className="chat__body">
                        <ChatBody 
                            roomId={roomId}
                            messages={messages} 
                            user={user} 
                        />
                    </div>
        
                    <div>
                        <ChatFooter 
                            roomId={roomId}
                            db={db}
                            user={user}
                            firebase={firebase}
                            toast={toast}
                        />
                    </div>  
                </>
            :
                <ChatLandingScreen />
            }
            
        </div>
    );
}

export default Chat
