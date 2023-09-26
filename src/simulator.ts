// a simulator that will use client ts
//
// this will simulate two users working on tasks
// user1 will work on task1 for 5 seconds
// user2 will work on task2 for 10 seconds
// user1 will mark task1 as complete
// user2 will mark task2 as complete
// Path: src/console.ts


import Client from './client';

const documentName = "fred.json";
const dispatcher = new Client('dispatcher');
const worker1 = new Client('user1');
const worker2 = new Client('user2');

async function resetServer() {
    // clear the database
    worker1.clearData(documentName);
}


async function workOnTask(client: Client, taskId: string, time: number) {
    // request the task
    await client.addUserToTask(taskId, documentName);
    console.log(`${client.userID} is working on ${taskId} for ${time} seconds`);


    // every second update the task with a value of 1
    for (let i = 0; i < time; i++) {
        console.log(`${client.userID} is working on ${taskId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await client.postTimeToTask(taskId, 1, documentName);
    }
    // post the time to the server
    await client.removeUserFromTask(taskId, documentName);

    console.log(`${client.userID} has worked on ${taskId} for ${time} seconds`);
}

async function canWorkOnTask(client: Client, taskId: string): Promise<boolean> {
    console.log(`${client.userID} is checking if they can work on ${taskId}`);

    let canWork = await worker2.addUserToTask(taskId, documentName)
        .then((result: boolean) => {
            return result;
        });
    return canWork;
}

// async function markTaskComplete(client: Client, taskId: string) {
//     console.log(`${client.userID} is marking ${taskId} as complete`);
//     // mark the task as complete
//     client.markTaskComplete(taskId, client.userID);
//     console.log(`${client.userID} has marked ${taskId} as complete`);
// }

async function main() {

    // reset the server
    await resetServer();


    let task1 = dispatcher.postTask('task1', documentName);
    let task2 = dispatcher.postTask('task2', documentName);
    let task3 = dispatcher.postTask('task3', documentName);

    let taskIdentifiers: string[] = [];
    Promise.all([task1, task2, task3]).then((values) => {
        // copy the values to the taskIdentifiers array
        taskIdentifiers = values;
        console.log(values);
    });


    // get the dispatcher tasks.  
    let tasksPromise = dispatcher.getTasks(documentName);

    // get the worker1 tasks.  
    let worker1TasksPromise = worker1.getTasks(documentName);

    let dispatcherTasks: any;
    let worker1Tasks: any;


    await tasksPromise.then((tasks: any) => {
        dispatcherTasks = tasks;

    });
    console.log("the dispatcher has posted these tasks");
    console.log(dispatcherTasks);

    await worker1TasksPromise.then((tasks: any) => {
        console.log("worker1 has these tasks");
        worker1Tasks = tasks;
        console.log(tasks);
    });


    let worker1time = 20;
    // now worker1 will work on task1 for worker1Time seconds asynchronously

    workOnTask(worker1, taskIdentifiers[0], worker1time);


    // worker2 also wants to pick up the first task.
    // and worker2 is stubborn and will wait until worker 1 is done then try to pick up the task

    let worker2isblocked = await canWorkOnTask(worker2, taskIdentifiers[0])
        .then((result: boolean) => { return result; })

    console.log(`worker2 is blocked ${worker2isblocked}`)

    while (!worker2isblocked) {
        console.log("worker2 is blocked");
        await new Promise(resolve => setTimeout(resolve, 1000));
        worker2isblocked = await canWorkOnTask(worker2, taskIdentifiers[0])
            .then((result: boolean) => { return result; })
        console.log("worker2 is blocked");
    }

    console.log("worker2 is not blocked");
    // worker2 will work on task1 for 10 seconds
    let worker2time = 10;
    workOnTask(worker2, taskIdentifiers[0], worker2time);


    // // worker2 will mark task1 as complete
    worker2.markTaskComplete(taskIdentifiers[0], documentName);




    // // add a task
    // worker1.postTask('task1');

    // // get the tasks
    // worker1.tasks;
    // worker2.tasks;

    // // work on task1 for 5 seconds
    // await workOnTask(worker1, 'task1', 5);

    // // work on task2 for 10 seconds
    // await workOnTask(worker2, 'task2', 10);

    // // mark task1 as complete
    // await markTaskComplete(worker1, 'task1');

    // // mark task2 as complete
    // await markTaskComplete(worker2, 'task2');
}


main();


