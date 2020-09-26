import React, { useState } from 'react';
import TooltipCustom from '../shared/TooltipCustom';
// import db from '../firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ChatIcon from '@material-ui/icons/Chat';

function NewChat({ user, db, firebase }) {
    const [roomName, setRoomName] = useState("");
    const [open, setOpen] = useState(false);
    
    const handleNewChatOpen = () => {
        setOpen(true);
    };

    const handleNewChatClose = () => {
        setOpen(false);
        setRoomName("");
    };

    const createChat = (e) => {
        e.preventDefault();

        if(roomName) {
          db.collection("rooms")
            .add({
                roomOwner: user.uid,
                createdBy: user.displayName,
                name: roomName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function(docRef) {
                // console.log("Document written with ID: ", docRef.id);
                db.collection("rooms").doc(docRef.id).set({
                    id: docRef.id
                },{ merge: true });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
        setOpen(false);
        setRoomName("");
    }

    return (
        <div>
            <TooltipCustom 
                name="New Chat" 
                onClick={() => handleNewChatOpen()} 
                icon={<ChatIcon />}
            />

            <Dialog open={open} onClose={handleNewChatClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Chat Room</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room Name"
                    type="text"
                    fullWidth
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNewChatClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={createChat} color="primary" disabled={!roomName}>
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default NewChat
