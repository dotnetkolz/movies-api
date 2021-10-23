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

const getMovie = async (id) => {
  try {
    const params = {
      TableName: "movies",
      Key: {
        id: id,
      },
    };
    return await dynamoDb.get(params).promise();
  } catch (ex) {
    console.log("Get Error > ", ex);
  }

  return false;
}

const addMovie = async (request) => {
  try {
    const params = {
      TableName: "movies",
      Item: request,
    };

    const result = await dynamoDb.put(params).promise();

    return true;
  } catch (ex) {
    console.log("Add Exception > ", ex);
  }
  return false;
}

module.exports.add = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  console.log("Add movie request - ", requestBody);

  const dbMovie = await getMovie(requestBody.id);

  // If movie already exists in Db - do nothing
  if (dbMovie && dbMovie.Item) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Title already exists`
      })
    });
  }
  // Else add movie to Db
  else {
    const status = await addMovie(requestBody);

    // If movie added give 201 else give a 500
    if (status) {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          message: `Sucessfully added movie - ${requestBody.title}`
        })
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to add movie - ${requestBody.title}`,
          errorCode: "WM_MOVIE_101"
        })
      });
    }
  }
};

module.exports.get = async (event, context, callback) => {
  const response = await getMovie(event.pathParameters.id);

  console.log("Get response >> ", response);
  if (!response) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get movie - ${event.pathParameters.id}`,
        errorCode: "WM_MOVIE_102"
      })
    });
  }
  if (!response.Item) {
    // Based on use case can be 404 not found or 204 no content
    callback(null, {
      statusCode: 204
    });
  } else {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response.Item)
    });
  }
};