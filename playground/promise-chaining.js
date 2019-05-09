require('../src/db/mongoose');
const User = require('../src/models/user');

// 5cd3f11c60057a04ef34816e

/*
User.findByIdAndUpdate('5cd3eaf369f6030483cfcc97', { age: 1}).then( ( user ) => {

    console.log( user );
    return User.countDocuments( { age: 1 } );

}).then( (result) => {

    console.log( result );

}).catch( ( error ) => {

    console.log( error );

});
*/

const updateAgeAndCount = async ( id, age ) => {

    const user = await User.findByIdAndUpdate( id, { age });
    const count = await User.countDocuments( { age } );

    return count;

};

updateAgeAndCount( '5cd3f11c60057a04ef34816e', 3 ).then( ( count ) => {

    console.log( count );

}).catch( ( error ) => {

    console.log( error );

});