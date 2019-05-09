const express = require('express');
const User = require("../models/user");

const router = new express.Router();

router.post( '/users', async (req, resp) => {

    const user = new User( req.body );

    try
    {
        await user.save();
        resp.status( 201 ).send( user );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

router.get( '/users', async (req, resp) => {

    try {

        const users = await User.find({});
        resp.status( 200 ).send( users );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.get( '/users/:id', async (req, resp) => {

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

router.patch( '/users/:id', async ( req, resp ) => {

    try {

        const updates = Object.keys( req.body );
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every( ( el ) => allowedUpdates.includes( el ) );

        if ( isValidOperation === false) {

            resp.status( 400 ).send( { error: 'Invalid updates' } );

        } else {

            const user = await User.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true, runValidators: true } );

            if ( !user ) {

                resp.status( 404 ).send();

            } else {

                resp.status( 200 ).send( user );

            }

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.delete( '/users/:id', async ( req, resp ) => {

    try {

        const user = await User.findByIdAndDelete( { _id: req.params.id });

        if ( !user ) {

            resp.status( 404 ).send();

        } else {

            resp.status( 200 ).send( user );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});


module.exports = router;
