# Titles API
API to manage title collection

## Architecture Diagram

[Wiki](https://github.com/dotnetkolz/wm-movies-api/wiki/Arch-Diagram)

## Installation

To run this application you will need to install [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Please follow installation instruction in the [Link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

## Clone

Run below command to clone the repo

```bash
git clone https://github.com/dotnetkolz/wm-movies-api.git
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

```bash
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

```bash
    capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM"
```

The updated `samconfig.toml` should look like below

```bash
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

## Usage

This api exposes 4 endpoints, these endpoints will be provided after the deployment id complete.

All APIs need below authorization header to work

`authorization: Basic =random-creds`


### GET - /titles/{id}

https://{apigateway}/Prod/titles/23adc

Response -

`
{
  "id": "23adc",
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
`

### POST (Add) - /titles

https://{apigateway}/Prod/titles

Request -

`
{
  "id": "23adc",
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
`

Response -

`
{
  "message": "Sucessfully added title - Terminator 2"
}
`

### PUT (Update) - /titles/{id}

https://{apigateway}/Prod/titles/23adc

Request -

`
{
  "releaseDate": "2012-01-12",
  "genres": [
    "Action",
    "Si-fi"
  ],
  "title": "Terminator 2"
}
`

Response -

`
{
  "message": "Sucessfully updated title - Terminator 2"
}
`

### DELETE - /titles/{id}

https://{apigateway}/Prod/titles/23adc

Response - 200
