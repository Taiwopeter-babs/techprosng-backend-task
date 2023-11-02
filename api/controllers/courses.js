const express = require('express');
const { checkDigit, courses, usersCourses, authUser } = require('../utils');

const courseRouter = express.Router();

/* course enrollment route */
function enrolCourse(req, res) {
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
};

/* ROUTES */
courseRouter.post('/users/:user_id/courses/:course_id', enrolCourse);

module.exports = courseRouter;