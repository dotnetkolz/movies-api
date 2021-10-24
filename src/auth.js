'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Gets credentials from dynamo
 * @param {string} type 
 * @returns credentials
 */
const getCreds = async (type) => {
    try {
        const params = {
            TableName: process.env.AUTH_TABLE,
            Key: {
                key: type,
            },
        };
        return await dynamoDb.get(params).promise();
    } catch (ex) {
        console.log("Get Auth Exception > ", ex);
    }

    return false;
}

/**
 * Initialize Credentials
 */
const setInitialCreds = async () => {
    try {
        const creds = await getCreds("basic");

        if(!creds || !creds.Item) {
            const params = {
                TableName: process.env.AUTH_TABLE,
                Item: {
                  key: "basic",
                  value: "=random-creds"
                },
              };
          
              const result = await dynamoDb.put(params).promise();
        }

      } catch (ex) {
        console.log("Add Auth Exception > ", ex);
      }

}

/**
 * Build lambda auth success policy
 * @param {*} event 
 * @returns Policy
 */
const buildAllowAuthResponse = (event) => {
    let tmp = event.methodArn.split(":");

    const apiGatewayArn = tmp[5].split("/");
    const awsAccountId = tmp[4];
    const awsRegion = tmp[3];
    const restApiId = apiGatewayArn[0];
    const stage = apiGatewayArn[1];

    const apiArn =
        "arn:aws:execute-api:" +
        awsRegion +
        ":" +
        awsAccountId +
        ":" +
        restApiId +
        "/" +
        stage +
        "/*/*";

    const policy = {
        principalId: "basic",
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Allow",
                    Resource: [apiArn]
                }
            ]
        }
    };

    return policy;
}

/**
 * Authorizer lambda handler
 * This lambda only does plain text validation for this excersize
 * This can be replaced with Base64 basic authorizer, Okta authorizer or Azure authorizer
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 * @returns 
 */
module.exports.handler = async (event, context, callback) => {
    // Set up initial credentials 
    // ideally this will be stored in secret manager and will be rotated regularly
    // this is only for this exercize to validate request
    await setInitialCreds();

    const authHeader = event.authorizationToken;
    if (!authHeader) return callback("Unauthorized");

    const encodedCreds = authHeader.split(" ")[1];
    console.log("Credentials > ", encodedCreds);

    const dbCreds = await getCreds("basic");

    if (!dbCreds.Item || !dbCreds.Item.value) {
        console.log('Basic auth credentials not found');
    } else {
        console.log('Auth passed');
    }

    if (encodedCreds !== dbCreds.Item.value) {
        callback("Unauthorized");
    }

    const authResponse = buildAllowAuthResponse(event);
    callback(null, authResponse);
};