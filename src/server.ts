// a restful api server
// 1. create a server
// 2. create a router
// 3. create a controller
// 4. create a model
// 5. create a database
// 6. create a view
// 7. create a client
// 8. create a test
// 9. create a deployment

import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PortsGlobal } from './PortsGlobal';

import { Database } from './database';

// define a debug flag to turn on debugging
const debug = true;

// define a shim for console.log so we can turn off debugging
if (!debug) {
    console.log = () => { };
}

const app = express();
app.use(bodyParser.json());

// Add a middleware function to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors());



const db = new Database();

//  ********************************************
//  THIS IS NOT GOOD PRACTICE
//  ********************************************
//  you should never use get to change the state of the server
//  you should use post, put, or delete
//  ********************************************    
// clear the database (for testing so get can be used from browser)
app.get('/cleardata', (req: express.Request, res: express.Response) => {
    db.reset();
    res.json({ success: true });
});


app.post('/cleardata', (req: express.Request, res: express.Response) => {
    db.reset();
    res.json({ success: true });
});

// this is for demo purposes only (it is get so i can run from browser)
app.get('/makedata', (req: express.Request, res: express.Response) => {
    db.makeData();
    res.json({ success: true });
});
app.post('/makedata', (req: express.Request, res: express.Response) => {
    db.makeData();
    res.json({ success: true });
});
// ********************************************
// the above is not good practice
// ********************************************
// ********************************************

// delete /tasks clears the list of tasks
app.delete('/tasks', (req: express.Request, res: express.Response) => {
    db.reset();
    res.json({ success: true });
});

// get /tasks returns a list of all the tasks
app.get('/tasks', (req: express.Request, res: express.Response) => {
    let tasks = [];
    for (let [id, task] of db.tasks) {
        tasks.push({
            id: id,
            name: task.name,
            time: task.time,
            complete: task.complete,
            owner: task.owner
        });
    }
    res.json(tasks);
});


// post a new task
app.post('/tasks/add/:name', (req: express.Request, res: express.Response) => {
    let name = req.params.name;
    const id = db.addTask(name);
    console.log(`added task ${id} ${name}`)
    let documentName = req.body.documentName
    console.log("----->" + documentName + "<-----")
    res.json({ id: id });
});

// assign user to the task
app.put('/tasks/assign/:id/:user', (req: express.Request, res: express.Response) => {
    console.log(req.params);
    let id = req.params.id;
    let user = req.params.user;

    console.log(`attempting to assign ${user} to ${id}`);
    const success = db.addUserToTask(id, user);
    if (success) {
        console.log(`assigned ${user} to ${id}`);
    } else {
        console.log(`failed to assign ${user} to ${id}`);
    }
    res.json({ success: success });
});

// remove user from the task
app.put('/tasks/remove/:id/:user', (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let user = req.params.user;
    const success = db.removeUserFromTask(id, user);
    res.json({ success: success });
});

// add time to the task
app.put('/tasks/update/:id/:user/:time', (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let user = req.params.user;
    let time = Number(req.params.time);
    const success = db.addTimeToTask(id, user, time);
    if (success) {
        console.log(`added ${time} to ${id} for ${user}`);
    } else {
        console.log(`failed to add ${time} to ${id} for ${user}`);
    }
    res.json({ success: success });
});


// delete a task from the list if it is owed by the user
app.delete('/tasks/delete/:id/:user', (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let user = req.params.user;
    const success = db.deleteTask(id, user);
    res.json({ success: success });
});


// mark task as complete
app.put('/tasks/complete/:id/:user', (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let user = req.params.user;
    const success = db.markTaskComplete(id, user);
    res.json({ success: success });
});


// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

