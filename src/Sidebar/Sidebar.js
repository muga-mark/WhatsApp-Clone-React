import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider';
import { setDrawerLeft, setMenuSidebar } from "../actions/drawerAction"
import SearchBar from '../shared/SearchBar';
import UserProfile from './UserProfile';
import db from '../firebase';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';
import NewChat from './NewChat';
import Status from './Status';
import DropDownMenu from './DropDownMenu';
import SidebarChat from './SidebarChat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sidebar.css';

function Sidebar( { rooms }) {
    const history = useHistory();
    // const [rooms, setRooms] = useState([]);
    const [searchedRoom, setSearchedRoom] = useState([]);
    const [search, setSearch] = useState("");
    const [{ user },  dispatch] = useStateValue();
    const [errorMessage, setErrorMessage] = useState("");
    
    
    const notAvailable = () => {
        const menuToastId = "menu";
        toast.info("This is not available!", {
            toastId: menuToastId,
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        );
    }

    const logout = () => {
        auth.signOut();
        history.push('/');
    };

    const handleDrawerLeftOpen = () => {
        dispatch(setDrawerLeft(true));
        dispatch(setMenuSidebar(null));
    };

    const menuLists = [
        {
            title: "New Group",
            onClick: () => notAvailable(),
        },
        {
            title: "Create a room",
            onClick: () => notAvailable(),
        },
        {
            title: "Profile",
            onClick: () => handleDrawerLeftOpen(),
        },
        {
            title: "Archived",
            onClick: () => notAvailable(),
        },
        {
            title: "Starred",
            onClick: () => notAvailable(),
        },
        {
            title: "Settings",
            onClick: () => notAvailable(),
        },
        {
            title: "Logout",
            onClick: () => logout(),
        },
    ]

    const searchRoom = () => {
        if(!search) return;

        if(search){
            db.collection("rooms")
            .where("name", "==", `${search}`)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    setSearchedRoom(querySnapshot.docs.map(doc => 
                          ({
                              id: doc.id,
                              data: doc.data(),
                          }))
                      )
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
                setErrorMessage(error);
            });
        }
        
    }

    console.log("search room", search);
    console.log("search", searchedRoom);
    
    return (
        <div className="sidebar">
            <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
            />

            <div className="sidebar__header">
                <UserProfile 
                    photoURL={user.photoURL} 
                    onClick={() => handleDrawerLeftOpen()}
                />
                
                <div className="sidebar__headerRight">
                    <Status />
                    <NewChat />
                    <DropDownMenu 
                        menuLists={menuLists} 
                        // anchorEl2={anchorEl2}
                    />
                </div>
            </div>

            <SearchBar 
                searchRoom={() => searchRoom()} 
                search={search} 
                setSearch={setSearch} 
                placeholder="Search or start new chat" 
            />
            <div><p>{errorMessage}</p></div>

            <div className="sidebar__chats">
                <div className="sidebar__chatsContainer">
                    
                    {search ? 
                        <div>
                            {searchedRoom.map(room => (
                            <SidebarChat 
                                key={room.id} 
                                id={room.id} 
                                name={room.data.name} 
                            />
                            ))}
                        </div>  
                    : 
                        <div> 
                            {rooms.map(room => (
                                <SidebarChat 
                                    key={room.id} 
                                    id={room.id} 
                                    name={room.data.name} 
                                />
                            ))}
                        </div>  
                    }
                    
                </div>
            </div>

        </div>
    );
}

export default Sidebar
