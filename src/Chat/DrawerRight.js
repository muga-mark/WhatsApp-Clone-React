import React from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { makeStyles } from '@material-ui/core/styles';
import './DrawerRight.css';

const useStyles = makeStyles({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        width: '30vw',
    },
});

function DrawerRight() {
    const classes = useStyles();
    const {roomId } = useParams();
    const [{ user, drawerRight },  dispatch] = useStateValue();
    // const [searchedMessage, setSearchedMessage] = useState("");
    
    const handleDrawerClose = () => {
        dispatch({
            type: 'SET_DRAWER_RIGHT',
            drawerRight: false,
        })
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

                <div className="drawerRight__search">
                    <div className="drawerRight__searchContainer">
                        <SearchOutlinedIcon />
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
