import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
//importing firebase
import db from '../firebase';
import { auth, storage, firebase } from '../firebase';
//importing components
import UserAvatar from './UserAvatar';
import NewChat from './NewChat';
import Status from './Status';
import DropdownMenu from '../shared/DropdownMenu';
import DrawerLeft from './DrawerLeft';
import SearchBar from '../shared/SearchBar';
import SidebarChat from './SidebarChat';
import { toastInfo } from '../shared/toastInfo';
import TooltipCustom from '../shared/TooltipCustom';
//importing material-ui
import CircularProgress from '@material-ui/core/CircularProgress';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//importing styles
import './Sidebar.css';

function Sidebar( { rooms }) {
    const history = useHistory();
    const [searchedRoom, setSearchedRoom] = useState([]);
    const [search, setSearch] = useState('');
    const [{ user }] = useStateValue();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [drawerLeft, setDrawerLeft] = useState(false);
    const [menuSidebar, setMenuSidebar] = useState(null);

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
        toastInfo("New Group is not yet available!", newGroup, "top-center");
    }

    const handleDrawerLeftOpen = () => {
        setMenuSidebar(null);
        setDrawerLeft(true);
    }

    const handleMenuOpen = (event) => {
        setMenuSidebar(event.currentTarget);
    }

    const handleMenuClose = () => {
        setMenuSidebar(null);
    }

    const archive = () => {
        const archive = "archive";
        toastInfo("Archive is not yet available!", archive, "top-center");
    }

    const starred = () => {
        const starred = "starred";
        toastInfo("Starred is not yet available!", starred, "top-center");
    }

    const settings = () => {
        const settings = "settings";
        toastInfo("Settings is not yet available!", settings, "top-center");
    }
    
    const logout = () => {
        if(user.isAnonymous){
            auth.currentUser.delete().then(function() {
              // User deleted. Redirect to login page...
              history.push('/');
            }).catch(function(error) {
              // An error happened.
              console.log("error deleting anonymous user",error);
            });
        }else{
            //perform logout
            auth.signOut();
        }
    }

    // const searchRoom = () => {
    //     const searched = "searchedRoom";
    //     toastInfo("Search is case-sensitive!", searched, "top-center");
    // }

    const menuLists = [
        {
            title: "New Group",
            onClick: () => newGroup(),
            id: Math.random()*100000,
        },
        {
            title: "Profile",
            onClick: () => handleDrawerLeftOpen(),
            id: Math.random()*100000,
        },
        {
            title: "Archived",
            onClick: () => archive(),
            id: Math.random()*100000,
        },
        {
            title: "Starred",
            onClick: () => starred(),
            id: Math.random()*100000,
        },
        {
            title: "Settings",
            onClick: () => settings(),
            id: Math.random()*100000,
        },
        {
            title: "Logout",
            onClick: () => logout(),
            id: Math.random()*100000,
        },
    ]
    // console.log("sidebar room search", searchedRoom);
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <UserAvatar 
                    id="UserProfile"
                    photoURL={user.photoURL} 
                    onClick={() => handleDrawerLeftOpen()}
                />
                <DrawerLeft 
                    drawerLeft={drawerLeft} 
                    setDrawerLeft={setDrawerLeft} 
                    db={db}
                    auth={auth}
                    storage={storage}
                />
                
                <div className="sidebar__headerRight">
                    <Status />
                    <NewChat 
                        db ={db}
                        user={user}
                        firebase={firebase}
                    />
                    <TooltipCustom 
                        name="Menu" 
                        icon={<MoreVertIcon />} 
                        onClick={handleMenuOpen}
                    />
                    <DropdownMenu 
                        menuLists={menuLists}
                        menu={menuSidebar}
                        handleMenuOpen={handleMenuOpen}
                        handleMenuClose={handleMenuClose}
                    />
                </div>
            </div>

            <SearchBar 
                // onClick={() => searchRoom()} 
                search={search} 
                setSearch={setSearch} 
                placeholder="Search or start new chat" 
            />
            <div><p>{errorMessage}</p></div>

            <div className="sidebar__chats">
                {loading ?
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
                    <div className="sidebar__chatsContainer_loading">
                        <div>
                            <CircularProgress />
                        </div>
                    </div>
                }
            </div>

        </div>
    );
}

export default Sidebar

