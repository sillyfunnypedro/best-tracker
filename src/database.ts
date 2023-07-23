
// the file is a JSON file

import exp from 'constants';
import * as fs from 'fs';
import * as path from 'path';
import Task from './task';

// a class that stores a list of tasks.  A task has a name, a time allocated to it, and a completion flag
// the class also has methods to add, remove, and update tasks
// when a new task is added it generates a unique id for the task (6 digit string) and returns it
// the class also has methods to save and load the list of tasks to a file
// the default location for the file is in the same directory as the executable
// the file name for the data base is tasks.json 
// the tasks are stored in a map that is indexed by the task id
// the database provides different documents.   The location of the 
// documents is in the directory "documents" in the same directory as the executable

class Database {
    private _tasks: Map<string, Task>;
    private _filename: string;
    private _id: number = 0;
    private _documentDirectory: string = path.join(__dirname, "documents");

    // default document name is tasks
    constructor(documentName: string = "tasks") {
        this._tasks = new Map<string, Task>();
        // remove any / or \ from the document name
        documentName = documentName.replace(/[\/\\]/g, "");

        this._filename = path.join(this._documentDirectory, documentName + ".json");
        this._load();
        this._initializeDirectory();
    }

    private _initializeDirectory() {
        if (!fs.existsSync(this._documentDirectory)) {
            fs.mkdirSync(this._documentDirectory, { recursive: true });
        }
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

    public reset() {
        this._tasks.clear();
        this._id = 0;
        this._save();
    }

    public makeData() {
        this.reset();
        this.addTask("Task 1");
        this.addTask("Task 2");
        this.addTask("Task 3");
        this.addTask("Task 4");
        this.addTask("Task 5");
    }

    public addTask(name: string): string {
        let id = this._generateId();
        let task = new Task(name, 0, false);
        task.id = id;
        this._tasks.set(id, task);
        this._save();
        return id;
    }

    public addUserToTask(taskId: string, user: string): boolean {
        console.log(`>>>>>>>> attempting to assign ${user} to ${taskId}`);
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
            if (task.owner == user) {
                task.clearOwner();
                this._save();
            }
        }
    }

    public addTimeToTask(taskId: string, userId: string, time: number): boolean {
        let task = this._tasks.get(taskId);
        if (task) {
            if (task.owner == userId) {
                task.time += time;
                console.log(`added ${time} to ${taskId} for ${userId}`);
                this._save();
                return true;
            }
        }
        return false;
    }

    public markTaskComplete(taskId: string, userId: string): boolean {
        let task = this._tasks.get(taskId);
        if (task) {
            if (task.owner == userId) {
                task.complete = true;
                this._save();
                return true;
            }
        }
        return false;
    }


}

export { Task, Database }
