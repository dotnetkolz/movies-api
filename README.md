# Title API
API to manage title collection

## Architecture

This repo uses CloudFormation with AWS SAM to build and deploy Node API

Follow [Wiki](https://github.com/dotnetkolz/wm-title-api/wiki/Arch-Diagram) for Infrastructure/Architecture diagram.

## Cloud Formation

Check the [Wiki](https://github.com/dotnetkolz/wm-title-api/wiki/Cloud-Formation) to understand every resource in `template.yaml` file.

## Installation

To run this application you will need to install [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Please follow installation instruction in the [Link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Configuring AWS Identity and Access Management (IAM) permissions.

## Clone

Run below command to clone the repo

```bash
git clone https://github.com/dotnetkolz/wm-title-api.git
```

## Build

Run SAM Build to build the project

```bash
cd src
sam build
```

## Deploy

Run sam deploy in guided mode

```bash
sam deploy --guided --template-file template.yaml
```

This will create the initial deployment setup. Follow the instructions as below.

```
	Looking for config file [samconfig.toml] :  Found
	Reading default arguments  :  Success

	Setting default arguments for 'sam deploy'
	=========================================
	Stack Name [sam-app]: wm-title-api
	AWS Region [us-east-1]:
	#Shows you resources changes to be deployed and require a 'Y' to initiate deploy
	Confirm changes before deploy [y/N]: y
	#SAM needs permission to be able to create roles to connect to the resources in your template
	Allow SAM CLI IAM role creation [Y/n]: y
	Save arguments to configuration file [Y/n]: y
	SAM configuration file [samconfig.toml]: samconfig.toml
	SAM configuration environment [default]: prod
```

This will trigger a update on `samconfig.toml` file. Make sure to update `capabilities` as below

```
    capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM"
```

The updated `samconfig.toml` should look like below

```t
    version = 0.1

    [prod.deploy.parameters]
    template_file = "template.yaml"
    stack_name = "wm-title-api"
    s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-hdc9z77js1ct"
    s3_prefix = "wm-title-api"
    region = "us-east-1"
    confirm_changeset = true
    capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM"
    image_repositories = []
```

For all the subsequent deployment run below commands

```bash
    sam build
    sam deploy --config-env prod
```

## REST API Endpoints

This api exposes 4 endpoints, these endpoints will be provided after the deployment is complete.

All APIs need below authorization header to work

`authorization: Basic =random-creds`


### GET - /titles/{id}

URL - https://{restapiid}.execute-api.us-east-1.amazonaws.com/Prod/titles/23adc

**Response -**

**200**

```json
{
  "id": "23adc",
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
```
**204**

Returned when id is not found. Depending on the use case we can either return 400 or 404 as well.

**500**

```json
{
  "message": "Unable to get title - T2",
  "errorCode": "WM_TITLE_100"
}
```

### POST (Add) - /titles

URL - https://{restapiid}.execute-api.us-east-1.amazonaws.com/Prod/titles

**Request -**

```json
{
  "id": "23adc",
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
```

**Response -**

**201**

```json
{
  "message": "Sucessfully added title - Terminator 2"
}
```

**200**

```json
{
  "message": "Title already exists"
}
```

**500**

```json
{
  "message": "Unable to add title - T2",
  "errorCode": "WM_TITLE_101"
}
```

### PUT (Update) - /titles/{id}

URL - https://{restapiid}.execute-api.us-east-1.amazonaws.com/Prod/titles/23adc

**Request -**

```json
{
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
```

**Response -**

**200**

```json
{
  "message": "Sucessfully updated title - Terminator 2"
}
```

**500**

```json
{
  "message": "Unable to update title - T2",
  "errorCode": "WM_TITLE_102"
}
```

**400**

```json
{
  "message": "Invalid title",
  "errorCode": "WM_TITLE_103"
}
```

### DELETE - /titles/{id}

URL - https://{restapiid}.execute-api.us-east-1.amazonaws.com/Prod/titles/23adc

**Response -**

**200**

**500**

```json
{
  "message": "Unable to delete title",
  "errorCode": "WM_TITLE_104"
}
```

**400**

```json
{
  "message": "Invalid title",
  "errorCode": "WM_TITLE_105"
}
```
