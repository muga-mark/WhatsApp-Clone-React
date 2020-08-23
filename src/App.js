import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { auth } from './firebase';

import Login from './Login';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './App.css';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user },  dispatch] = useStateValue();
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        dispatch({
          type: 'SET_USER',
          user: authUser,
        })
      }else{
        dispatch({
          type: 'SET_USER',
          user: null,
        })
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
            <Sidebar />
            <Switch>

              <Route path="/rooms/:roomId">  
                <Chat />
              </Route>

              <Route path="/">
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
 