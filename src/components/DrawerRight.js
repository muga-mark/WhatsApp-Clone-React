import React, { useEffect, useState, useRef } from 'react';
import { useStateValue } from '../StateProvider';
import { useParams } from 'react-router-dom';
import { IconButton, Avatar, CloseIcon, MenuItem, Drawer, ArrowBackIcon, EditIcon, 
    SearchOutlinedIcon, DonutLargeIcon, ChatIcon, MoreVertIcon, CheckIcon } from './material-ui';
import { makeStyles } from '@material-ui/core/styles';
import db from '../firebase';
import { auth } from '../firebase';
import './Drawer.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        // width: '30vw',
    },
    drawerPaper: {
        width: '30vw',
    },
});

function DrawerRight() {
    const classes = useStyles();
    const [{ user, drawerRight },  dispatch] = useStateValue();
    // const [searchedMessage, setSearchedMessage] = useState("");
    const {roomId } = useParams();
    
    

    const searchMessage = () => {
        
    };


    const handleDrawerClose = () => {
        dispatch({
            type: 'SET_DRAWER_RIGHT',
            drawerRight: false,
        })
    };



    // console.log(drawerRight);

    return (
        <div>
            <Drawer
                // className={classes.drawer}
                anchor="right"
                variant="persistent"
                open={drawerRight}
                classes={{ paper: classes.drawerPaper }}
                >
                <div className="drawerRight__header">
                    {/* <div className="drawerRight__header_container"> */}
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon /> 
                        </IconButton>
                        <p>Search Messages</p>
                    {/* </div> */}
                </div>

                <div className="drawerRight__search">
                    <div className="drawerRight__searchContainer">
                        <SearchOutlinedIcon onClick={searchMessage}/>
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                <div className="drawerRight__content">
                    <p>Search for messages in this room.</p>
                    {/* {searchedMessage} */}
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerRight
