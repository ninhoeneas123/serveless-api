import extractBody from '../utils/extract-body.js';
import { User } from '../user/use-cases.js';
import { buildResponse } from '../utils/build-response.js'
import { connectDataBaseCollection } from '../database.js'
import pkg from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'

function createToken(userName, id) {
    const { sign } = pkg

    const token = sign({ userName, id }, process.env.JWT_SECRET,
        {
            expiresIn: '1h',
            audience: process.env.JWT_AUDIENCE,
        })

    return token
}
export async function authorize(authorizationHeader) {
    const {verify } = pkg
    if (!authorizationHeader) return buildResponse(401, { error: 'Missing authorization header' })
    const [scheme, token] = authorizationHeader.split(' ')
    console.log("scheme", scheme, "token", token)
    if (scheme !== 'Bearer' || !token) return buildResponse(401, { error: 'Invalid authorization header' })
  
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET, { audience: process.env.JWT_AUDIENCE })
      if (!decodedToken) return buildResponse(401, { error: 'Invalid token' })
      return decodedToken
    } catch (err) {
      return buildResponse(401, { error: 'Invalid token' })
    }
  }


export async function login(event) {
    const { userName, password } = extractBody(event)
    const hashPass = makeHash(password)
    const userClass = new User()
    const user =  await userClass.getUserByCredentials(userName, hashPass)
    if (!user) {
        return buildResponse(401, {
            message: 'User or password invalid'
        })
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
        return buildResponse(401, {
            message: 'User or password invalid'
        })
    }
    const token = createToken(userName, user._id)
    return buildResponse(200, { 
        message: 'User logged',
        body: {
            token: token
        }
    })
}

export function makeHash(password) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

