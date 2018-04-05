/**
 * @author ashan dhananjaya
 */
'use strict'
const express = require('express');
const bodyParser =require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');
const MemcacheNode = require('node-couchdb-plugin-memcached');

const port = "3000";

// node-couchdb instance with default options
const couch = new NodeCouchDb();

const couchWithMemcache = new NodeCouchDb({
    cache: new MemcacheNode
});

/*// node-couchdb instance talking to external service
const couchExternal = new NodeCouchDb({
    host: 'couchdb.external.service',
    protocol: 'https',
    port: 6984
});*/

// not admin party
const couchAuth = new NodeCouchDb({
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});
const dbName = 'test_suite_db';
const view_url = 'http://localhost:5984/test_suite_db/_all_docs';

couch.listDatabases().then(function (dbs) {
    console.log(dbs);

});
const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/',function (req,res) {
    couch.get(dbName,view_url).then(
        function (data,headers,status) {
            console.info(data);
            res.render('index',{
                "data":data
            })
        },
        function (error) {
            res.send(error)
        }
    );
    //res.render('index');
    });

app.listen(port,function () {
    console.log("Server Started on port: " + port);

})