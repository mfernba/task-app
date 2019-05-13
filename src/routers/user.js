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

router.patch( '/users/me', auth, async ( req, resp ) => {

    try {

        const updates = Object.keys( req.body );
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every( ( el ) => allowedUpdates.includes( el ) );

        if ( isValidOperation === false) {

            resp.status( 400 ).send( { error: 'Invalid updates' } );

        } else {

            updates.forEach( (el) => req.user[ el ] = req.body[ el ] );
            await req.user.save();

           resp.status( 200 ).send( req.user );

        }

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});

router.delete( '/users/me', auth, async ( req, resp ) => {

    try {

        req.user.remove();
        resp.status( 200 ).send( req.user );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }

});


module.exports = router;
