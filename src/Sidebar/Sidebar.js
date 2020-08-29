import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider';
import { setDrawerLeft } from "../actions/drawerAction"
import SearchBar from '../shared/SearchBar';
import UserProfile from './UserProfile';
import db from '../firebase';
import NewChat from './NewChat';
import Status from './Status';
import DropDownMenu from './DropDownMenu';
import SidebarChat from './SidebarChat';
import './Sidebar.css';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [{ user },  dispatch] = useStateValue();
    
    const handleDrawerLeftOpen = () => {
        dispatch(setDrawerLeft(true));
    };

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
                <UserProfile 
                    photoURL={user.photoURL} 
                    onClick={() => handleDrawerLeftOpen()}
                />
                
                <div className="sidebar__headerRight">
                    <Status />
                    <NewChat />
                    <DropDownMenu />
                </div>
            </div>

            <SearchBar placeholder="Search or start new chat" />

            <div className="sidebar__chats">
                <div className="sidebar__chatsContainer">
                    {rooms.map(room => (
                        <SidebarChat 
                            key={room.id} 
                            id={room.id} 
                            name={room.data.name} 
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Sidebar
