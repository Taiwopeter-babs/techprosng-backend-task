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

### User authentication
**`POST /api/users`**
The endpoint validates a user through the email and password in the request body sent as JSON:
```json
{"email": "useremail@email", "password": "testpass"}
```
#### Expected response
- If a user is not found, a 404 status code is returned with a message:
```json {message: "Not found"}```

