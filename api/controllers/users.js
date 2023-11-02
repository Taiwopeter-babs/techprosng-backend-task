const express = require('express');
const { authUser, checkDigit } = require('../utils');

const usersRouter = express.Router();

function validateUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email absent' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password absent' });
    }

    const { statusCode, message, id } = authUser({ email, password });

    if (statusCode !== 200) {
        return res.status(statusCode).json({ message: message });
    }
    return res.status(statusCode).json({ id: id, message: message });
}

function getUserData(req, res) {

    const user_id = req.params.user_id;
    if (!checkDigit.test(user_id)) {
        return res.status(400).json({ message: 'Invalid query parameter' });
    }

    const { message, statusCode, ...userData } = authUser({ userId: parseInt(user_id, 10) });
    if (statusCode) {
        res.status(statusCode).json({ message });
    }
    // remove user password from response
    delete userData.password;
    return res.status(200).json({ ...userData });
}


/* Routes */
usersRouter.post('/users', validateUser);
usersRouter.get('/users/:user_id', getUserData);

module.exports = usersRouter;