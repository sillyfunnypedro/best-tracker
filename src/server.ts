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

import { Database } from './database';

const app = express();

app.use(bodyParser.json());

const db = new Database();

// get /tasks returns a list of all the tasks
app.get('/tasks', (req: express.Request, res: express.Response) => {
    let tasks = [];
    for (let [id, task] of db.tasks) {
        tasks.push({
            id: id,
            name: task.name,
            time: task.time,
            complete: task.complete
        });
    }
    res.json(tasks);
});

app.get('/makedata', (req: express.Request, res: express.Response) => {
    db.makeData();
    res.json({ success: true });
});

// post /tasks creates a new task and returns the id
// the body of the request should be a json object

app.post('/task', (req: express.Request, res: express.Response) => {
    let name = req.body.name;
    let id = db.addTask(name);
    res.json({ id: id });
});

app.put('/tasks/assign/:id:user', (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    let user = req.params.user;
    const success = db.addUserToTask(id, user);
    res.json({ success: success });
});




// start the app and test it
app.listen(3000, () => {
    console.log('listening on port 3000');
});

// test the app
// 1. start the app
// 2. open a browser and go to http://localhost:3000/tasks
// 3. open a terminal and run curl http://localhost:3000/tasks
// 4. open a terminal and run curl -X POST -H "Content-Type: application/json" -d '{"name":"test","time":0,"complete":false}' http://localhost:3000/tasks
// 5. open a terminal and run curl -X PUT http://localhost:3000/tasks/assign/000000:testuser
