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

app.post( '/tasks', (req, resp) => {

    const task = new Task( req.body );

    task.save().then( ( task ) => {

        resp.status( 201 ).send( task );

    }).catch( ( error ) => {

        resp.status( 400 ).send( error );

    });

});

app.get( '/tasks', (req, resp) => {

    Task.find({}).then( ( task ) => {

        resp.status( 200 ).send( task );

    }).catch( ( error ) => {

        resp.status( 500 ).send( error );

    });

});

app.get( '/tasks/:id', (req, resp) => {

    Task.findById( req.params.id ).then( ( task ) => {

        if ( !task ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( task );

        }

    }).catch( ( error ) => {

        resp.status( 500 ).send( error );

    });

});

app.listen( port, () => {

    console.log( 'Server is up on port ' + port );

});

