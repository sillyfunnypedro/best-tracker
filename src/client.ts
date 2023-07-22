import { Task } from './database';
import axios from 'axios';

import { PortsGlobal } from './PortsGlobal';

// a class that stores a list of tasks.
// it gets the list of tasks a server at localhost:3000/tasks
// it can add a task to the list
// it has a userID that it uses for all requests
// it can request a task to work on
// it can update the task with time worked on the task
// it can mark a task as complete

export default class Client {
    private _tasks: Map<string, Task>;
    private _userID: string;
    private _serverPort: number = PortsGlobal.serverPort;

    constructor(userID: string) {
        this._tasks = new Map<string, Task>();
        this._userID = userID;
    }

    public get userID(): string {
        return this._userID;
    }

    public async clearData(): Promise<boolean> {
        const response = await axios.delete(`http://localhost:${this._serverPort}/tasks`);
        if (response.status == 200) {
            return true
        } else {
            return false
        }
    }

    public async getTasks(): Promise<Task[]> {
        //construct the get request to the server
        const response = await axios.get(`http://localhost:${this._serverPort}/tasks`);
        let result: Task[] = [];
        if (response.status == 200) {

            for (let task of response.data) {
                result.push(new Task(task.name, task.time, task.complete));
            }
        } else {
            console.log("Error getting tasks");
        }
        return result;
    }

    public async postTask(taskName: string): Promise<string> {
        const response = await axios.post(`http://localhost:${this._serverPort}/tasks/add/${taskName}`);
        if (response.status == 200) {
            return response.data.id;
        } else {
            return "NODATA";
        }
    }

    public async postTimeToTask(taskId: string, time: number): Promise<boolean> {
        const response = await axios.put(`http://localhost:${this._serverPort}/tasks/update/${taskId}/${this._userID}/${time}`);
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    }

    public async addUserToTask(taskId: string): Promise<boolean> {
        const response = await axios.put(`http://localhost:${this._serverPort}/tasks/assign/${taskId}/${this._userID}`);
        if (response.status == 200) {
            console.log(response.data);
            const result = response.data;
            return result.success;
        } else {
            return false;
        }
    }

    public async removeUserFromTask(taskId: string): Promise<boolean> {
        const response = await axios.put(`http://localhost:${this._serverPort}/tasks/remove/${taskId}/${this._userID}`);
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    }

    public async markTaskComplete(taskId: string): Promise<boolean> {
        const response = await axios.put(`http://localhost:${this._serverPort}/tasks/complete/${taskId}/${this._userID}`);
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    }

}





