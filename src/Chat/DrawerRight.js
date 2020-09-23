import React, { useState, useEffect } from 'react';
//importing components
import SearchBar from '../shared/SearchBar';
//importing material-ui
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
//importing material-ui-icons
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
//importing styles
import './DrawerRight.css';

const useStyles = makeStyles ((theme) => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        [theme.breakpoints.up('xs')]: {
            width: '100vw',
        },
        [theme.breakpoints.up('sm')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('md')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('lg')]: {
            width: '30vw',
        },
    },
}));

function DrawerRight({ drawerRight, setDrawerRight, messages, user }) {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [isFoundMessage, setIsFoundMessage] = useState(false);
    
    const findMessage = function(myMessages){
        return function(x){
            var searchMessage = x.message + '' + x.caption;
            return searchMessage.toLowerCase().includes(myMessages.toLowerCase()) || !myMessages;
        }
    }
    
    
    
    useEffect(() => {

        const messageResult = () => {
            return (
                <>
                    {messages.filter(findMessage(search)).map(message => (
                        <p key={message.id}>
                            {message.message}
                            {message.caption}
                        </p>
                    ))}
                </>
            )
        }

        if(search) {
            var result = messageResult();
            // console.log("result", result.props.children)
            if(result.props.children.length>0){
                setIsFoundMessage(true);
                console.log("search message sucess");
            }else{
                setIsFoundMessage(false);
                console.log("search message fail");
            }
        }
    }, [search, messages]);

    
    const handleDrawerClose = () => {
        setDrawerRight(false);
    };

    return (
        <div>
            <Drawer
                anchor="right"
                variant="persistent"
                open={drawerRight}
                classes={{ paper: classes.drawerPaper }}
                >
                <div className="drawerRight__header">
                    <IconButton onClick={handleDrawerClose}>
                        <CloseIcon /> 
                    </IconButton>
                    <p>Search Messages</p>
                </div>

                <SearchBar 
                    search={search} 
                    setSearch={setSearch} 
                    placeholder="Search..." 
                />

                <div className={`drawerRight__content ${(isFoundMessage===true && search.length>0) && "drawerRight__content_searched"}`}>
                    {search.length>0? 
                        <>
                            {isFoundMessage? 
                                <>
                                    {messages.filter(findMessage(search)).map(message => (
                                        <div key={message.id} className="drawerRight__content_searched_message">
                                            <p>
                                                {new Date(message.timestamp?.toDate())
                                                        .toLocaleTimeString('en-US', 
                                                            { 
                                                                hour: 'numeric', 
                                                                hour12: true, 
                                                                minute: 'numeric' 
                                                            }
                                                        )
                                                }<br/>
                                            </p>
                                            <p id="last_p">
                                                {message.uid === user.uid ?
                                                    <DoneIcon />
                                                :null}
                                                {message.message}
                                                {message.caption}
                                            </p>
                                            <Divider />
                                        </div>
                                    ))}
                                </>
                                : <p>No message found</p>
                            }
                        
                        </>
                        : <p>Search for messages in this room.</p>
                    }
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerRight
