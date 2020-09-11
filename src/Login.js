import React from 'react';
import { auth, provider } from './firebase';
import { toastInfo } from './shared/toastInfo';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import './Login.css';

function Login() {
    const signInGoogle = () => {
        const google ="google";

        auth.signInWithPopup(provider)
            .catch((error) => toastInfo(`fucksss${error}`, google, "top-center"));
    };

    const loginAnonymously = () => {
        const anonymous = "anonymous";

        auth.signInAnonymously()
            .catch((error) => toastInfo(`fuck${error}`, anonymous, "top-center")); 
    };

    return (
        <div className="login"> 

            <div className="login__container">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png"
                alt="WhatsApp Logo" 
            />
            <div className="login__text">
                <h1>Sign in to WhatsApp</h1>
            </div>
            
            <div className="login__withGoogle" onClick={signInGoogle}>
                <img 
                    src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png"
                    alt="Google Logo" 
                />
                <span>Sign in with Google</span>
            </div>

            <div className="login__withGoogle login__Anonymously" onClick={loginAnonymously}>
                <PermIdentityIcon />
                <span>Login Anonymously</span>
            </div>
    
            </div>
        </div>
    )
}

export default Login
