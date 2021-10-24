'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Get movie title from dynamodb
 * @param {string} id 
 * @returns title object
 */
const getTitle = async (id) => {
  try {
    const params = {
      TableName: "wm_titles",
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

/**
 * Adds movie title to dynamodb
 * @param {object} request 
 * @returns 
 */
const addTitle = async (request) => {
  try {
    const params = {
      TableName: "wm_titles",
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

/**
 * Update movie title 
 * @param {string} id 
 * @param {object} request 
 * @returns 
 */
const updateTitle = async (id, request) => {

  try {
    const params = {
      TableName: "wm_titles",
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

const deleteTitle = async (id) => {
  try {
    const params = {
      TableName: "wm_titles",
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
  const response = await getTitle(event.pathParameters.id);

  console.log("Get response >> ", response);
  if (!response) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get title - ${event.pathParameters.id}`,
        errorCode: "WM_TITLE_100"
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
  const dbTitle = await getTitle(requestBody.id);

  // If title already exists in Db - do nothing
  if (dbTitle && dbTitle.Item) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: "Title already exists"
      })
    });
  }
  // Else add title to Db
  else {
    console.log("Add title request - ", requestBody);
    const status = await addTitle(requestBody);

    // If title added give 201 else give a 500
    if (status) {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          message: `Sucessfully added title - ${requestBody.title}`
        })
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to add title - ${requestBody.title}`,
          errorCode: "WM_TITLE_101"
        })
      });
    }
  }
};

module.exports.update = async (event, context, callback) => {
  const dbTitle = await getTitle(event.pathParameters.id);

  // Update only if exists
  if (dbTitle && dbTitle.Item) {
    const requestBody = JSON.parse(event.body);
    const status = await updateTitle(event.pathParameters.id, requestBody);
    // If title added give 201 else give a 500
    if (status) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully updated title - ${requestBody.title}`
        })
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to update title - ${requestBody.title}`,
          errorCode: "WM_TITLE_102"
        })
      });
    }

  } else {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid title",
        errorCode: "WM_TITLE_103"
      })
    });
  }
};

module.exports.delete = async (event, context, callback) => {
  const response = await getTitle(event.pathParameters.id);

  if (response && response.Item) {
    const status = await deleteTitle(event.pathParameters.id);

    if (status) {
      callback(null, {
        statusCode: 200
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to delete title`,
          errorCode: "WM_TITLE_104"
        })
      });
    }
  }

  callback(null, {
    statusCode: 400,
    body: JSON.stringify({
      message: `Invalid title`,
      errorCode: "WM_TITLE_105"
    })
  });
};
