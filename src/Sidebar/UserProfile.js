import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import DrawerLeft from './DrawerLeft';

function UserProfile(props) {
    console.log("onClick", props);
    return (
        <div style={{cursor: 'pointer'}}>
            <Avatar 
                src={props.photoURL} 
                onClick={() => props.onClick()}
            />
            <DrawerLeft />
        </div>
    )
}

export default UserProfile