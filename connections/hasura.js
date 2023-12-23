const fetchGQL = require('graphql-client')

const client = new fetchGQL({
  url: 'http://192.168.1.250:8086/v1/graphql',
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': 'Admin@hmssecret123',
  }
})
module.exports = client