# Meower

**Meower** is an application build in Vue Js and Express Js. This application is a dead simple social media that allow you to share what's in your mind

## Getting Started

You can run this application on your server by clone to [https://github.com/titanabrian/meower-backend.git](https://github.com/titanabrian/meower-backend.git) for the backend service and [https://github.com/titanabrian/meower-frontend.git](https://github.com/titanabrian/meower-frontend.git) for the frontend

### Prerequisites

The things that you need to install before running this application
*   node v10.17.0 or latest
*   npm 6.13.* or latest
*   mongodb 4.2.3 or latest

Create these following databases. Required at least one Database. You can make 3 Database for each environment which is very recomended. 
* Database for **Development** Environment
* Database for **Testing** Environment
* Database for **Production** Environment

### Installing The Backend

You have to clone to this project **this repository for backend**

```
$ git clone https://github.com/titanabrian/meower-backend.git
```

Move to your application directory

```
$ cd meower-backend
```
Create your own .env file that allows you to manage your application environment variable. You can copy from .env-example and change the value

```
PORT=4000
BASE_URL=http://localhost:4000/
MONGO_DEV_URI=${YOUR_MONGO_DB_CLIENT_URI_FOR_DEVELOPMENT}
MONGO_TEST_URI=${YOUR_MONGO_DB_CLIENT_URI_FOR_TESTING}
MONGO_PROD_URI=${YOUR_MONGO_DB_CLIENT_URI_FOR_PROUCION}
TOKEN_SECRET=${YOUR_SECREET}
REFRESH_SECRET=${YOUR_SECREET}
```

Install dependencies

```
$ npm install
```

## Running The Backend
** Note : You can't run all the **environments** at the same time on the same machine 
### Development Environment
Run folowing command and open to your browser at http://localhost:${YOUR_APPLICATION_PORT}
```
$ npm run dev
```

If you want to run development environment and reset the database, you can do following command
```
$ npm run dev:reset
```

### Testing Environment
You have to run server for testing environment.
```
$ npm run test:run-server
```
After that you have to open **new terminal** and navigate to ${YOUR_APPLICATION_DIRECTORY} and perform unit testing by running following command
```
$ npm run test:run-test
```

### Production Environment
Run the following command
```
$ npm run prod
```

## Running The Frontend
See how to run frontend application here [documentation](https://github.com/titanabrian/meower-frontend.git)

## Authors

* **titanabrian**
