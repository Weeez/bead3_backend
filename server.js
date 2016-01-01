var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

var server = express();
// Új tároló (alapértelmezetten memóriában tárol)
var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]   
}); 

store.defineType('subject', {
    subject_name:    {type: String},
    subject_code:    {type: String},
    subject_size:    {type: Number},
    subject_location: {type: String},
    subject_teacher: {type: String}
});

store.defineType('user', {
    user_neptun:    {type: String},
    user_password:    {type: String},
    user_role:    {type: String},
});

// Minden URL-ről engedélyezzük a hozzáférést az API-hoz
// Mindenképp a `server.use(fortune.net.http(store));` sor elé kerüljön
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Express middleware
server.use(fortune.net.http(store));

var port = process.env.PORT || 8080;
// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz    
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});