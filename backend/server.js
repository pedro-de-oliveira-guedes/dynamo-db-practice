require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

var AWS = require('aws-sdk');

const {
    DynamoDB
} = require('@aws-sdk/client-dynamodb');

app.use(express.static(path.join(__dirname, '../frontend/styles')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', 'index.html'));
});

app.get('/test', (req, res) => {
    AWS.config.update({region: 'us-east-1'});

    var dynamodb = new DynamoDB({
        region: 'us-east-1'
    });

    var params = {}
    dynamodb.listTables(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
