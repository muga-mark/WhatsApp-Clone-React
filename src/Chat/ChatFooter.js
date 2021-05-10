import React, { useState } from "react";
import { useStateValue } from "../StateProvider";
import { toastInfo } from "../shared/toastInfo";
//importing components
import DrawerBottom from "./DrawerBottom";
import TooltipCustom from "../shared/TooltipCustom";
import { Picker } from "emoji-mart";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Slide from "@material-ui/core/Slide";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
//importing material-ui-icons
import CloseIcon from "@material-ui/icons/Close";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PhotoIcon from "@material-ui/icons/Photo";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import PersonIcon from "@material-ui/icons/Person";
//importing styles
import "emoji-mart/css/emoji-mart.css";
import "./ChatFooter.css";

const attachFileLists = [
  {
    title: "Room",
    icon: <VideoCallIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Contact",
    icon: <PersonIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Document",
    icon: <InsertDriveFileIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Camera",
    icon: <CameraAltIcon />,
    id: Math.random() * 100000,
  },
  {
    title: "Photos & Videos",
    icon: <PhotoIcon />,
    id: Math.random() * 100000,
  },
];

function ChatFooter({ roomName, roomId, db, firebase, storage }) {
  const [{ user }] = useStateValue();
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [fileVideoUrl, setFileVideoUrl] = useState(null);
  const [drawerBottom, setDrawerBottom] = useState(false);
  const [showAttachFile, setShowAttachFile] = useState(false);

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   const youtubeLink = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  //   const facebookVideoLink = /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
  //   const vimeoLink = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
  //   const soundcloudLink = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
  //   const dailymotionLink = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
  //   const urlLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  //   if (roomId) {
  //     if (
  //       youtubeLink.test(input) ||
  //       facebookVideoLink.test(input) ||
  //       vimeoLink.test(input) ||
  //       soundcloudLink.test(input) ||
  //       dailymotionLink.test(input)
  //     ) {
  //       db.collection("rooms")
  //         .doc(roomId)
  //         .collection("messages")
  //         .add({
  //           message: "",
  //           video: input,
  //           name: user.displayName,
  //           uid: user.uid,
  //           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //         })
  //         .then(function (docRef) {
  //           console.log("Document written with ID: ", docRef.id);
  //           db.collection("rooms")
  //             .doc(roomId)
  //             .collection("messages")
  //             .doc(docRef.id)
  //             .set(
  //               {
  //                 id: docRef.id,
  //               },
  //               { merge: true }
  //             );
  //         })
  //         .catch(function (error) {
  //           console.error("Error adding document: ", error);
  //         });
  //     } else if (urlLink.test(input)) {
  //       db.collection("rooms")
  //         .doc(roomId)
  //         .collection("messages")
  //         .add({
  //           message: "",
  //           url: input,
  //           name: user.displayName,
  //           uid: user.uid,
  //           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //         })
  //         .then(function (docRef) {
  //           console.log("Document written with ID: ", docRef.id);
  //           db.collection("rooms")
  //             .doc(roomId)
  //             .collection("messages")
  //             .doc(docRef.id)
  //             .set(
  //               {
  //                 id: docRef.id,
  //               },
  //               { merge: true }
  //             );
  //         })
  //         .catch(function (error) {
  //           console.error("Error adding document: ", error);
  //         });
  //     } else if (/\S/.test(input)) {
  //       db.collection("rooms")
  //         .doc(roomId)
  //         .collection("messages")
  //         .add({
  //           message: input,
  //           name: user.displayName,
  //           uid: user.uid,
  //           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //         })
  //         .then(function (docRef) {
  //           // console.log("Document written with ID: ", docRef.id);
  //           db.collection("rooms")
  //             .doc(roomId)
  //             .collection("messages")
  //             .doc(docRef.id)
  //             .set(
  //               {
  //                 id: docRef.id,
  //               },
  //               { merge: true }
  //             );
  //         })
  //         .catch(function (error) {
  //           console.error("Error adding document: ", error);
  //         });
  //     }
  //   }
  //   setInput("");
  //   setEmoji(false);
  // };

  const attachFile = () => {
    const attachToastId = "attach";
    toastInfo(
      "All icons have the same functions, you can only upload images, gifs and videos!",
      attachToastId,
      "top-center"
    );
    if (showAttachFile === false) {
      setShowAttachFile(true);
    } else {
      setShowAttachFile(false);
    }
    // console.log("attachFile click", attachToastId);
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };

  const handleEmoticons = () => {
    setEmoji(true);
  };

  const handleEmoticonsClose = () => {
    setEmoji(false);
  };

  const voiceMessage = () => {
    const voiceMessageToastId = "voiceMessage";
    toastInfo(
      "Voice Message is not yet available!",
      voiceMessageToastId,
      "top-center"
    );
  };

  const onFileChange = async (e) => {
    const fileSizeToastId = "fileSizeToastId";
    const file = e.target.files[0];
    if (file.size > 12 * 1024 * 1024) {
      toastInfo(
        "File should not exceed more than 12MB",
        fileSizeToastId,
        "top-center"
      );
    } else {
      const storageRef = storage.ref();
      if (file.type.match("image.*")) {
        const imagesRef = storageRef.child(`rooms/${roomName}/images/`);
        const fileRef = imagesRef.child(new Date().getTime() + " " + file.name);
        await fileRef.put(file);
        setFileImageUrl(await fileRef.getDownloadURL());
        console.log("uploading image", fileImageUrl);
      } else if (file.type.match("video.*")) {
        const videosRef = storageRef.child(`rooms/${roomName}/videos`);
        const fileRef = videosRef.child(new Date().getTime() + " " + file.name);
        await fileRef.put(file);
        setFileVideoUrl(await fileRef.getDownloadURL());
        console.log("uploading video", fileVideoUrl);
      }
      setDrawerBottom(true);
    }
  };

  const handleClickAway = () => {
    setShowAttachFile(false);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      const youtubeLink = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      const facebookVideoLink = /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
      const vimeoLink = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
      const soundcloudLink = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
      const dailymotionLink = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      const urlLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

      if (roomId) {
        if (
          youtubeLink.test(input) ||
          facebookVideoLink.test(input) ||
          vimeoLink.test(input) ||
          soundcloudLink.test(input) ||
          dailymotionLink.test(input)
        ) {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
              message: "",
              video: input,
              name: user.displayName,
              uid: user.uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(docRef.id)
                .set(
                  {
                    id: docRef.id,
                  },
                  { merge: true }
                );
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        } else if (urlLink.test(input)) {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
              message: "",
              url: input,
              name: user.displayName,
              uid: user.uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(docRef.id)
                .set(
                  {
                    id: docRef.id,
                  },
                  { merge: true }
                );
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        } else if (/\S/.test(input)) {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
              message: input,
              name: user.displayName,
              uid: user.uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function (docRef) {
              // console.log("Document written with ID: ", docRef.id);
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(docRef.id)
                .set(
                  {
                    id: docRef.id,
                  },
                  { merge: true }
                );
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        }
      }
      setInput("");
      setEmoji(false);
    }
  };

  return (
    <div className="chat__footer">
      <DrawerBottom
        drawerBottom={drawerBottom}
        setDrawerBottom={setDrawerBottom}
        fileVideoUrl={fileVideoUrl}
        fileImageUrl={fileImageUrl}
        setFileImageUrl={setFileImageUrl}
        setFileVideoUrl={setFileVideoUrl}
        roomId={roomId}
        db={db}
        firebase={firebase}
        storage={storage}
      />

      {emoji ? (
        <Hidden only={["xs"]}>
          <TooltipCustom
            name="Close"
            icon={<CloseIcon />}
            onClick={() => handleEmoticonsClose()}
          />
        </Hidden>
      ) : null}

      <TooltipCustom
        name="Emoticons"
        icon={<InsertEmoticonIcon />}
        onClick={() => handleEmoticons()}
      />

      {emoji ? (
        <>
          <Hidden only={["xs"]}>
            <Picker onSelect={addEmoji} />
          </Hidden>
          <Hidden smUp>
            <ClickAwayListener onClickAway={handleEmoticonsClose}>
              <Picker onSelect={addEmoji} />
            </ClickAwayListener>
          </Hidden>
        </>
      ) : null}

      <div>
        <TooltipCustom
          name="Attach"
          icon={<AttachFileIcon />}
          onClick={attachFile}
        />
        {showAttachFile ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="chat__attachFile">
              {attachFileLists.map((attachFileList) => (
                <Slide
                  key={attachFileList.id}
                  direction="up"
                  in={attachFile}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tooltip
                    title={
                      <span
                        style={{ fontSize: "14px", padding: "8px 5px 8px 5px" }}
                      >
                        {attachFileList.title}
                      </span>
                    }
                    placement="left"
                  >
                    <Fab color="primary" aria-label="person">
                      <div className="chat__icon">
                        <label htmlFor="file-input">
                          {attachFileList.icon}
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          onChange={onFileChange}
                          accept="image/*,video/mp4,video/3gpp,video/quicktime"
                        />
                      </div>
                    </Fab>
                  </Tooltip>
                </Slide>
              ))}
            </div>
          </ClickAwayListener>
        ) : null}
      </div>

      <form>
        {/* <input
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          type="text"
          // minLength="1"
          // maxLength="700"
        /> */}
        <textarea
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          type="text"
          rows="1"
          onKeyDown={onEnterPress}
          // cols="50"
          // minLength="1"
          // maxLength="700"
        />

        {/* <TextField
          id="filled-full-width"
          fullWidth
          multiline
          rowsMax={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        /> */}

        {/* <button onClick={sendMessage} type="submit">
          Send a message
        </button> */}
      </form>

      <TooltipCustom
        name="Voice Message"
        icon={<MicIcon />}
        onClick={() => voiceMessage()}
      />
    </div>
  );
}

export default ChatFooter;
