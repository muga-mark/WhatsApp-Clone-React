import React from 'react';
import Avatar from '@material-ui/core/Avatar';
// import DrawerLeft from './DrawerLeft';

function UserProfile( { photoURL, onClick }) {

    return (
        <div style={{cursor: 'pointer'}}>
            <Avatar 
                src={photoURL} 
                onClick={onClick}
            />
            {/* <DrawerLeft /> */}
        </div>
    )
}

export default UserProfile