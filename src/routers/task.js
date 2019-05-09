const express = require('express');
const Task = require("../models/task");

const router = new express.Router();

router.post( '/tasks', async (req, resp) => {

    try {

        const task = new Task( req.body );

        await task.save();
        resp.status( 201 ).send( task );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

router.get( '/tasks', async (req, resp) => {

    try {

        const tasks = await Task.find({});
        resp.status( 200 ).send( tasks );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.get( '/tasks/:id', async (req, resp) => {

    try {

        const updates = Object.keys( req.body );
        const allowedUpdates = ['description', 'completed'];
        const isValidOperation = updates.every( ( el ) => allowedUpdates.includes( el ) );

        if ( isValidOperation === false ) {

            resp.status( 400 ).send( { error: 'Invalid updates' } );

        } else {

            const task = await Task.findById( req.params.id );

            if ( !task ) {

                resp.status( 404 ).send();

            } else {

                resp.status( 200 ).send( task );

            }
        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.patch( '/tasks/:id', async ( req, resp ) => {

    try {

        const task = await Task.findById( { _id: req.params.id } );
        updates.forEach( (el) => user[ el ] = req.body[ el ] );
        await task.save();

        //const task = await Task.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true, runValidators: true } );

        if ( !task ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( task );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.delete( '/tasks/:id', async ( req, resp ) => {

    try {

        const task = await Task.findByIdAndDelete( { _id: req.params.id });

        if ( !task ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( task );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

module.exports = router;