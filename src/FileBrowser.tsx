// interact with the server to get the tasks



import React, { useState, useEffect, useCallback } from 'react';
import Task from './task';
import { PortsGlobal } from './PortsGlobal';

// import the css file
//import './ControlPlane.css';


const port = PortsGlobal.serverPort;

const hostname = window.location.hostname;
const baseURL = `http://${hostname}:${port}`;

// include a function to call with a document name to modify the URL
interface FileBrowserProps {
    resetURL: (documentName: string) => void;
}

export function FileBrowser({ resetURL }: FileBrowserProps) {

    const [files, setFiles] = useState<string[]>([]);
    const [newFileName, setNewFileName] = useState<string>('');

    const getDocuments = useCallback(() => {
        const requestURL = baseURL + "/documents"


        fetch(requestURL)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);

                setFiles(json);
            }
            ).catch((error) => {
                console.log(`getDocuments error: ${error}`);
            }
            );
    }, []);
    // force a refresh 3 times a second.
    useEffect(() => {
        const interval = setInterval(() => {
            getDocuments();
        }, 333);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // return a button for a file
    // onclick should call the resetURL function
    function getButtonForFile(file: string) {
        return <button onClick={() =>
            resetURL(file)}>
            {file}
        </button>
    }

    // return a <ul> list of the files
    function getFilesDisplay() {
        return <ul>
            {files.map((file) => {
                return <li key={file}>
                    {getButtonForFile(file)}
                </li>
            })}
        </ul>
    }

    function getNewFileButton() {
        // make a table with one row. and two columns
        return <table>
            <tbody>
                <tr>
                    <td>
                        <input
                            type="text"
                            placeholder="File name"
                            onChange={(event) => {
                                // get the text from the input
                                let taskName = event.target.value;
                                // set the file name
                                setNewFileName(taskName);
                            }}
                        />
                    </td>

                    <td> <button onClick={() => {
                        if (newFileName === '') {
                            alert("Please enter a file name");
                            return;
                        }
                        resetURL(newFileName);

                    }}>
                        Create New File
                    </button>
                    </td>
                </tr>
            </tbody>
        </table>
    }




    return <div>
        <h2>File Browser</h2>
        {getNewFileButton()}
        {getFilesDisplay()}
    </div>
}

export default FileBrowser;
