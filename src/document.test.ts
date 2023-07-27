export { };
import Document from './document';
import Task from './task';
import * as fs from 'fs';
import * as path from 'path';



describe('Task', () => {
    let task: Task;

    beforeEach(() => {
        task = new Task('Test Task', 60, false);
    });

    describe('constructor', () => {
        it('should set the name, time, and complete properties', () => {
            expect(task.name).toBe('Test Task');
            expect(task.time).toBe(60);
            expect(task.complete).toBe(false);
        });
    });

    describe('name', () => {
        it('should get the name property', () => {
            expect(task.name).toBe('Test Task');
        });

        it('should set the name property', () => {
            task.name = 'Updated Task';
            expect(task.name).toBe('Updated Task');
        });
    });

    describe('time', () => {
        it('should get the time property', () => {
            expect(task.time).toBe(60);
        });

        it('should set the time property', () => {
            task.time = 120;
            expect(task.time).toBe(120);
        });
    });

    describe('complete', () => {
        it('should get the complete property', () => {
            expect(task.complete).toBe(false);
        });

        it('should set the complete property', () => {
            task.complete = true;
            expect(task.complete).toBe(true);
        });
    });

    describe('requestOwner', () => {
        it('should set the owner property if it is empty', () => {
            const result = task.requestOwner('Test User');
            expect(result).toBe(true);
            expect(task.owner).toBe('Test User');
        });

        it('should not set the owner property if it is already set', () => {
            task.requestOwner('Test User');
            const result = task.requestOwner('Another User');
            expect(result).toBe(false);
            expect(task.owner).toBe('Test User');
        });
    });
});

describe('Document', () => {
    let document: Document;

    beforeEach(() => {
        // get a unique filename for the test
        const filename = `${Date.now()}`
        document = new Document(filename);
    });

    afterEach(() => {
        // 
        //fs.unlinkSync(document['_filename']);
    });

    describe('constructor', () => {
        it('should create a new database instance', () => {
            expect(document).toBeDefined();
        });

        it('should load the tasks from the file', () => {
            const taskName = 'Test Task';
            document.addTask(taskName);
            expect(document.tasks.size).toBe(1);
            const task = document.tasks.get('000000');
            expect(task).toBeDefined();
            expect(task?.name).toBe(taskName);

        });
    });

    describe('addTask', () => {
        it('should add a task to the list of tasks', () => {
            const id = document.addTask('Test Task');
            //expect(document.tasks.size).toBe(');
            expect(document.tasks.get(id)).toBeDefined();
            expect(document.tasks.get(id)?.name).toBe('Test Task');
            expect(document.tasks.get(id)?.time).toBe(0);
            expect(document.tasks.get(id)?.complete).toBe(false);
        });

        it('should generate a unique id for the task', () => {
            const id1 = document.addTask('Test Task 1');
            const id2 = document.addTask('Test Task 2');
            expect(id1).not.toBe(id2);
        });
    });

    describe('addUserToTask', () => {
        it('should set the owner of the task to the specified user', () => {
            const id = document.addTask('Test Task');
            const result = document.addUserToTask(id, 'Test User');
            expect(result).toBe(true);
            expect(document.tasks.get(id)?.owner).toBe('Test User');
        });

        it('should not set the owner of the task if it is already set', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            const result = document.addUserToTask(id, 'Another User');
            expect(result).toBe(false);
            expect(document.tasks.get(id)?.owner).toBe('Test User');
        });

        it('should return false if the task does not exist', () => {
            const result = document.addUserToTask('000000', 'Test User');
            expect(result).toBe(false);
        });
    });

    describe('reset', () => {
        it('should clear the list of tasks', () => {
            document.addTask('Test Task');
            document.reset();
            expect(document.tasks.size).toBe(0);
        });
    });

    describe('makeData', () => {
        it('should create a list of tasks', () => {
            document.makeData();
            expect(document.tasks.size).toBe(5);
        });
    });

    describe('removeUserFromTask', () => {
        it('should clear the owner of the task', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            document.removeUserFromTask(id, 'Test User');
            expect(document.tasks.get(id)?.owner).toBe('');
        });

        it('should not clear the owner of the task if the user does not match', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            document.removeUserFromTask(id, 'Another User');
            expect(document.tasks.get(id)?.owner).toBe('Test User');
        });

        it('should do nothing if the task does not exist', () => {
            document.removeUserFromTask('000000', 'Test User');
            //expect(document.tasks.size).toBe(0);
        });
    });

    describe('addTimeToTask', () => {
        it('should add time to the task if the user matches the owner', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            const result = document.addTimeToTask(id, 'Test User', 30);
            expect(result).toBe(true);
            expect(document.tasks.get(id)?.time).toBe(30);
        });

        it('should not add time to the task if the user does not match the owner', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            const result = document.addTimeToTask(id, 'Another User', 30);
            expect(result).toBe(false);
            expect(document.tasks.get(id)?.time).toBe(0);
        });

        it('should do nothing if the task does not exist', () => {
            const result = document.addTimeToTask('000000', 'Test User', 30);
            expect(result).toBe(false);
        });
    });

    describe('named constructor', () => {
        it('should be able to create a new database with a name', () => {
            const database1 = new Document('test1');
            const database2 = new Document('test2');
            expect(database1['_filename']).toBe(path.join(__dirname, 'documents', 'test1.json'));
            expect(database2['_filename']).toBe(path.join(__dirname, 'documents', 'test2.json'));
        });

    });

    describe('deleteTask', () => {
        it('should delete the task if the user matches the owner', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            const result = document.deleteTask(id, 'Test User');
            expect(result).toBe(true);
            expect(document.tasks.size).toBe(0);
        });
    });

    describe('deleteTask', () => {
        it('should not delete the task if the user does not match the owner', () => {
            const id = document.addTask('Test Task');
            document.addUserToTask(id, 'Test User');
            const result = document.deleteTask(id, 'Another User');
            expect(result).toBe(false);
            expect(document.tasks.size).toBe(1);
        });
    });
});