// interact with the server to get the tasks



import React, { useState, useEffect } from 'react';
import Task from './task';
import { PortsGlobal } from './PortsGlobal';

// import the css file
import './TaskClient.css';


const port = PortsGlobal.serverPort;
let url = `http://pencil.local:${port}/tasks`;


// a component that has a button to get the tasks from the server
// and display them in buttons that can be selected
// it has a label to display the selected task
// it has a button to add a count to the current task
// it has a button to release the task

// a function that will be called by the get tasks button
// it will get the tasks from the server and display them in buttons
// that can be selected

// define the props for the component, a string for the user name
interface TaskClientProps {
    userName: string;
}



export function TaskClient({ userName }: TaskClientProps) {
    // get the local host name to bypass CORS
    let localHostName = window.location.hostname;
    console.log(`localHostName: ${localHostName}`);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState<string>('');

    function getTasks() {
        fetch(url)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                setTasks(json);
            }
            ).catch((error) => {
                console.log(`getTask error: ${error}`);
            }
            );
    }

    function requestTask(taskId: string) {
        const url = `http://${localHostName}:${port}/tasks/assign/${taskId}/${userName}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`requestTask error: ${error}`);
            }
            );
    }

    function updateTask(taskId: string) {
        const url = `http://${localHostName}:${port}/tasks/update/${taskId}/${userName}/1`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`updateTask error: ${error}`);
            }
            );
    }

    function releaseTask(taskId: string) {
        const url = `http://${localHostName}:${port}/tasks/remove/${taskId}/${userName}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`releaseTask error: ${error}`);
            }
            );
    }

    function completeTask(taskId: string) {
        const url = `http://${localHostName}:${port}/tasks/complete/${taskId}/${userName}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`completeTask error: ${error}`);
            }
            );
    }

    function clearServer() {
        const url = `http://${localHostName}:${port}/tasks`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`clearServer error: ${error}`);
            }
            );
    }

    function makeData() {
        const url = `http://${localHostName}:${port}/makedata`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`makeData error: ${error}`);
            }
            );
    }

    function addTask() {

        const url = `http://${localHostName}:${port}/tasks/add/${taskName}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
        fetch(url, options)
            .then((response) => {
                console.log(`response: ${response}`);
                return response.json();
            }
            ).then((json) => {
                console.log(`json: ${json}`);
                getTasks();
            }
            ).catch((error) => {
                console.log(`addTask error: ${error}`);
            }
            );
    }



    function getTaskString(task: Task) {
        return <div className="label">
            {task.id}-{task.name}
        </div>

    }


    function getTaskComponent(task: Task) {
        console.log(task)
        let available = !task.complete && task.owner.length === 0;
        let working = false;
        if (task.owner === userName) {
            working = true;
        }
        if (task.complete) {
            return <div>
                <table><tr>
                    <td>{getTaskString(task)}</td>
                    <td>
                        <div className="label">
                            Completed by:{task.owner}
                        </div>
                    </td>
                </tr></table>

            </div>
        }
        if (available) {
            return <div>
                <table><tr>
                    <td>{getTaskString(task)} </td>
                    <td className="label"><button
                        onClick={() => requestTask(task.id)}>
                        Select
                    </button>
                    </td>
                </tr></table>
            </div>
        }
        if (working) {
            return <div >
                {getTaskString(task)}
                <button onClick={() => updateTask(task.id)}>
                    Update
                </button>
                <button onClick={() => releaseTask(task.id)}>
                    Release
                </button>
                <button onClick={() => completeTask(task.id)}>
                    Complete
                </button>
            </div>
        }

        return <div>
            {task.id}-{task.name} {task.owner}
        </div>
    }



    function getComponentForTasks(tasks: Task[]) {
        console.log(tasks)
        if (tasks.length > 0) {
            return <div>
                {tasks.map((task) => (
                    <li key={task.name}>{getTaskComponent(task)}
                    </li>

                ))}
            </div>
        } else {
            return <div>
                No tasks
            </div>
        }
    }


    function getControlButtons() {
        return <div>
            <table>
                <tr>
                    <td>
                        <button onClick={clearServer}>ClearServer</button>
                    </td>
                    <td>
                        <button onClick={makeData}>Make Data</button>
                    </td>
                    <td>
                        <button onClick={getTasks}>Get Tasks</button>
                    </td>

                </tr>
                <tr>
                    <td>
                        <input
                            type="text"
                            placeholder="Task name"
                            onChange={(event) => {
                                // get the text from the input
                                let taskName = event.target.value;
                                // set the user name
                                setTaskName(taskName);
                            }}
                        />
                    </td>
                    <td>
                        <button onClick={addTask}>Add Task</button>
                    </td>
                </tr>
            </table>
        </div>
    }

    return (
        <div>
            <h3>control plane</h3>
            {getControlButtons()}
            <h3> data plane</h3>
            <ul>
                {getComponentForTasks(tasks)}
            </ul>
        </div>
    );
}
export default TaskClient;
// export function TaskClient() {
//     // get the local host name to bypass CORS
//     let localHostName = window.location.hostname;
//     console.log(`localHostName: ${localHostName}`);

//     const [tasks, setTasks] = useState<Task[]>([]);
//     useEffect(() => {
//         fetch(url)
//             .then((response) => {
//                 console.log(`response: ${response}`);
//                 return response.json();
//             }
//             ).then((json) => {
//                 console.log(`json: ${json}`);
//                 setTasks(json);
//             }
//             ).catch((error) => {
//                 console.log(`xxxxxxx error: ${error}`);
//             });
//     }, [url]);
//     return (
//         <div>
//             <h1>Tasks</h1>
//             <ul>
//                 {tasks.map((task) => (
//                     <li key={task.name}>{task.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default TaskClient;