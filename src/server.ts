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

import Database from './database';

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



app.post('/cleardata', (req: express.Request, res: express.Response) => {
    // the documentName is in rec.bogy.documentName
    // return a json object with a success flag ({success: true}})
    let documentName = req.body.documentName
    db.reset(documentName);
    res.json({ success: true });
});


app.post('/makedata', (req: express.Request, res: express.Response) => {

});
// ********************************************
// the above is not good practice
// ********************************************
// ********************************************

// delete /tasks clears the list of tasks
app.post('/tasks/delete/', (req: express.Request, res: express.Response) => {
    console.log("deleting tasks");
});

app.get('/documents', (req: express.Request, res: express.Response) => {
    // find the db function that returns a list of documents
    let documents: string[] = []
    res.json(documents);
});

// get /tasks returns a list of all the tasks
app.post('/tasks', (req: express.Request, res: express.Response) => {
    // return a list of the tasks each with an [ id , task]
    let tasks: string[] = [] // this is not the right type
    res.json(tasks);
});


// post a new task
app.post('/tasks/add/:name', (req: express.Request, res: express.Response) => {
    let name = req.params.name;
    let documentName = req.body.documentName

    const id = db.addTask(name, documentName);
    console.log(`added task ${id} ${name}`)
    res.json({ id: id });
});

// assign user to the task
app.put('/tasks/assign/:id/:user', (req: express.Request, res: express.Response) => {
    // look up the db function that assigns a user to a task
    const success = true;

    res.json({ success: success });
});

// remove user from the task
app.put('/tasks/remove/:id/:user', (req: express.Request, res: express.Response) => {
    // lookup the db function that removes a user from a task

    const success = true;
    res.json({ success: success });
});

// add time to the task
app.put('/tasks/update/:id/:user/:time', (req: express.Request, res: express.Response) => {
    // look up the db function that adds time to a task

    const success = true;


    res.json({ success: success });
});


// delete a task from the list if it is owed by the user
app.post('/tasks/delete/:id/:user', (req: express.Request, res: express.Response) => {
    // look up the db function that deletes a task from the list

    const success = true;
    res.json({ success: success });
});


// mark task as complete
app.put('/tasks/complete/:id/:user', (req: express.Request, res: express.Response) => {
    // look up the db function that marks a task as complete

    const success = true;
    res.json({ success: success });
});


// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

