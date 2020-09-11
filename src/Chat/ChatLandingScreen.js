import React from 'react';
import LaptopIcon from '@material-ui/icons/Laptop';
import Divider from '@material-ui/core/Divider';
import whatsAppConnected from '../image/whatsapp-connect.jpg';
import './ChatLandingScreen.css';

function ChatLandingScreen() {
    return (
        <div className="chat__landingScreen"> 
            <div>
                <img src={whatsAppConnected} alt="whatsAppConnected" />
            </div>

            <div className="chat__landingScreen_title"> 
                <p> 
                    Keep your phone connected 
                </p>
            </div>

            <div>
                <p>
                    WhatsApp connects to your phone to sync messages. To reduce data usage, connect to yor phone to Wi-Fi.
                </p>
            </div>

            <Divider />

            <div className="chat__landingScreen_footer">
                <LaptopIcon />
                <p>
                        WhatsApp is available for Windows.
                </p>
                <a target="_blank" href="https://www.whatsapp.com/download" rel="noopener noreferrer">
                    Get it here.
                </a>
            </div>
        </div>
    )
}

export default ChatLandingScreen
