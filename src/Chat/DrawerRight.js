import React from 'react';
import { useStateValue } from '../StateProvider';
import { setDrawerRight } from '../actions/drawerAction';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { makeStyles } from '@material-ui/core/styles';
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

function DrawerRight({ searchMessage }) {
    const classes = useStyles();
    const [{ drawerRight },  dispatch] = useStateValue();
    
    const handleDrawerClose = () => {
        dispatch(setDrawerRight(false))
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
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerRight
