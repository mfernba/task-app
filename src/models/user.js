const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate( value ) {

            if ( value.length == 0)
                throw new Error( 'Invalid name' );
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate( value ) {

            if (validator.isEmail( value) == false)
                throw new Error( 'Invalid email' );

        }
    },
    age: {
        type: Number,
        default: 0,
        validate( value ) {

            if ( value < 0 )
                throw new Error( 'Age must be a positive number' );

        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate( value ) {

            if ( value.toLowerCase().includes( 'password' ) == true )
                throw new Error( 'Invalid password' );

        }
    },
});

userSchema.pre('save', async function ( next ) {

    const user = this;

    if ( user.isModified('password') == true) {

        user.password = await bcrypt.hash( user.password, 8);

    }

    next();

});

const User = mongoose.model( 'User', userSchema);

module.exports = User;