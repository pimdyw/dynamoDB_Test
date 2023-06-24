const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    token: process.env.AWS_SESSION_TOKEN
})

const docClient = new AWS.DynamoDB.DocumentClient()

const Table = 'Document'

module.exports = {
    docClient,
    Table
}
