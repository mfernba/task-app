const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

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

const avatarUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter( req, file, cb ) {

        if ( /\.(jpg|jpeg|png)$/.test( file.originalname ) === false ) {

            return cb( new Error( 'File must be a jpg, jpeg or png' ) );
        }

        cb( undefined, true );

    }
});

router.post('/users/me/avatar', auth, avatarUpload.single('avatar'), async ( req, resp ) => {

    try {

        req.user.avatar = req.file.buffer
        await req.user.save();

        resp.status( 200 ).send( req.user );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }
    
}, ( error, req, resp, next) => {

    resp.status( 400 ).send( { error: error.message } );

});

router.delete('/users/me/avatar', auth, async ( req, resp ) => {

    try {

        req.user.avatar = undefined;
        await req.user.save();

        resp.status( 200 ).send( req.user );

    } catch ( e ) {

        resp.status( 500 ).send( e );

    }
    
});

router.get('/users/:id/avatar', async ( req, resp ) => {

    try {

        const user = await User.findById( req.params.id );

        if ( user === undefined || user.avatar === undefined ) {

            throw new Error();

        }

        resp.status( 200 ).send( req.user );

    } catch ( e ) {

        resp.status( 404 ).send( e );

    }
    
});

module.exports = router;
