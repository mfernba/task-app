// MongoDB CRUD

const { MongoClient, ObjectID } = require('mongodb');

const connectioURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect( connectioURL, { useNewUrlParser: true }, ( error, client ) => {

    if ( error ) {

        return console.log( 'unable to connect to database' );
    }

    const db = client.db( databaseName );

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5cd2afc11fd3f803db794494")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then( ( result ) => {

    //     console.log( result );

    // }).catch( ( error ) => {

    //     console.log( error );

    // });

    // db.collection('tasks').updateMany({
    //     status: false
    // }, {
    //     $set: {
    //         status: true
    //     }
    // }).then( ( result ) => {

    //     console.log( result );

    // }).catch( ( error ) => {

    //     console.log( error );

    // });

    // db.collection('users').deleteMany({
    //     age: 28
    // }).then( ( result ) => {

    //     console.log( result );

    // }).catch( ( error ) => {

    //     console.log( error );

    // });

    db.collection('tasks').deleteOne({
        description: 'Buy bread'
    }).then( ( result ) => {

        console.log( result );

    }).catch( ( error ) => {

        console.log( error );

    });
    
});