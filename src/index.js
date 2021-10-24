'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
    console.log("Get Exception > ", ex);
  }

  return false;
}

const addMovie = async (request) => {
  try {
    const params = {
      TableName: "movies",
      Item: {
        id: request.id,
        title: request.title,
        releaseDate: request.releaseDate,
        genres: request.genres
      },
    };

    const result = await dynamoDb.put(params).promise();

    return true;
  } catch (ex) {
    console.log("Add Exception > ", ex);
  }
  return false;
}

const updateMovie = async (id, request) => {

  try {
    const params = {
      TableName: "movies",
      Item: {
        id: id,
        title: request.title,
        releaseDate: request.releaseDate,
        genres: request.genres
      },
    };

    const result = await dynamoDb.put(params).promise();

    return true;
  } catch (ex) {
    console.log("Update Exception > ", ex);
  }
  return false;
}

const deleteMovie = async (id) => {
  try {
    const params = {
      TableName: "movies",
      Key: {
        id: id,
      },
    };
    return await dynamoDb.delete(params).promise();
  } catch (ex) {
    console.log("Delete Exception > ", ex);
  }

  return false;
}
module.exports.get = async (event, context, callback) => {
  const response = await getMovie(event.pathParameters.id);

  console.log("Get response >> ", response);
  if (!response) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get movie - ${event.pathParameters.id}`,
        errorCode: "WM_MOVIE_100"
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

module.exports.add = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const dbMovie = await getMovie(requestBody.id);

  // If movie already exists in Db - do nothing
  if (dbMovie && dbMovie.Item) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Movie already exists`
      })
    });
  }
  // Else add movie to Db
  else {
    console.log("Add movie request - ", requestBody);
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

module.exports.update = async (event, context, callback) => {
  const dbMovie = await getMovie(event.pathParameters.id);

  // Update only if exists
  if (dbMovie && dbMovie.Item) {
    const requestBody = JSON.parse(event.body);
    const status = await updateMovie(event.pathParameters.id, requestBody);
    // If movie added give 201 else give a 500
    if (status) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully updated movie - ${requestBody.title}`
        })
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to update movie - ${requestBody.title}`,
          errorCode: "WM_MOVIE_102"
        })
      });
    }

  } else {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid movie",
        errorCode: "WM_MOVIE_103"
      })
    });
  }
};

module.exports.delete = async (event, context, callback) => {
  const response = await getMovie(event.pathParameters.id);

  if (response && response.Item) {
    const status = await deleteMovie(event.pathParameters.id);

    if (status) {
      callback(null, {
        statusCode: 200
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to delete movie`,
          errorCode: "WM_MOVIE_104"
        })
      });
    }
  }

  callback(null, {
    statusCode: 400,
    body: JSON.stringify({
      message: `Invalid movie`,
      errorCode: "WM_MOVIE_105"
    })
  });
};
