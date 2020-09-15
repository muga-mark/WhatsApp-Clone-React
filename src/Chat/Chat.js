import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router-dom';
import { storage, firebase } from '../firebase';
import db from '../firebase';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatLandingScreen from './ChatLandingScreen';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';
import './Chat.css';

function Chat() {
    const history = useHistory();
    const [{ user }] = useStateValue();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showLandingScreenPhoto, setShowLandingScreenPhoto] = useState(false);
  
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
                    doc.data())),
                setLoading(true)
            ));

        } else if (!roomId) {
            setShowLandingScreenPhoto(true);
            history.push('/');
        }
    }, [roomId, history]);

    return (
        <div className="chat">
            {roomId ? 
                <>
                    <div>
                        <ChatHeader 
                            roomName={roomName} 
                            roomId={roomId} 
                            messages={messages}
                            db={db}
                            storage={storage}
                            history={history}
                        />
                    </div>
        
                    <div className="chat__body">
                        {loading?
                            <ChatBody 
                                roomId={roomId}
                                messages={messages} 
                                user={user} 
                            />
                        :
                            <div className="chat__body_loading">
                                <div>
                                <CircularProgress />
                                </div>
                            </div>
                        }
                    </div>
        
                    <div>
                        <ChatFooter 
                            roomName={roomName} 
                            roomId={roomId}
                            db={db}
                            firebase={firebase}
                            storage={storage}
                        />
                    </div>  
                </>
            :
                <ChatLandingScreen 
                    showLandingScreenPhoto={showLandingScreenPhoto} 
                />
            }
            
        </div>
    );
}

export default Chat
