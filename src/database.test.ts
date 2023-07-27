import Database from './database';
import Document from './document';

describe('Database', () => {
    let database: Database;

    beforeEach(() => {
        // clean out  __dirname/documents


        database = new Database();
    });

    afterAll(() => {
        const fs = require('fs');
        const path = require('path');
        const directory = path.join(__dirname, 'documents');
        const files = fs.readdirSync(directory);

        for (const file of files) {
            // check if it is a test file
            if (file.startsWith('test_xxx')) {
                fs.unlinkSync(path.join(directory, file));
            }
        }
    });

    describe('getDocument', () => {
        it('should return a document with the given name', () => {
            const documentName = 'test_xxx';
            const document = database.createDocument(documentName);
            // add a task to the document
            document.addTask('test task');

            const result = database.getDocument(documentName);
            const tasks = result.getTasks();

            expect('test task').toBe(tasks.get('000000')?.name);
            expect(result).toBe(document);
        });

    });

    describe('getDocuments', () => {
        it('should return an array of all documents in the database', () => {
            const document1 = database.createDocument('test_xxx1');
            const document2 = database.createDocument('test_xxx2');
            const result = database.getDocuments();
            expect(result).toContain(document1);
            expect(result).toContain(document2);
        });
    });

    describe('createDocument', () => {
        it('should create a new document with the given name', () => {
            const documentName = 'test_xxx2';
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

    });

    describe('getTasks', () => {
        it('should return a map of tasks for the given document', () => {
            const documentName = 'test_xxx45';
            const document = database.createDocument(documentName);
            document.addTask('test task');
            const result = database.getTasks(documentName);
            expect(result.size).toBe(1);
            const task = result.get('000000');
            expect(task).toBeDefined();
            expect(task?.name).toBe('test task');

        });


    });

    describe('reset', () => {
        it('should reset the tasks for the given document', () => {
            const documentName = 'test_xxx3848';
            const document = database.createDocument(documentName);
            document.addTask('test task');
            database.reset(documentName);
            const result = database.getTasks(documentName);
            expect(result.size).toBe(0);
        });


    });

    describe('makeData', () => {
        it('should populate the tasks for the given document', () => {
            const documentName = 'test_xxx884383';
            database.makeData(documentName);
            const result = database.getTasks(documentName);
            expect(result.size).toBeGreaterThan(0);
        });

    });

    describe('addTask', () => {
        it('should add a task to the given document', () => {
            const documentName = 'test_xxx88383';
            const result = database.addTask('test task', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(1);
            expect(tasks.get('000000')?.name).toBe('test task');
            expect(result).toBe('000000');
        });

        it('should create a new document if one with the given name does not exist', () => {
            const documentName = 'test_xxx838479238838';
            // check if the file exists
            const fs = require('fs');
            const path = require('path');
            const file = path.join(__dirname, 'documents', documentName + '.json');

            // delete the file if it exists
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }


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
            const documentName = 'test_xxx3434';
            const taskId = database.addTask('test task', documentName);
            // assign the task to a user
            database.addUserToTask(taskId, 'user', documentName);
            expect(database.getTasks(documentName).size).toBe(1);
            database.deleteTask(taskId, 'user', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(0);
        });

        it('should not delete the task if the user is not assigned to it', () => {
            const documentName = 'test_xxx12434234';
            const taskId = database.addTask('test task', documentName);
            // assign the task to a user
            database.addUserToTask(taskId, 'user', documentName);
            expect(database.getTasks(documentName).size).toBe(1);
            // now try to delete as another user
            database.deleteTask(taskId, 'another user', documentName);
            const tasks = database.getTasks(documentName);
            expect(tasks.size).toBe(1);
        });


    });

    describe('addUserToTask', () => {
        it('should add the given user to the task with the given ID in the given document', () => {
            const documentName = 'test_xxx2309478402789';
            const taskId = database.addTask('test task', documentName);
            const result = database.addUserToTask(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.owner).toContain('user');
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test_xxxw988we8r7';
            const result = database.addUserToTask('nonexistent', 'user', documentName);
            expect(result).toBe(false);
        });

    });

    describe('removeUserFromTask', () => {
        it('should remove the given user from the task with the given ID in the given document', () => {
            const documentName = 'test_xxx2309478402789dds';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            database.removeUserFromTask(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task).toBeDefined();
            expect(task?.owner).not.toContain('user');
        });

    });

    describe('addTimeToTask', () => {
        it('should add the given time to the task with the given ID and user in the given document', () => {
            const documentName = 'test_xxx8838382';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.addTimeToTask(taskId, 'user', 10, documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.time).toBe(10);
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test_xxxddkfr223';
            const result = database.addTimeToTask('nonexistent', 'user', 10, documentName);
            expect(result).toBe(false);
        });
    });

    describe('markTaskComplete', () => {
        it('should mark the task with the given ID as complete for the given user in the given document', () => {
            const documentName = 'test_xxx883838234';
            const taskId = database.addTask('test task', documentName);
            database.addUserToTask(taskId, 'user', documentName);
            const result = database.markTaskComplete(taskId, 'user', documentName);
            const task = database.getTasks(documentName).get(taskId);
            expect(task?.complete).toBe(true);
            expect(result).toBe(true);
        });

        it('should return false if the task with the given ID does not exist in the given document', () => {
            const documentName = 'test_xxx33483';
            const result = database.markTaskComplete('nonexistent', 'user', documentName);
            expect(result).toBe(false);
        });


    });
});