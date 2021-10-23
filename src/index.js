'use strict';

module.exports.add = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Add executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

};

module.exports.get = (event, context, callback) => {

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Get executed successfully!',
        input: event,
      }),
    };
  
    callback(null, response);
};