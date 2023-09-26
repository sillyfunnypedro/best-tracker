import React, { useState, useEffect } from 'react';
import './App.css';
import { TaskClient } from './TaskClient';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { FileBrowser } from './FileBrowser';

import { get } from 'http';

function App() {
  // a user name to be used in the request task function

  // get the document name from the URL
  // the URL will be something like http://localhost:3000/documentID

  const [userName, setUserName] = useState('');
  const [documentName, setDocumentName] = useState(getDocumentNameFromWindow());

  useEffect(() => {
    if (window.location.href) {
      setDocumentName(getDocumentNameFromWindow());
    }
  }, [getDocumentNameFromWindow]);

  useEffect(() => {
    const storedUserName = window.sessionStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // for the purposes of this demo and for the final project
  // we will use the window location to get the document name
  // this is not the best way to do this, but it is simple
  // and it works for the purposes of this demo
  function getDocumentNameFromWindow() {
    const href = window.location.href;

    // remove  the protocol 
    const protoEnd = href.indexOf('//');
    // find the beginning of the path
    const pathStart = href.indexOf('/', protoEnd + 2);

    if (pathStart < 0) {
      // there is no path
      return '';
    }
    // get the first part of the path
    const docEnd = href.indexOf('/', pathStart + 1);
    if (docEnd < 0) {
      // there is no other slash
      return href.substring(pathStart + 1);
    }
    // there is a slash
    return href.substring(pathStart + 1, docEnd);

  }

  // return a string to display the user name
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

  //callback function to reset the current URL to have the document name
  function resetURL(documentName: string) {
    // get the current URL
    const currentURL = window.location.href;
    // remove anything after the last slash
    const index = currentURL.lastIndexOf('/');
    const newURL = currentURL.substring(0, index + 1) + documentName;
    // set the URL
    window.history.pushState({}, '', newURL);
    // now reload the page
    window.location.reload();
  }

  function deleteDocument(documentName: string) {
    console.log(`deleteDocument: ${documentName}`);

  }



  function GetDocumentString() {
    return <div>
      {documentName}
    </div>
  }

  function getTitle() {
    return <div>
      <h2>
        The Bestest Task Tracker
      </h2>
      <b>
        Document:
      </b>
      <GetDocumentString />
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
          window.sessionStorage.setItem('userName', userName);
          // set the user name
          setUserName(userName);
        }} />
    </div>

  }

  function getSheetDisplay() {
    return <div>
      {getUserString()}
      <TaskClient userName={userName} documentName={documentName} resetURL={resetURL} />
    </div>
  }

  function getControlPlane() {
    return <FileBrowser resetURL={resetURL} deleteDocument={deleteDocument} />
  }

  function getDisplayComponent() {
    if (documentName === 'files' || documentName === '') {
      return getControlPlane();
    } else {
      return getSheetDisplay();
    }
  }




  function getLoginComponent() {
    return <table>
      <tbody>
        <tr>
          <td>
            <h3>Enter your user name</h3>
          </td>

          <td>
            {getUserLogin()}
          </td>
        </tr>
      </tbody>
    </table>
  }

  // pass in te
  return (
    <BrowserRouter >
      <div className="App">
        <header className="App-header">
          {getTitle()}
          {getLoginComponent()}
          {getDisplayComponent()}
        </header>
      </div>
    </BrowserRouter  >
  );
}


export default App;
