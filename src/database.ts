
// the file is a JSON file

import exp from 'constants';
import * as fs from 'fs';
import * as path from 'path';

class Task {
    private _name: string;
    private _time: number;
    private _complete: boolean;
    private _owner: string;

    constructor(name: string, time: number, complete: boolean) {
        this._name = name;
        this._time = time;
        this._complete = complete;
        this._owner = "";
    }

    public get name(): string {
        return this._name;
    }

    public get time(): number {
        return this._time;
    }

    public get complete(): boolean {
        return this._complete;
    }

    public set name(name: string) {
        this._name = name;
    }

    public set time(time: number) {
        this._time = time;
    }

    public set complete(complete: boolean) {
        this._complete = complete;
    }

    public getOwner(): string {
        return this._owner;
    }
    // requestOwner(user:string): boolean
    public requestOwner(user: string): boolean {
        if (this._owner == "") {
            this._owner = user;
            return true;
        }
        return false;
    }

    public clearOwner() {
        this._owner = "";
    }
}

// a class that stores a list of tasks.  A task has a name, a time allocated to it, and a completion flag
// the class also has methods to add, remove, and update tasks
// when a new task is added it generates a unique id for the task (6 digit string) and returns it
// the class also has methods to save and load the list of tasks to a file
// the default location for the file is in the same directory as the executable
// the file name for the data base is tasks.json 
// the tasks are stored in a map that is indexed by the task id
class Database {
    private _tasks: Map<string, Task>;
    private _filename: string;
    private _id: number = 0;

    constructor() {
        this._tasks = new Map<string, Task>();
        this._filename = path.join(__dirname, "tasks.json");
        this._load();
    }

    private _load() {
        try {
            let data = fs.readFileSync(this._filename, 'utf8');
            let tasks = JSON.parse(data);
            for (let task of tasks) {
                let newTask = new Task(task._name, task._time, task._complete);
                this._tasks.set(task._id, newTask);
            }
            this._id = tasks.length;
        } catch (err) {
            // create the empty file
            this._save();
        }
    }

    private _save() {
        let tasks = [];
        for (let [id, task] of this._tasks) {
            tasks.push({
                _id: id,
                _name: task.name,
                _time: task.time,
                _complete: task.complete
            });
        }
        let data = JSON.stringify(tasks);
        fs.writeFileSync(this._filename, data);
    }

    private _generateId(): string {
        // pad the id with leading zeros
        let id = this._id.toString().padStart(6, "0");
        this._id++;
        return id;
    }


    public get tasks(): Map<string, Task> {
        return this._tasks;
    }

    public addTask(name: string, time: number, complete: boolean): string {
        let id = this._generateId();
        let task = new Task(name, time, complete);
        this._tasks.set(id, task);
        this._save();
        return id;
    }

    public addUserToTask(taskId: string, user: string): boolean {
        let task = this._tasks.get(taskId);
        if (task) {
            const result = task.requestOwner(user);
            if (result) {
                this._save();
            }
            return result;
        }
        return false;
    }

    public removeUserFromTask(taskId: string, user: string) {
        let task = this._tasks.get(taskId);
        if (task) {
            if (task.getOwner() == user) {
                task.clearOwner();
                this._save();
            }
        }
    }

    public addTimeToTask(taskId: string, userId: string, time: number): boolean {
        let task = this._tasks.get(taskId);
        if (task) {
            if (task.getOwner() == userId) {
                task.time += time;
                this._save();
                return true;
            }
        }
        return false;
    }


}

export { Task, Database }
