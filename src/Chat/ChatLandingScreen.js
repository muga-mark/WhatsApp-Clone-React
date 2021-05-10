import React from "react";
import LaptopIcon from "@material-ui/icons/Laptop";
import Divider from "@material-ui/core/Divider";
import whatsAppConnected from "../images/whatsapp-connect.jpg";
import "./ChatLandingScreen.css";
import Zoom from "@material-ui/core/Zoom";

function ChatLandingScreen({ showLandingScreenPhoto }) {
  return (
    <div className="chat-landing-screen">
      <div>
        <Zoom
          in={showLandingScreenPhoto}
          style={{ transitionDelay: showLandingScreenPhoto ? "300ms" : "0ms" }}
        >
          <img
            className="chat-landing-screen__photo"
            src={whatsAppConnected}
            alt="whatsAppConnected"
          />
        </Zoom>
      </div>

      <div className="chat-landing-screen__title">
        <p>Keep your phone connected</p>
      </div>

      <div>
        <p>
          WhatsApp connects to your phone to sync messages. To reduce data
          usage, connect to yor phone to Wi-Fi.
        </p>
      </div>

      <Divider />

      <div className="chat-landing-screen__footer">
        <LaptopIcon />
        <p>WhatsApp is available for Windows.</p>
        <a
          target="_blank"
          href="https://www.whatsapp.com/download"
          rel="noopener noreferrer"
        >
          Get it here.
        </a>
      </div>
    </div>
  );
}

export default ChatLandingScreen;
