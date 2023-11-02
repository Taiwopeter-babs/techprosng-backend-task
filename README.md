# Backend Tasks

Two tasks were undertaken in this project:
- Database optimization: Documentation for the proposed database optimization strategy can be found here: [OPTIMIZATION.md](https://github.com/Taiwopeter-babs/techprosng-backend-task/blob/c37e0ae9b1c37af9024173ad896aadc673831254/OPTIMIZATION.md)
- RESTful API Development: The documentation of the API is detailed below.

## RESTful API
API endpoints were designed for three use cases:
- User authentication
- Course enrollment
- User information retrieval

Express, a JavaScript web framework, was used with the Node.js (v20.8.1) runtime environment to develop and test the endpoints. The data used/generated is not persisted in any database or json file as it is arbitrary, and is used for quick prototyping. See [here](https://github.com/Taiwopeter-babs/techprosng-backend-task/blob/070bb90ef44cd1df32027d1bc66df487e573cf67/api/utils/index.js)

### User Authentication

**`POST /api/users`**


The endpoint validates a user through the email and password in the request body sent as JSON:
```json
{"email": "useremail@email", "password": "testpass"}
```
#### Expected response
- If a user is not found, a 404 status code is returned with a JSON message:
```json
{"message": "Not found"}
```
- If a user is found, but a wrong password is given, a 400 status code is returned with a JSON:
```json
{"message": "Wrong password"}
```

- if a user is found, and the password is validated, a 200 status code is returned with a JSON
which contains the id of the user.
```json
{"id":"userId", "message":"authenticated"}
```

### Course Enrollment

**`POST /api/users/:user_id/courses/:course_id`**


The endpoint registers a course to a user by linking the `user_id` and `course_id` in a defined `usersCourses` array. See [here](https://github.com/Taiwopeter-babs/techprosng-backend-task/blob/070bb90ef44cd1df32027d1bc66df487e573cf67/api/utils/index.js)

### Expected response
```json
{
  "message":"enrollment successful",
  "courseId":"course_id",
  "userId":"user_id",
  "courseName":"name of course",
  "coursePrice":1000 // An example price
}
```

### User information retrieval

**`GET /api/users/:user_id`**


- If a user is not found, a 404 status code is returned with a JSON message:
```json
{"message": "Not found"}
```
- if a user with the `user_id` exists, the user data is returned without the password field:
```json
{
  "id":3,
  "email":"userthree@email",
  "name":"Precious Alle"
}
```

## Usage
To run this application, simply clone the repository
```
$ git clone https://github.com/Taiwopeter-babs/techprosng-backend-task.git
```
Install packages
```
$ npm install
```
Run server
```
$ npm run start
```
On another terminal

- Course enrollment
```
$ curl -XPOST localhost:3000/api/users/4/courses/3; echo ""

{"message":"enrollment successful","courseId":3,"userId":4,"courseName":"cloud and devops engineering","coursePrice":1000}
```

- User information retrieval
```
$ curl -XGET localhost:3000/api/users/3; echo ""

{"id":3,"email":"userthree@email","name":"Precious Alle"}
```

- User authentication
```
$ curl -XPOST -d '{"email": "userone@email", "password": "password1"}' -H 'content-type: application/json' localhost:3000/api/users; echo ""

{"id":1,"message":"authenticated"}
```

### Note
 - node.js runtime version - v20.8.1 was used for development 