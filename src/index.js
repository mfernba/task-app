const express = require("express");
require("./db/mongoose"); // Connects to database
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use( express.json() );

app.post( '/users', async (req, resp) => {

    const user = new User( req.body );

    try
    {
        await user.save();
        resp.status( 201 ).send( user );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

app.get( '/users', async (req, resp) => {

    try {

        const users = await User.find({});
        resp.status( 200 ).send( users );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

app.get( '/users/:id', async (req, resp) => {

    try {

        const user = await User.findById( req.params.id );

        if ( !user ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( user );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

app.post( '/tasks', async (req, resp) => {

    try {

        const task = new Task( req.body );

        await task.save();
        resp.status( 201 ).send( task );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

app.get( '/tasks', async (req, resp) => {

    try {

        const tasks = await Task.find({});
        resp.status( 200 ).send( task );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

app.get( '/tasks/:id', async (req, resp) => {

    try {

        const task = await Task.findById( req.params.id );

        if ( !task ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( task );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

app.listen( port, () => {

    console.log( 'Server is up on port ' + port );

});
