/**
 * A database that maintains multiple documents
 * 
 * The documents are all the documents in __dirname/documents/*.json
 * 
 * The database imports Document from document.ts
 * 
 * the data base has call through functions for each of the functions in document.ts
 * 
 * the database has a function to get a document by name
 * 
 * the database has a function to get a list of all the documents
 * 
 * the database has a function to create a new document
 * 
 * for the purposes of this demo we will not have a function to delete a document
 * 
 * In this demo code we are using the tasks.json file as the default document
 * 
 * This will allow us to demonstrate how to refactor this code.
 */
import * as fs from 'fs';
import * as path from 'path';
import Document from './document';
import Task from './task';

export class Database {
    private _documents: Map<string, Document>;
    private _documentDirectory: string = path.join(__dirname, "documents");


    constructor() {
        this._documents = new Map<string, Document>();
        this._initializeDirectory();
        this._loadDocuments();
    }

    private _initializeDirectory() {
        if (!fs.existsSync(this._documentDirectory)) {
            fs.mkdirSync(this._documentDirectory, { recursive: true });
        }

    }

    private _loadDocuments() {
        let files = fs.readdirSync(this._documentDirectory);

        for (let file of files) {
            let documentName = path.parse(file).name;
            let document = new Document(documentName);
            this._documents.set(documentName, document);
        }
    }

    public getDocument(documentName: string): Document {
        const document = this._documents.get(documentName);
        if (document) {
            return document;
        }
        throw new Error(`Document ${documentName} does not exist`);

    }

    public getDocuments(): Document[] {
        let documents = [];
        for (let [name, document] of this._documents) {
            documents.push(document);
        }
        return documents;
    }

    public createDocument(documentName: string = "tasks"): Document {
        let document = new Document(documentName);
        this._documents.set(documentName, document);
        return document;
    }

    public getTasks(documentName: string): Map<string, Task> {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        return document.getTasks();
    }

    public reset(documentName: string = "tasks") {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        document.reset();
    }

    public makeData(documentName: string = "tasks") {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        document.makeData();
    }

    public addTask(name: string, documentName: string = "tasks"): string {
        // check to see if the document exists
        console.log("----->" + documentName + "<-----")
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        return document.addTask(name);
    }

    // make the shim for all the database functions that 
    public deleteTask(id: string, user: string, documentName: string = "tasks") {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        document.deleteTask(id, user);
    }

    public addUserToTask(id: string, user: string, documentName: string = "tasks"): boolean {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        return document.addUserToTask(id, user);
    }

    public removeUserFromTask(id: string, user: string, documentName: string = "tasks") {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        document.removeUserFromTask(id, user);
    }

    public addTimeToTask(id: string, user: string, time: number, documentName: string = "tasks",): boolean {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        return document.addTimeToTask(id, user, time);
    }

    public markTaskComplete(id: string, user: string, documentName: string = "tasks"): boolean {
        // check to see if the document exists
        if (!this._documents.has(documentName)) {
            // create the document
            this.createDocument(documentName);
        }
        let document = this.getDocument(documentName);
        return document.markTaskComplete(id, user);
    }

}
export default Database;