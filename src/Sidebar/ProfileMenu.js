import React, { useState, useEffect } from 'react';
import { useStateValue } from '../StateProvider';
import { setMenuProfile } from '../actions/menuAction';
import { auth } from '../firebase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import './DrawerLeft.css';

function ProfileMenu( { user, viewPhoto, takePhoto, removedPhoto, toastInfo, db, storage}) {
    const [{ menuProfile, drawerLeft },  dispatch] = useStateValue();
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [photo, setPhoto] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(user.photoURL){
            db.collection("users")
            .doc(user.uid)
            .onSnapshot(snapshot => (
                setPhoto(snapshot.data()?.photoURL)
            ));
        }
    }, [user.photoURL])

    const handleUploadPhotoClose = () => {
        setOpen(false);
    };

    const handleCloseDropDownMenu = () => {
        dispatch(setMenuProfile(null));
    };

    const handleClickDropDownMenu = (event) => {
        dispatch(setMenuProfile(event.currentTarget));
    };

    const onFileChangeImage = async (e) => {
        const imageFileSizeToastId = "imageFileSizeToastId";
        const file = e.target.files[0];
        // console.log("onchange image");
        if(file.size > 3 * 1024 * 1024){
            toastInfo("Image should not exceed more than 3Mb", imageFileSizeToastId, "top-center"); 
        }else{
            const storageRef = storage.ref();
            if(user.isAnonymous === true){
                const imagesRef = storageRef.child(`user/anonymous/${user.uid}`);
                const fileRef = imagesRef.child(file.name);
                await fileRef.put(file);
                setUploadPhoto(await fileRef.getDownloadURL());
                console.log("uploading image", uploadPhoto);
            }else{
                const imagesRef = storageRef.child(`user/regular/${user.uid}`);
                const fileRef = imagesRef.child(file.name);
                await fileRef.put(file);
                setUploadPhoto(await fileRef.getDownloadURL());
                console.log("uploading image", uploadPhoto);
            }
        }
        dispatch(setMenuProfile(null));
        setOpen(true);
    };

    const handleUploadPhoto = () => {
        const uploadPhotoError = "uploadPhotoError";
        
        if(uploadPhoto) {
            auth.currentUser.updateProfile({
                photoURL: uploadPhoto,
            });
            db.collection("users").doc(user.uid).set({
                photoURL: uploadPhoto,
            },{ merge: true });
            setOpen(false);
        }else{
            toastInfo("Select photo to upload!", uploadPhotoError, "top-center");
        }
    }
    
    return (
        <div className="profilePhoto">
             <Zoom in={drawerLeft} style={{ transitionDelay: drawerLeft ? '300ms' : '0ms' }}>
                {photo?
                    <Avatar 
                        src={photo} 
                        className="profilePhoto__layer_bottom"
                    />
                :
                    <Avatar />    
                }
            </Zoom>
            <div className="profilePhoto__layer_top" onClick={handleClickDropDownMenu} >
                <div className="profilePhoto__text">
                    <PhotoCameraIcon />
                    <p>CHANGE</p>
                    <p>PROFILE PHOTO</p>
                </div>
            </div>
            
            <Menu 
                id="profile-menu"
                anchorEl={menuProfile}
                keepMounted
                open={Boolean(menuProfile)}
                onClose={handleCloseDropDownMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                getContentAnchorEl={null}
                >
                
                <MenuItem onClick={viewPhoto}>
                    View photo
                </MenuItem>
                <MenuItem onClick={takePhoto}>
                    Take photo
                </MenuItem>
                <MenuItem>
                    <div className="profileMenu_uploadPhoto">
                        <label htmlFor="file-input">
                            Upload photo
                        </label>
                        <input 
                            id="file-input"
                            type="file" 
                            onChange={onFileChangeImage} 
                            accept="image/*"
                        />
                    </div>
                </MenuItem>
                <MenuItem onClick={removedPhoto}>
                    Removed photo
                </MenuItem>
            </Menu>
            
            <div className="profileMenu__diaglog">
                <Dialog open={open} onClose={handleUploadPhotoClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Upload Photo</DialogTitle>
                    <DialogContent id="form-dialog-content">
                        <div className="profileMenu__uploadPhoto_dialog">
                            <img src={uploadPhoto} alt="" />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="profileMenu_uploadPhoto_iconButton">
                            <IconButton onClick={handleUploadPhoto} >
                                <CheckIcon />
                            </IconButton>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
                
        </div>
    )
}

export default ProfileMenu