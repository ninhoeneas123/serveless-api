import { ObjectId } from 'mongodb'
import { connectDataBaseCollection } from '../database.js'


export class User {
    constructor() {
    }

    async create(userData) {
        const query = await connectDataBaseCollection('users-serverless')
        const user = await query.insertOne(userData)

        return user
    }

    async getById(id) {
        console.log(id)
        const query = await connectDataBaseCollection('users-serverless')
        const user = await query.findOne({ _id: new ObjectId(id) })
        console.log("user", user)
        return user
    }

    async getAll() {
        const query = await connectDataBaseCollection('users-serverless')
        const users = await query.find({}).toArray()
        return users
    }

    async update(id, userData) {
        const query = await connectDataBaseCollection('users-serverless')
        const usersData = await query.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: userData }, { returnOriginal: false })
        return usersData
    }

    async delete(id) {
        const query = await connectDataBaseCollection('users-serverless')
        const user = await query.findOneAndDelete({ _id: new ObjectId(id)})
        return user
    }
    async  getUserByCredentials(username) {
        const query = await connectDataBaseCollection('users-serverless')
        const user = await query.findOne({ email: username})
        if (!user) return null
        return user
      }
}

