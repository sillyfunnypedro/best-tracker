import Task from './task';


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

    constructor(userID: string) {
        this._tasks = new Map<string, Task>();
        this._userID = userID;
    }

    public get tasks(): Map<string, Task> {
        //construct the get request to the server
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:3000/tasks', false);
        request.send(null);
        if (request.status == 200) {
            let tasks = JSON.parse(request.responseText);
            for (let task of tasks) {
                this._tasks.set(task.id, new Task(task.name, task.time, task.complete));
            }
        }

        return this._tasks;
    }

    public postTask(name: string) {
        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:3000/task', false);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ name: name }));
        if (request.status == 200) {
            let task = JSON.parse(request.responseText);
            this._tasks.set(task.id, new Task(task.name, task.time, task.complete));
        }
    }


}