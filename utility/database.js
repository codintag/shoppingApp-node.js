const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://codintag:codintag@cluster0-yuiws.mongodb.net/node-app?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
        .then(client => {
            console.log('Connected to mongodb');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getdb = () => {
    if(_db) {
        return _db;
    }

    console.log('No Database');
}

exports.mongoConnect = mongoConnect;

exports.getdb = getdb;