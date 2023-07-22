class Task {
    private _name: string;
    private _time: number;
    private _complete: boolean;
    private _owner: string;
    private _id: string;

    constructor(name: string, time: number, complete: boolean) {
        this._name = name;
        this._time = time;
        this._complete = complete;
        this._owner = "";
        this._id = "";
    }

    public get id(): string {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
    }

    public get name(): string {
        return this._name;
    }

    public get time(): number {
        return this._time;
    }

    public get complete(): boolean {
        return this._complete;
    }

    public set name(name: string) {
        this._name = name;
    }

    public set time(time: number) {
        this._time = time;
    }

    public set complete(complete: boolean) {
        this._complete = complete;
    }

    public get owner(): string {
        return this._owner;
    }
    // requestOwner(user:string): boolean
    public requestOwner(user: string): boolean {
        console.log(`requesting owner ${user} for task ${this._name}`);
        if (this._owner === "") {
            console.log(`assigning owner ${user} for task ${this._name}`);
            this._owner = user;
            return true;
        }
        return false;
    }

    public clearOwner() {
        this._owner = "";
    }
}
export default Task;