var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongodb connection is open!');
});

module.exports = db;





      // link.increments('id').primary();
      // link.string('url', 255);
      // link.string('baseUrl', 255);
      // link.string('code', 100);
      // link.string('title', 255);
      // link.integer('visits');
      // link.timestamps();
