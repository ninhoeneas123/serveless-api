export function buildResponse(statusCode, body, headers) {
  return {
    statusCode: statusCode,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body)
  }
}
