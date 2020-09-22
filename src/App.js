import React, { useEffect, useState } from 'react'
import { useStateValue } from './StateProvider';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
//importing firebase
import db from './firebase';
import { auth } from './firebase';
//importing actions
import { setUser } from './actions/userAction';
//importing components
import Login from './Login';
import Sidebar from '../src/Sidebar/Sidebar';
import Chat from '../src/Chat/Chat';
import { ToastContainer } from 'react-toastify';
//importing material-ui
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
//importing styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [{ user },  dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

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
                ),
            setLoading(true)
        );
      }else{
        dispatch(setUser(null));
        setLoading(true);
      }
    });

    return () => {
      unsubscribe();
    }

  }, [dispatch]);

  return (
    <div className="app">
      {loading? <>
        <ToastContainer 
            position="top-center"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
        />
        {!user ? (
          <Login />
        ) : (
          <div className="app__body">
              <Router>
                <Switch>

                  <Route exact path="/">
                    <Sidebar rooms={rooms} loading={loading} /> 
                    <Hidden only={['xs']}> {/* Chat component will be hidden in mobile view */}
                      <Chat />
                    </Hidden>
                  </Route>

                  <Route exact path="/rooms/:roomId">  
                    <Hidden only={['xs']}> {/* Sidebar component will be hidden in mobile view */}
                      <Sidebar rooms={rooms} loading={loading} />
                    </Hidden>
                    <Chat />
                  </Route>

                  <Route path="*">
                    <Redirect to="/" />
                  </Route>

                </Switch>
              </Router> 
          </div>
        )}
        </>:
        <div className="app__loading">
            <div>
                <div className="app__loading_circular">
                  <CircularProgress />
                </div>
                <div className="app__loading_linear">
                  <LinearProgress />
                </div>
            </div>
        </div>
      }
    </div>
  );
}

export default App;
 