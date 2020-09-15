import React, { useState, useEffect } from 'react'
import { useStateValue } from '../StateProvider';
import { setDrawerLeft } from "../actions/drawerAction";
import { setMenuSidebar } from "../actions/menuAction";
import { toastInfo } from '../shared/toastInfo';
import db from '../firebase';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';
import SearchBar from '../shared/SearchBar';
import DrawerLeft from './DrawerLeft';
// import searchRoom from '../shared/searchRoom';
import UserProfile from './UserProfile';
import NewChat from './NewChat';
import Status from './Status';
import SidebarMenu from './SidebarMenu';
import SidebarChat from './SidebarChat';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sidebar.css';

function Sidebar( { rooms }) {
    const history = useHistory();
    const [searchedRoom, setSearchedRoom] = useState([]);
    const [search, setSearch] = useState('');
    const [{ user },  dispatch] = useStateValue();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(rooms.length>0){
            setLoading(true);
        }
        if(search) {
            db.collection("rooms")
            .where("name", ">=", `${search}`)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setSearchedRoom(querySnapshot.docs.map(doc => 
                          ({
                              id: doc.id,
                              data: doc.data(),
                          }))
                      )
                });
            })
            .catch(function(error) {
                setErrorMessage(error);
            });

            db.collection("rooms")
            .where("name", "==", `${search}`)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setSearchedRoom(querySnapshot.docs.map(doc => 
                          ({
                              id: doc.id,
                              data: doc.data(),
                          }))
                      )
                });
            })
            .catch(function(error) {
                setErrorMessage(error);
            });
               
        } else if (!search) {
            setSearchedRoom([]);
        }
    }, [search, rooms]);

    const newGroup = () => {
        const newGroup = "newGroup";
        toastInfo("New Group is not available!", newGroup, "top-center");
    }

    const handleDrawerLeftOpen = () => {
        dispatch(setDrawerLeft(true));
        dispatch(setMenuSidebar(null));
    }

    const archive = () => {
        const archive = "archive";
        toastInfo("Archive is not available!", archive, "top-center");
    }

    const starred = () => {
        const starred = "starred";
        toastInfo("Starred is not available!", starred, "top-center");
    }

    const settings = () => {
        const settings = "settings";
        toastInfo("Settings is not available!", settings, "top-center");
    }
    
    const logout = () => {
        auth.signOut();
        history.push('/');
    }

    const searchRoom = () => {
        const searchedRoom = "searchedRoom";
        toastInfo("Search is case-sensitive!", searchedRoom, "top-center");
    }

    const menuLists = [
        {
            title: "New Group",
            onClick: () => newGroup(),
        },
        {
            title: "Profile",
            onClick: () => handleDrawerLeftOpen(),
        },
        {
            title: "Archived",
            onClick: () => archive(),
        },
        {
            title: "Starred",
            onClick: () => starred(),
        },
        {
            title: "Settings",
            onClick: () => settings(),
        },
        {
            title: "Logout",
            onClick: () => logout(),
        },
    ]

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
                    id="UserProfile"
                    photoURL={user.photoURL} 
                    onClick={() => handleDrawerLeftOpen()}
                />
                <DrawerLeft />
                
                <div className="sidebar__headerRight">
                    <Status />
                    <NewChat />
                    <SidebarMenu menuLists={menuLists} />
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
                {loading?
                <>
                    {rooms.length>0 ?          
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
                    :
                        <div className="sidebar__chatsContainer_empty">
                            <span>No chats</span>
                        </div>
                    }     
                </>
                :
                    <CircularProgress />
                }
            </div>

        </div>
    );
}

export default Sidebar

