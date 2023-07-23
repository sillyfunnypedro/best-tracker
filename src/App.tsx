import React, { useState } from 'react';
import './App.css';
import { TaskClient } from './TaskClient';
import { BrowserRouter, useLocation } from 'react-router-dom';

function App() {
  // a user name to be used in the request task function

  // get the document name from the URL
  // the URL will be something like http://localhost:3000/documentID





  const [userName, setUserName] = useState('');
  const [documentName, setDocumentName] = useState('');

  function getUserString() {
    if (userName.length > 0) {
      return <div>
        Logged in as {userName}
      </div>
    } else {
      return <div>
        Please enter a user name
      </div>
    }
  }


  function GetDocumentString() {
    // get the location
    const location = useLocation();
    // get the search string
    const path = location.pathname;
    setDocumentName(path);
    // return the path
    return <div>
      {path}
    </div>
  }

  function getUserLogin() {

    return <div>
      <input
        type="text"
        placeholder="User name"
        defaultValue={userName}
        onChange={(event) => {
          // get the text from the input
          let userName = event.target.value;
          // set the user name
          setUserName(userName);
        }} />
    </div>
  }


  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>The Bestest Task Tracker</h1>
          </div>

          <table>
            <tr>
              <td>
                <h3>Enter your user name</h3>
              </td>
              <td>
                {getUserLogin()}
              </td>
            </tr>
            <tr>
              <td>
                <h3>Document:</h3>
              </td>
              <td>
                <GetDocumentString />
              </td>
            </tr>
          </table>
          {getUserString()}
          <TaskClient userName={userName} documentName={documentName} />
        </header>
      </div>
    </BrowserRouter >
  );
}

export default App;
