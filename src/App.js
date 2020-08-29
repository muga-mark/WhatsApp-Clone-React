import React, { useEffect } from 'react'
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { setUser } from './actions/userAction';
import Login from './Login';
import Sidebar from '../src/Sidebar/Sidebar';
import Chat from '../src/Chat/Chat';
import Hidden from '@material-ui/core/Hidden';
import './App.css';

function App() {
  const [{ user },  dispatch] = useStateValue();
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        dispatch(setUser(authUser))
      }else{
        dispatch(setUser(null))
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
              <Route path="/rooms/:roomId">  
                <Hidden only={['xs']}>
                  <Sidebar />
                </Hidden>
                <Chat />
              </Route>
              <Route exact path="/">
                <Sidebar />
                <Hidden only={['xs']}>
                  <Chat />
                </Hidden>
              </Route>
            </Switch>
          </Router>        
        </div>
      )}
    </div>
  );
}

export default App;
 