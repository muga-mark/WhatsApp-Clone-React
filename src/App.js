import React, { useEffect, useState } from 'react'
import { useStateValue } from './StateProvider';
import db from './firebase';
import { auth } from './firebase';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { setUser } from './actions/userAction';
import { setMenuSidebar, setMenuChat } from './actions/menuAction';
import Login from './Login';
import Sidebar from '../src/Sidebar/Sidebar';
import Chat from '../src/Chat/Chat';
import Hidden from '@material-ui/core/Hidden';
import './App.css';

function App() {
  const [{ user },  dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        dispatch(setUser(authUser));
        
        if(authUser.isAnonymous === true){
          auth.currentUser.updateProfile({
            displayName: "Anonymous" + " " + Math.floor(Math.random() * 1000000),
          });
          
        }

        db.collection("rooms")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => 
            setRooms(snapshot.docs.map(doc => 
                    ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
        );

        dispatch(setMenuSidebar(null));
        dispatch(setMenuChat(null));
      }else{
        dispatch(setUser(null));
      }
    });

    return () => {
      unsubscribe();
    }

  }, [dispatch]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Switch>

              <Route exact path="/">
                <Sidebar rooms={rooms} />
                {/* Chat component will be hidden in mobile view */}
                <Hidden only={['xs']}>
                  <Chat />
                </Hidden>
              </Route>

              <Route path="/rooms/:roomId">  
                {/* Sidebar component will be hidden in mobile view */}
                <Hidden only={['xs']}> 
                  <Sidebar rooms={rooms} />
                </Hidden>
                <Chat />
              </Route>

            </Switch>
          </Router>        
        </div>
      )}
    </div>
  );
}

export default App;
 