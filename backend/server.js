require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const {
    DynamoDB
} = require('@aws-sdk/client-dynamodb');

const {
    DynamoDBDocument
} = require('@aws-sdk/lib-dynamodb');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend/styles')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', 'index.html'));
});

app.get('/accounts', (req, res) => {
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

app.post('/accounts', (req, res) => {
    var dynamoDocClient = DynamoDBDocument.from(new DynamoDB({
        region: 'us-east-1'
    }));

    const params = {
        TableName: 'accounts',
        Item: req.body
    }

    dynamoDocClient.put(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

app.put('/accounts', (req, res) => {
    var dynamoDocClient = DynamoDBDocument.from(new DynamoDB({
        region: 'us-east-1'
    }));

    const params = {
        TableName: 'accounts',
        Key: {
            account_id: req.body.account_id,
            name: req.body.name
        },
        UpdateExpression: 'set #a = :a',
        ExpressionAttributeNames: {
            '#a': 'age'
        },
        ExpressionAttributeValues: {
            ':a': req.body.age
        }
    }

    dynamoDocClient.update(params, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

app.delete('/accounts', (req, res) => {
    var dynamoDocClient = DynamoDBDocument.from(new DynamoDB({
        region: 'us-east-1'
    }));

    const params = {
        TableName: 'accounts',
        Key: {
            account_id: req.body.account_id,
            name: req.body.name
        }
    }

    dynamoDocClient.delete(params, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
