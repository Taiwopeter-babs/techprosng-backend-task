#!/usr/bin/env node
const express = require('express');
const http = require('node:http');

const usersRouter = require('./controllers/users');
const courseRouter = require('./controllers/courses');

/* initialize express app */
const app = express();

/** 
 * create http server
 * Although, seems like reinventing the wheel, it serves like
 * a reminder when creating https servers
 */
const server = http.createServer(app);


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

// ROUTES HANDLERS
app.use('/api', usersRouter);
app.use('/api', courseRouter);

/* set listening port for express */
app.set('port', 3000);


server.listen(3000);
server.on('listening', () => {
    const port = server.address().port;
    console.log(`Server listening on port ${port}`)
})

