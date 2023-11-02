#!/usr/bin/node
const express = require('express');
const http = require('node:http');

const { users, courses, usersCourses, authUser } = require('./utils');

/* initialize express app */
const app = express();

/** 
 * create http server
 * Although, seems like reinventing the wheel, it serves like
 * a reminder when creating https servers
 */
const server = http.createServer(app);

/* Regex for query parameters */
const checkDigit = /^[0-9]$/;

/* middleware to verify incoming JSON requests */
app.use(express.json({
    verify: async (req, res, buffer, encoding) => {
        try {
            await JSON.parse(buffer);
        } catch (error) {
            return res.status(400).json({ message: 'Not a JSON' });
        }
    }
}));


/* user authentication route */
app.post('/api/users', (req, res) => {
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
});


/* course enrollment route */
app.post('/api/users/:user_id/courses/:course_id', (req, res) => {
    let { user_id, course_id } = req.params;

    // validate query parameters
    if (!checkDigit.test(user_id) || !checkDigit.test(course_id)) {
        return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const [userId, courseId] = [parseInt(user_id, 10), parseInt(course_id, 10)];

    // check user status
    const { id, message, statusCode } = authUser({ userId });
    if (!id) {
        return res.status(statusCode).json({ message });
    }

    // get course
    for (const course of courses) {
        if (course.id === courseId) {
            // connect course with user and save to datastore
            const newEnrollment = {
                courseId,
                userId,
                courseName: course.name,
                coursePrice: course.price
            }
            usersCourses.push(newEnrollment);

            return res.status(201).json({ message: 'enrollment successful', ...newEnrollment });
        }
    }
});


/* Endpoint for user information */
app.get('/api/users/:user_id', (req, res) => {
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
})

/* set listening port for express */
app.set('port', 3000);


server.listen(3000);
server.on('listening', () => {
    const port = server.address().port;
    console.log(`Server listening on port ${port}`)
})

