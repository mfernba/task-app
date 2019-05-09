require('../src/db/mongoose');
const Task = require('../src/models/task');

// 5cd3f11c60057a04ef34816e
/*
Task.findByIdAndRemove('5cd3edd7ffc91604c5560817').then( ( task ) => {

    console.log( task );
    return Task.countDocuments( { completed: false } );

}).then( (result) => {

    console.log( result );

}).catch( ( error ) => {

    console.log( error );

});
*/

const deleteTaskAndCount = async ( id ) => {

    await Task.findByIdAndRemove( id );
    const count = await Task.countDocuments( { completed: false } );

    return count;

};

deleteTaskAndCount( '5cd3fd8891ccc1070779e6a4' ).then( (count) => {

    console.log( count );

}).catch( ( error ) => {

    console.log( error );

});