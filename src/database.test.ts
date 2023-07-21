export { };
import { Task, Database } from './database';
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
            expect(task.getOwner()).toBe('Test User');
        });

        it('should not set the owner property if it is already set', () => {
            task.requestOwner('Test User');
            const result = task.requestOwner('Another User');
            expect(result).toBe(false);
            expect(task.getOwner()).toBe('Test User');
        });
    });
});

describe('Database', () => {
    let database: Database;

    beforeEach(() => {
        database = new Database();
    });

    afterEach(() => {
        database['_tasks'] = new Map<string, Task>();
        database['_id'] = 0;
        fs.unlinkSync(database['_filename']);
    });

    describe('constructor', () => {
        it('should create a new database instance', () => {
            expect(database).toBeDefined();
        });

        it('should load the tasks from the file', () => {
            const task = new Task('Test Task', 60, false);
            database.addTask(task.name, task.time, task.complete);
            database = new Database();
            expect(database.tasks.size).toBe(1);
            expect(database.tasks.get('000000')).toEqual(task);
        });
    });

    describe('addTask', () => {
        it('should add a task to the list of tasks', () => {
            const id = database.addTask('Test Task', 60, false);
            expect(database.tasks.size).toBe(1);
            expect(database.tasks.get(id)).toBeDefined();
            expect(database.tasks.get(id)?.name).toBe('Test Task');
            expect(database.tasks.get(id)?.time).toBe(60);
            expect(database.tasks.get(id)?.complete).toBe(false);
        });

        it('should generate a unique id for the task', () => {
            const id1 = database.addTask('Test Task 1', 60, false);
            const id2 = database.addTask('Test Task 2', 120, true);
            expect(id1).not.toBe(id2);
        });
    });

    describe('addUserToTask', () => {
        it('should set the owner of the task to the specified user', () => {
            const id = database.addTask('Test Task', 60, false);
            const result = database.addUserToTask(id, 'Test User');
            expect(result).toBe(true);
            expect(database.tasks.get(id)?.getOwner()).toBe('Test User');
        });

        it('should not set the owner of the task if it is already set', () => {
            const id = database.addTask('Test Task', 60, false);
            database.addUserToTask(id, 'Test User');
            const result = database.addUserToTask(id, 'Another User');
            expect(result).toBe(false);
            expect(database.tasks.get(id)?.getOwner()).toBe('Test User');
        });

        it('should return false if the task does not exist', () => {
            const result = database.addUserToTask('000000', 'Test User');
            expect(result).toBe(false);
        });
    });

    describe('removeUserFromTask', () => {
        it('should clear the owner of the task', () => {
            const id = database.addTask('Test Task', 60, false);
            database.addUserToTask(id, 'Test User');
            database.removeUserFromTask(id, 'Test User');
            expect(database.tasks.get(id)?.getOwner()).toBe('');
        });

        it('should not clear the owner of the task if the user does not match', () => {
            const id = database.addTask('Test Task', 60, false);
            database.addUserToTask(id, 'Test User');
            database.removeUserFromTask(id, 'Another User');
            expect(database.tasks.get(id)?.getOwner()).toBe('Test User');
        });

        it('should do nothing if the task does not exist', () => {
            database.removeUserFromTask('000000', 'Test User');
            expect(database.tasks.size).toBe(0);
        });
    });

    describe('addTimeToTask', () => {
        it('should add time to the task if the user matches the owner', () => {
            const id = database.addTask('Test Task', 60, false);
            database.addUserToTask(id, 'Test User');
            const result = database.addTimeToTask(id, 'Test User', 30);
            expect(result).toBe(true);
            expect(database.tasks.get(id)?.time).toBe(90);
        });

        it('should not add time to the task if the user does not match the owner', () => {
            const id = database.addTask('Test Task', 60, false);
            database.addUserToTask(id, 'Test User');
            const result = database.addTimeToTask(id, 'Another User', 30);
            expect(result).toBe(false);
            expect(database.tasks.get(id)?.time).toBe(60);
        });

        it('should do nothing if the task does not exist', () => {
            const result = database.addTimeToTask('000000', 'Test User', 30);
            expect(result).toBe(false);
        });
    });
});