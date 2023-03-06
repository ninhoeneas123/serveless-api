
import { buildResponse } from './build-response.js'

export default function extractBody(event) {
    if (!event?.body) {

        return buildResponse(400, {
            message: 'Missing body'
        })
    }

    return JSON.parse(event.body)
}