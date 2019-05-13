const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        unique: true,
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.statics.findByCredentials = async function ( email, password ) {

    const user = await User.findOne( { email } );

    if ( !user ) {

        throw new Error( 'unable to log in' );

    } else {

        const isMatch = await bcrypt.compare( password, user.password );

        if ( !isMatch ) {

            throw new Error( 'unable to log in' );

        }

        return user;

    }
};

userSchema.methods.generateAuthToken = async function() {

    const user = this;
    const secretTokenPhrase = 'thisismynewcourse';
    const token = jwt.sign( { _id: user._id.toString() }, secretTokenPhrase, { expiresIn: '1 day' } );

    user.tokens = user.tokens.concat( { token } );
    await user.save();

    return token;

};

userSchema.methods.toJSON = function () { // Method use to hide data when converted to output to client...

    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

};

// Hash the plain text password before saving...

userSchema.pre('save', async function ( next ) {

    const user = this;

    if ( user.isModified('password') == true) {

        user.password = await bcrypt.hash( user.password, 8);

    }

    next();

});

const User = mongoose.model( 'User', userSchema);

module.exports = User;