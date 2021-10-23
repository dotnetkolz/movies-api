'use strict';

module.exports.test = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Test executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

};

module.exports.add = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Add executed successfully!'
    }),
  };

  callback(null, response);

};

module.exports.get = (event, context, callback) => {

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Get executed successfully!'
      }),
    };
  
    callback(null, response);
};