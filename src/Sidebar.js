import React, { useEffect, useState } from 'react'
import SidebarChat from './SidebarChat';
import './Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import db from './firebase';
import { useStateValue } from './StateProvider';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [{ user },  dispatch] = useStateValue();

    useEffect(() => {
        const unsubscribe = db
            .collection("rooms")
            .onSnapshot((snapshot) => 
                setRooms(snapshot.docs.map(doc => 
                    ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
        
        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
                
            </div>

            <div className="sidebar__chats">
                <div className="sidebar__chatsContainer">
                    <SidebarChat addNewChat />
                    {rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar
