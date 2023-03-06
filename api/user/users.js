
import bcrypt from 'bcrypt'
import { buildResponse } from '../utils/build-response.js'
import extractBody from '../utils/extract-body.js'
import { User } from './use-cases.js'
import * as auth from '../auth/auth.js'

async function cryptPassword(password) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

export async function createUser(event) {
    let userClass = new User()
    const authResult = await auth.authorize(event.headers.authorization)
    if (authResult.statusCode === 401) return authResult

    const { name, email, password } = extractBody(event)
    const emailIsVality = await userClass.getUserByCredentials(email)

    if (emailIsVality) {
        return buildResponse(400, {
            message: 'Email already exists'
        })
    }

    const user = {
        name: name,
        email: email,
        password: await cryptPassword(password)
    }
    const userData = await userClass.create(user)

    return buildResponse(201, {
        message: 'User created',
        body: {
            insertdId: userData.insertedId,
        }
    })
}

export async function getById(event) {
    const authResult = await auth.authorize(event.headers.authorization)
    if (authResult.statusCode === 401) return authResult

    let collection = new User()
    const users = await collection.getById(event.pathParameters.id)
    console.log(users)
    if (!users) {
        return buildResponse(404, {
            message: 'User not found'
        })
    }
    return buildResponse(200,
        {
            message: 'User found',
            body: users
        }
    )
}

export async function getAll(event) {
    const authResult = await auth.authorize(event.headers.authorization)
    if (authResult.statusCode === 401) return authResult

    let collection = new User()
    const users = await collection.getAll()

    return buildResponse(200, {
        message: 'Users found',
        body: users
    })
}

export async function update(event) {
    const authResult = await auth.authorize(event.headers.authorization)
    if (authResult.statusCode === 401) return authResult

    const body = extractBody(event)
    let collection = new User()
    const user = await collection.update(event.pathParameters.id, body)

    return buildResponse(200, {
        message: 'User updated successfully',
        body: user.value
    })
}

export async function remove(event) {
    const authResult = await auth.authorize(event.headers.authorization)
    if (authResult.statusCode === 401) return authResult

    let collection = new User()
    const user = await collection.delete(event.pathParameters.id)

    return buildResponse(200, {
        message: 'User deleted successfully',
    })
}

