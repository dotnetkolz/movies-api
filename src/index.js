'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.test = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Test executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

};

module.exports.add = async (event, context, callback) => {
  try {

    const requestBody = JSON.parse(event.body);
    console.log("Movie Request - ", requestBody);

    const movieInfo = {
      TableName: "movies",
      Item: requestBody,
    };
    const result = await dynamoDb.put(movieInfo).promise();
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        message: `Sucessfully added movie - ${requestBody.title}`
      })
    });

  } catch (ex) {

    console.log("Add Error > ", ex);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to add movie - ${requestBody.title}`,
        error: ex
      })
    });
  }
};

module.exports.get = async (event, context, callback) => {

  try {
    const params = {
      TableName: "movies",
      Key: {
        id: event.pathParameters.id,
      },
    };
    const response = await dynamoDb.get(params).promise();
    console.log("Get response >> ", response);
    if(!response.Item) {
      callback(null, {
        statusCode: 204
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.Item)
      });
    }
    
  } catch (ex) {
    console.log("Get Error > ", ex);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get movie - ${event.pathParameters.id}`,
        error: ex
      })
    });
  }
};