const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async ( req, resp, next ) => {

    try {

        const token = req.header( 'Authorization' ).replace( 'Bearer ', '' );
        const decoded = jwt.verify( token, 'thisismynewcourse')

        const user = await User.findOne( { _id: decoded._id , 'tokens.token': token });

        if ( !user ) {

            throw new Error( 'Invalid authentication' );

        }

        req.user = user;
        next();

    } catch ( e ) {

        resp.status( 400 ).send( {error: 'Autenthication failed'} );

    }

};

module.exports = auth;