const express = require('express');
const Task = require("../models/task");
const auth = require('../middleware/auth');

const router = new express.Router();

router.post( '/tasks', auth, async (req, resp) => {

    try {

        const task = new Task( { ...req.body, owner: req.user._id } );

        await task.save();
        resp.status( 201 ).send( task );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

router.get( '/tasks', auth, async (req, resp) => {

    try {

        await req.user.populate('tasks').execPopulate();
        resp.status( 200 ).send( req.user.tasks );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.get( '/tasks/:id', auth, async (req, resp) => {

    try {

        const task = await Task.findOne( { _id: req.params.id, owner: req.user._id });
        resp.status( 200 ).send( task );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.patch( '/tasks/:id', auth, async (req, resp) => {

    try {

        const updates = Object.keys( req.body );
        const allowedUpdates = ['description', 'completed'];
        const isValidOperation = updates.every( ( el ) => allowedUpdates.includes( el ) );

        if ( isValidOperation === false ) {

            resp.status( 400 ).send( { error: 'Invalid updates' } );

        } else {

            const task = await Task.findOne( { _id: req.params.id, owner: req.user._id });

            if ( !task ) {

                resp.status( 404 ).send();

            } else {

                updates.forEach( (el) => task[ el ] = req.body[ el ] );
                await task.save();
    
                resp.status( 200 ).send( task );

            }
        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.delete( '/tasks/:id', auth, async ( req, resp ) => {

    try {

        const task = await Task.findOneAndDelete( { _id: req.params.id, owner: req.user._id });

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