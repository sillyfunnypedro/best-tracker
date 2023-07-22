import React, { useState } from 'react';
import './App.css';
import { TaskClient } from './TaskClient';

function App() {
  // a user name to be used in the request task function

  const [userName, setUserName] = useState('');

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


  return (
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
              <input
                type="text"
                placeholder="User name"
                onChange={(event) => {
                  // get the text from the input
                  let userName = event.target.value;
                  // set the user name
                  setUserName(userName);
                }}
              />
            </td>
          </tr>
        </table>
        {getUserString()}
        <TaskClient userName={userName} />
      </header>
    </div>
  );
}

export default App;
