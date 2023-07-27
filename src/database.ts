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


}
export default Database;