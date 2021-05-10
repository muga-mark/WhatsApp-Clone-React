import React, { useState, useEffect } from "react";
//importing components
import SearchBar from "../shared/SearchBar";
//importing material-ui
import DrawerRight from "./DrawerRight";
import IconButton from "@material-ui/core/IconButton";
import Zoom from "@material-ui/core/Zoom";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
//importing material-ui-icons
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import GroupIcon from "@material-ui/icons/Group";
//importing styles
import "./DrawerRightInfo.css";

function DrawerRightInfo({
  drawerRightInfo,
  setDrawerRightInfo,
  messages,
  user,
}) {
  const [search, setSearch] = useState("");
  const [isFoundMessage, setIsFoundMessage] = useState(false);

  const findMessage = function (myMessages) {
    return function (x) {
      var searchMessage = x.message + "" + x.caption;
      return (
        searchMessage.toLowerCase().includes(myMessages.toLowerCase()) ||
        !myMessages
      );
    };
  };

  useEffect(() => {
    const messageResult = () => {
      return (
        <>
          {messages.filter(findMessage(search)).map((message) => (
            <p key={message.id}>
              {message.message}
              {message.caption}
            </p>
          ))}
        </>
      );
    };

    if (search) {
      var result = messageResult();
      // console.log("result", result.props.children)
      if (result.props.children.length > 0) {
        setIsFoundMessage(true);
        console.log("search message sucess");
      } else {
        setIsFoundMessage(false);
        console.log("search message fail");
      }
    }
  }, [search, messages]);

  const handleDrawerClose = () => {
    setDrawerRightInfo(false);
  };

  return (
    <div>
      <DrawerRight
        drawerRight={drawerRightInfo}
        content={
          <>
            <div className="drawer-right-info__header">
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
              <p>Group Info</p>
            </div>
            <div className="drawer-right-info-content">
              <div className="drawer-right-info-content__photo">
                <div className="profilePhoto">
                  <Zoom
                    in={drawerRightInfo}
                    style={{
                      transitionDelay: drawerRightInfo ? "300ms" : "0ms",
                    }}
                  >
                    {/* {photo ? (
                      <Avatar
                        src={photo}
                        className="profilePhoto__layer_bottom"
                      />
                    ) : (
                      <Avatar />
                    )} */}
                    {/* <Avatar /> */}
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </Zoom>
                  <div
                    className="profilePhoto__layer_top"
                    // onClick={handleProfileMenu}
                  >
                    <div className="profilePhoto__text">
                      <PhotoCameraIcon />
                      <p>CHANGE</p>
                      <p>PROFILE PHOTO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
}

export default DrawerRightInfo;
