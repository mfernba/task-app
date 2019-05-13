const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post( '/users', async (req, resp) => {

    try
    {
        const user = new User( req.body );
        await user.save();

        const token = await user.generateAuthToken();

        resp.status( 201 ).send( { user, token } );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

router.post( '/users/login', async (req, resp) => {

    try
    {
        const { email, password } = req.body;

        const user = await User.findByCredentials( email, password );
        const token = await user.generateAuthToken();

        resp.send( { user, token } );

    } catch ( e ) {

        resp.status( 400 ).send( e );

    }

});

router.post( '/users/logout', auth, async (req, resp) => {

    try
    {
        req.user.tokens = req.user.tokens.filter( ( token ) => token.token !== req.token );
        await req.user.save();

        resp.status( 200 ).send();

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.post( '/users/logoutAll', auth, async (req, resp) => {

    try
    {
        req.user.tokens = [];
        await req.user.save();

        resp.status( 200 ).send();

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.get( '/users/me', auth, async (req, resp) => {

    resp.status( 200 ).send( req.user );

});

router.get( '/users/:id', auth, async (req, resp) => {

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

router.patch( '/users/:id', auth, async ( req, resp ) => {

    try {

        const updates = Object.keys( req.body );
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every( ( el ) => allowedUpdates.includes( el ) );

        if ( isValidOperation === false) {

            resp.status( 400 ).send( { error: 'Invalid updates' } );

        } else {

            const user = await User.findById( { _id: req.params.id } );
            updates.forEach( (el) => user[ el ] = req.body[ el ] );
            await user.save();

            //const user = await User.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true, runValidators: true } );

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

router.delete( '/users/:id', auth, async ( req, resp ) => {

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
