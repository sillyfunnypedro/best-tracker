import Database from './database';
import Document from './document';

describe('Database', () => {
    let database: Database;

    beforeEach(() => {
        // clean out  __dirname/documents
        const fs = require('fs');
        const path = require('path');
        const directory = path.join(__dirname, 'documents');
        const files = fs.readdirSync(directory);
        for (const file of files) {
            // delete the file
            fs.unlinkSync(path.join(directory, file));
        }
        database = new Database();
    });

    describe('getDocument', () => {
        it('should return a document with the given name', () => {
            const documentName = 'test';
            const document = database.createDocument(documentName);
            // add a task to the document
            document.addTask('test task');

            const result = database.getDocument(documentName);
            const tasks = result.getTasks();

            expect('test task').toBe(tasks.get('000000')?.name);
            expect(result).toBe(document);
        });

        it('should throw an error if no document with the given name exists', () => {
            expect(() => database.getDocument('nonexistent')).toThrowError('Document nonexistent does not exist');
        });
    });

    describe('getDocuments', () => {
        it('should return an array of all documents in the database', () => {
            const document1 = database.createDocument('test1');
            const document2 = database.createDocument('test2');
            const result = database.getDocuments();
            expect(result).toContain(document1);
            expect(result).toContain(document2);
        });
    });

    describe('createDocument', () => {
        it('should create a new document with the given name', () => {
            const documentName = 'test';
            const fs = require('fs');
            const path = require('path');
            const file = path.join(__dirname, 'documents', documentName + '.json');

            // delete the file if it exists
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }

            const result = database.createDocument(documentName);
            expect(result).toBeInstanceOf(Document);
            // check that the file for the document exists
            // the file should be in __dirname/documents/documentName.json

            const fileExists: boolean = fs.existsSync(file);

            expect(fileExists).toBe(true);
        });

        // it('should return an existing document if one with the same name already exists', () => {
        //     const documentName = 'test';
        //     const document1 = database.createDocument(documentName);
        //     const document2 = database.createDocument(documentName);
        //     expect(document2).toBe(document1);
        // });
    });

    describe('getTasks', () => {
        it('should return a map of tasks for the given document', () => {
            const documentName = 'test';
            const document = database.createDocument(documentName);
            document.addTask('test task');
            const result = database.getTasks(documentName);
            expect(result.size).toBe(1);
            const task = result.get('000000');
            expect(task).toBeDefined();
            expect(task?.name).toBe('test task');

        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const result = database.getTasks(documentName);
            expect(result.size).toBe(0);
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('reset', () => {
        it('should reset the tasks for the given document', () => {
            const documentName = 'test';
            const document = database.createDocument(documentName);
            document.addTask('test task');
            database.reset(documentName);
            const result = database.getTasks(documentName);
            expect(result.size).toBe(0);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            database.reset(documentName);
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('makeData', () => {
        it('should populate the tasks for the given document', () => {
            const documentName = 'test';
            database.makeData(documentName);
            const result = database.getTasks(documentName);
            expect(result.size).toBeGreaterThan(0);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            database.makeData(documentName);
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('addTask', () => {
        it('should add a task to the given document', () => {
            const documentName = 'test';
            const result = database.addTask('test task', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(1);
            expect(tasks.get('000000')?.name).toBe('test task');
            expect(result).toBe('000000');
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const result = database.addTask('test task', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(1);
            expect(tasks.get('000000')?.name).toBe('test task');
            expect(result).toBe('000000');
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('deleteTask', () => {
        it('should delete the task with the given ID from the given document', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            // assign the task to a user
            database.addUserToTask(taskId, 'user', documentName);
            expect(database.getTasks(documentName).size).toBe(1);
            database.deleteTask(taskId, 'user', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(0);
        });

        it('should not delete the task if the user is not assigned to it', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            // assign the task to a user
            database.addUserToTask(taskId, 'user', documentName);
            expect(database.getTasks(documentName).size).toBe(1);
            // now try to delete as another user
            database.deleteTask(taskId, 'another user', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(1);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const taskId = database.addTask('test task', documentName);
            database.deleteTask(taskId, 'user', documentName);
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('addUserToTask', () => {
        it('should add the given user to the task with the given ID in the given document', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            const result = database.addUserToTask(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.owner).toContain('user');
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test';
            const result = database.addUserToTask('nonexistent', 'user', documentName);
            expect(result).toBe(false);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const taskId = database.addTask('test task', documentName);
            const result = database.addUserToTask(taskId, 'user', documentName);
            expect(database.getDocument(documentName)).toBeDefined();
            expect(result).toBe(true);
        });
    });

    describe('removeUserFromTask', () => {
        it('should remove the given user from the task with the given ID in the given document', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            database.removeUserFromTask(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task).toBeDefined();
            expect(task?.owner).not.toContain('user');
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            database.removeUserFromTask(taskId, 'user', documentName);
            expect(database.getDocument(documentName)).toBeDefined();
        });
    });

    describe('addTimeToTask', () => {
        it('should add the given time to the task with the given ID and user in the given document', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.addTimeToTask(taskId, 'user', 10, documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.time).toBe(10);
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test';
            const result = database.addTimeToTask('nonexistent', 'user', 10, documentName);
            expect(result).toBe(false);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.addTimeToTask(taskId, 'user', 10, documentName);
            expect(database.getDocument(documentName)).toBeDefined();
            expect(result).toBe(true);
        });
    });

    describe('markTaskComplete', () => {
        it('should mark the task with the given ID as complete for the given user in the given document', () => {
            const documentName = 'test';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.markTaskComplete(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.complete).toBe(true);
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test';
            const result = database.markTaskComplete('nonexistent', 'user', documentName);
            expect(result).toBe(false);
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'nonexistent';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.markTaskComplete(taskId, 'user', documentName);
            expect(database.getDocument(documentName)).toBeDefined();
            expect(result).toBe(true);
        });
    });
});