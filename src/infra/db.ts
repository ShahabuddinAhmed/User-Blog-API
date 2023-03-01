import { Mongoose, connect } from "mongoose";

export class MongoDB {
	dbName: string;
    dbClient: Mongoose;

    constructor(mongooseClient: Mongoose, dbName: string) {
        this.dbClient = mongooseClient;
		this.dbName = dbName;
    }
}


export const newMongoDB = async (mongooseClient: Mongoose, dbName: string): Promise<MongoDB> => {
    return new MongoDB(mongooseClient, dbName);
};


export const initializeDBConnection = async (dbURI: string, dbName: string): Promise<MongoDB> => {
    try {
        return newMongoDB(await connect(dbURI, { dbName  }), dbName);
    } catch (err) {
        console.log("Failed to connect the Database Server");
        console.log(err);
        process.exit(1);
    }
};


export default MongoDB;