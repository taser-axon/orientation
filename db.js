
var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'ec2-54-227-246-11.compute-1.amazonaws.com',
    user     : 'yelyylmazxznkv',
    password : '0ig08_zaOxBV7PHJieit4Tyn8M',
    database : 'd22tl1o6db70b9',
    charset  : 'utf8',
    port	 : 5432,
    ssl		 : true
  }
});

var bookshelf = require('bookshelf')(knex);


module.exports = bookshelf;