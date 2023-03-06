import { MongoClient } from 'mongodb'

async function connectDatabase() {
    const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING)
    const connection = await client.connect()

    const connectionInstance = connection.db(process.env.MONGODB_DB_NAME)
    return connectionInstance
}

export async function connectDataBaseCollection(collectionName) {
    console.log('collectionName', collectionName)
    const client = await connectDatabase()
    const collection = await client.collection(collectionName)
    return collection
}

