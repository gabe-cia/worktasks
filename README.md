# SWORD Health Challenge - Worktask API
This project compreheends the SWORD Health's challenge. The project has the following premisses:

You are developing a software to account for maintenance tasks performed during a working day. This application
has two types of users (Manager, Technician).

The technician performs tasks and is only able to see, create or update his own performed tasks.

The manager can see tasks from all the technicians, delete them, and should be notified when some tech performs
a task.

A task has a summary (max: 2500 characters) and a date when it was performed, the summary from the task can
contain personal information.

### Minimum requirements
* Node 14.18.1
* Docker (if you want to run the application on a container)
* MySQL Database
* RabbitMQ queue service

### Environment variables
* **PORT**: Application port. Default: 8000
* **TOKEN_KEY**: JWT Token key to encrypt the signature. Default: 9b005a9b-7b4d-4ac9-a8f4-2c2150d10d03
* **TOKEN_EXPIRATION_TIME**: JWT Token expiration time. Default: 1h
* **PASSWORD_SECRET**: The asymmetric key to encrypt the user's password. Default 20076357-4960-4ccb-89a0-40bda5680033
* **DB_USER**: Database's username. Default root
* **DB_PASSWORD**: Database's password. Default myp@ssw0rd
* **DB_HOST**: Database's host. Default localhost
* **DB_PORT**: Database's port. Default 3306
* **DB_NAME**: Database's schema name. Default sys
* **DB_DIALECT**: Database's dialect. Default mysql
* **MQ_URL**: RabbitMQ URL. Default amqp://localhost
* **MQ_EMAIL_QUEUE**: RabbitMQ Email queue name. Default email_queue

### Setting the database
You must first build the database tables by running:
* ``npm run db-build``

After that, you can populate it you a test seed with:
* ``npm run db-populate``

You can tear it down either using the commands:
* ``npm run db-wipe``
* ``npm run db-destroy``

### Building and Running
To build the project you must simply run the command:
* ``npm install``

To run the project you should use:
* ``npm run start``

Be very carefull because the script reads the .env file in order to execute those commands, so be sure to run it on your development enviromnent only

### Integration test
There are a total of 36 integration tests written to cover all of the API cases. To run it you can simply use the command:
* ``npm run test``

### OpenAPI documentation + Postman Collection
This API is entirely documented using OpenAPI Documentation with SwaggerUI. Once the application is running you can simply check it out on your browser:
* ``https://localhost:8000/swagger-ui``

There's a Postman collection at the directory docs. Feel free to use it to perform the API calls.

### Security
This project runs entirely on HTTPS. There's a folder called ``cert`` on the directory that contains both the public and private self signed certicates. Feel free to change it.

The passwords are encypted using a HMAC/SHA256 algorithm. For the seed values the passwords are the same as the usernames.

The endpoints requires proper authentication and authorization. The authentication token can be generated on the POST /users/login endpoint.

### Docker
Feel free to get the lateste version of this application on my dockerhub repository:
* ``docker pull gabrieln/worktasksapi:1.0.0``

If you want to build an image from scratch, there's a Dockerfile on the root directory. To use it you can simply run:
* ``docker build -t your_user/worktasksapi:1.0.0 .``

To publish this image you should create a Dockerhub account and associate it to your local Docker instance. After that, you can simply run:
* ``docker push your_user/worktasksapi:1.0.0``

Para criar um novo container a partir dessa imagem basta utilizar o comando:
* ``docker run -d --name worktasks_api -p 8000:8000 gabrieln/worktasksapi:1.0.0``

If you want to build the application all at once, there's a Docker compose file on the root directory. To run it you can simply type the following command:
* ``docker-compose up -d``

### TL;DR
* ``docker-compose up -d``
* ``npm run db-build``
* ``npm run db-populate``
* ``https://localhost:8000/swagger-ui``
