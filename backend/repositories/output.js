var assert = require('assert');
var fs = require('fs');
var mongodb = require('mongodb');

var uri = 'mongodb://localhost:27017/test';

mongodb.MongoClient.connect(uri, function(error, db) {
  assert.ifError(error);

 var bucket = new mongodb.GridFSBucket(db); 

bucket.openDownloadStreamByName('meistersinger.mp3').
  pipe(fs.createWriteStream('./output.mp3')).
  on('error', function(error) {
    assert.ifError(error);
  }).
  on('finish', function() {
    console.log('done!');
    process.exit(0);
  });
});
