import React from 'react';
// import ReactPlayer from 'react-player';
//importing material-ui
import Zoom from '@material-ui/core/Zoom';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
//importing material-ui-icons
import CloseIcon from '@material-ui/icons/Close';
//importing styles
import './DialogCustom.css'

function DialogCustom({ open, close, user, photo }) {
    
    return (
        <Dialog
            open={open}
            fullScreen 
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title-dialogCustom">
                <div>
                    <Avatar src={user.photoURL}/>
                </div>
                <div>
                    <IconButton edge="end" color="inherit" onClick={close} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <Zoom in={open} style={{ transitionDelay: open ? '300ms' : '0ms' }}>
                    <img src={photo} alt="" className="DialogCustom__photo"/>
                </Zoom>
            </DialogContent>
        </Dialog>
    )
}

export default DialogCustom
