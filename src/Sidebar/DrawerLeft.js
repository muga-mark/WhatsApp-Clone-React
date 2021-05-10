import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
//importing components
import DropdownMenu from "../shared/DropdownMenu";
import { toastInfo } from "../shared/toastInfo";
import DialogCustom from "../shared/DialogCustom";
//importing material-ui
import Zoom from "@material-ui/core/Zoom";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
//importing material-ui-icons
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
//importing styles
import "./DrawerLeft.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    position: "absolute",
  },
}));

function DrawerLeft({ drawerLeft, setDrawerLeft, db, auth, storage }) {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [showEditName, setShowEditName] = useState(false);
  const [showEditAbout, setShowEditAbout] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [uploadPhotoLink, setUploadPhotoLink] = useState(null);
  const [showDialogUpload, setShowDialogUpload] = useState(false);
  const [menuProfile, setMenuProfile] = useState(null);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    setName(user.displayName);

    db.collection("users")
      .doc(user.uid)
      .onSnapshot(function (doc) {
        setPhoto(doc.data()?.photoURL);
        setAbout(doc.data()?.about);
      });
  }, [user.uid, user.displayName, db]);

  const updateName = (e) => {
    e.preventDefault();

    if (user.uid) {
      db.collection("users")
        .doc(user.uid)
        .update({
          name: name,
        })
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

      auth.currentUser.updateProfile({
        displayName: name,
      });
    }
    setShowEditName(false);
  };

  const updateAbout = (e) => {
    e.preventDefault();

    if (user.uid) {
      db.collection("users")
        .doc(user.uid)
        .update({
          about: about,
        })
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
    setShowEditAbout(false);
  };

  const editName = () => {
    setShowEditName(true);
  };

  const editAbout = () => {
    setShowEditAbout(true);
  };

  const handleDrawerClose = () => {
    setDrawerLeft(false);
    setShowEditName(false);
    setShowEditAbout(false);
  };

  const viewPhoto = () => {
    const viewPhoto = "viewPhoto";

    if (user) {
      setShowProfilePhoto(true);
    } else {
      toastInfo("You have no photo!", viewPhoto, "top-center");
    }
    setMenuProfile(null);
  };

  const viewPhotoClose = () => {
    setShowProfilePhoto(false);
  };

  const takePhoto = () => {
    const takePhoto = "takePhoto";
    toastInfo("Take photo is not yet available!", takePhoto, "top-center");
  };

  const removedPhoto = () => {
    const removedPhoto = "removedPhoto";
    toastInfo(
      "Removed photo is not yet available!",
      removedPhoto,
      "top-center"
    );
  };

  const onFileChangeImage = async (e) => {
    const imageFileSizeToastId = "imageFileSizeToastId";
    const file = e.target.files[0];

    if (file.size > 3 * 1024 * 1024) {
      toastInfo(
        "Image should not exceed more than 3Mb",
        imageFileSizeToastId,
        "top-center"
      );
    } else {
      const storageRef = storage.ref();
      if (user.isAnonymous === true) {
        const imagesRef = storageRef.child(`user/anonymous/${user.uid}`);
        const fileRef = imagesRef.child(file.name);
        await fileRef.put(file);
        setUploadPhotoLink(await fileRef.getDownloadURL());
        console.log("uploading image", uploadPhotoLink);
      } else {
        const imagesRef = storageRef.child(`user/regular/${user.uid}`);
        const fileRef = imagesRef.child(file.name);
        await fileRef.put(file);
        setUploadPhotoLink(await fileRef.getDownloadURL());
        console.log("uploading image", uploadPhotoLink);
      }
    }
    setMenuProfile(null);
    setShowDialogUpload(true);
  };

  const uploadPhoto = () => {
    return (
      <div className="profileMenu_uploadPhoto">
        <label htmlFor="file-input">Upload photo</label>
        <input
          id="file-input"
          type="file"
          onChange={onFileChangeImage}
          accept="image/*"
        />
      </div>
    );
  };

  const handleUploadPhoto = () => {
    const uploadPhotoError = "uploadPhotoError";

    if (uploadPhotoLink) {
      auth.currentUser.updateProfile({
        photoURL: uploadPhotoLink,
      });
      db.collection("users").doc(user.uid).set(
        {
          photoURL: uploadPhotoLink,
        },
        { merge: true }
      );
      setShowDialogUpload(false);
    } else {
      toastInfo("Select photo to upload!", uploadPhotoError, "top-center");
    }
  };

  const handleDialogUploadClose = () => {
    setShowDialogUpload(false);
  };

  const handleProfileMenu = (event) => {
    setMenuProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuProfile(null);
  };

  const menuLists = [
    {
      title: "View Photo",
      onClick: () => viewPhoto(),
      id: Math.random() * 100000,
    },
    {
      title: "Take photo",
      onClick: () => takePhoto(),
      id: Math.random() * 100000,
    },
    {
      title: uploadPhoto(),
      onClick: () => handleUploadPhoto(),
      id: Math.random() * 100000,
    },
    {
      title: "Removed photo",
      onClick: () => removedPhoto(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div>
      <Drawer
        anchor="left"
        variant="persistent"
        open={drawerLeft}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="drawerLeft__header">
          <div className="drawerLeft__header_container">
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIcon />
            </IconButton>
            <p>Profile</p>
          </div>
        </div>

        <div className="drawerLeft__content">
          <div className="drawerLeft__content_photo">
            <div className="profilePhoto">
              <Zoom
                in={drawerLeft}
                style={{ transitionDelay: drawerLeft ? "300ms" : "0ms" }}
              >
                {photo ? (
                  <Avatar src={photo} className="profilePhoto__layer_bottom" />
                ) : (
                  <Avatar />
                )}
              </Zoom>
              <div
                className="profilePhoto__layer_top"
                onClick={handleProfileMenu}
              >
                <div className="profilePhoto__text">
                  <PhotoCameraIcon />
                  <p>CHANGE</p>
                  <p>PROFILE PHOTO</p>
                </div>
              </div>
            </div>

            <DropdownMenu
              menuLists={menuLists}
              menu={menuProfile}
              handleMenuClose={handleProfileMenuClose}
            />

            <DialogCustom
              open={showProfilePhoto}
              close={viewPhotoClose}
              photo={photo}
              user={user}
            />
          </div>

          <div className="profileMenu__diaglog">
            <Dialog
              open={showDialogUpload}
              onClose={handleDialogUploadClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title-drawerLeft">
                Upload Photo
              </DialogTitle>
              <DialogContent id="form-dialog-content">
                <div className="profileMenu__uploadPhoto_dialog">
                  <img src={uploadPhotoLink} alt="" />
                </div>
              </DialogContent>
              <DialogActions>
                <div className="profileMenu_uploadPhoto_iconButton">
                  <IconButton onClick={handleUploadPhoto}>
                    <CheckIcon />
                  </IconButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>

          <div className="drawerLeft__content_name">
            <p>Your Name</p>
            <form>
              {showEditName ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    styles={{ borderBottom: "1px solid green !important" }}
                  />
                  <CheckIcon onClick={updateName} />
                </>
              ) : (
                <>
                  <span>{name}</span>
                  <EditIcon onClick={editName} />
                </>
              )}
            </form>
          </div>

          <div className="drawerLeft__note">
            <span>
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </span>
          </div>

          <div className="drawerLeft__content_name">
            <p>About</p>
            <form>
              {showEditAbout ? (
                <>
                  <input
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    type="text"
                  />
                  <CheckIcon onClick={updateAbout} />
                </>
              ) : (
                <>
                  <span>{about}</span>
                  <EditIcon onClick={editAbout} />
                </>
              )}
            </form>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default DrawerLeft;
