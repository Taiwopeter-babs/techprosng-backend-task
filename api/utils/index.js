const users = [
    { id: 1, email: 'userone@email', password: 'password1', name: 'Zainab Aliu' },
    { id: 2, email: 'usertwo@email', password: 'password2', name: 'Kehinde Samuel' },
    { id: 3, email: 'userthree@email', password: 'password3', name: 'Precious Alle' },
    { id: 4, email: 'userfour@email', password: 'password4', name: 'Muhammed Nketiah' },
    { id: 5, email: 'userfive@email', password: 'password5', name: 'Justice Emeka' }
];


const courses = [
    { id: 1, name: 'advanced organic chemistry', price: 500 },
    { id: 2, name: 'social media management', price: 400 },
    { id: 3, name: 'cloud and devops engineering', price: 1000 }
];

// an object of list of users and registered courses
const usersCourses = []

/**
 * 
 * @param {*} param0 The function takes an object with email, password, and
 * userId as properties. If authenticated with userId and a user is found,
 * only the user data is returned, otherwise appropriate status code and
 * message are returned in the object.
 * @returns 
 */
function authUser({ email, password, userId }) {

    // authenticate with id and return user data
    if (userId) {
        for (const user of users) {
            if (user.id === userId) {
                const { id, ...data } = user;
                return { id: id, ...data };
            }
        }
    }

    for (const user of users) {
        if (user.email === email) {
            if (user.password === password) {
                return { statusCode: 200, id: user.id, message: 'authenticated' };
            } else {
                return { statusCode: 400, message: 'Wrong password' };
            }
        }
    }
    return { statusCode: 404, message: 'Not found' };
}


module.exports = {
    users, courses, usersCourses, authUser
}