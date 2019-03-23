/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
       
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
         
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  var test_id = "5c9680160b435f0acead047d";
  //test Id must be id present in DB.
  var MongoClient = require('mongodb').MongoClient;
  var ObjectId = require('mongodb').ObjectId;
function db_connect(callback) {
  MongoClient.connect(process.env.DB, function(err, db) {
    if(err) console.error(err);
    callback(db.collection("booklist"))
  })
}
db_connect((db) => {
  db.insert({title: "Baptism of fire", comments: [], commentcount: 0, _id: ObjectId(test_id)}, function(err, book) {
    if(err)   console.error((err))
    console.log("added test document succesfully", book)       
              
  })
})


  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
      .post('/api/books')
      .send({title: "test book title"})
      .end(function(err, res){
        assert.equal(res.status, 200, "should have status 200");
        assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body, 'title', 'Books in array should contain title');
        assert.property(res.body, '_id', 'Books in array should contain _id');
        
        done();
      });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
      .post('/api/books')
      .send({title: ""})
      .end(function(err, res){
        console.log(test_id)
        assert.equal(res.status, 500, "should have status 200");
        assert.equal(res.text, "cannot find title in request body")
        done();
      });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
         chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200, "should have status 200");
        assert.isArray(res.body, "response should be an array")
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
      .get('/api/books/111111111111111111111111')
      
      .end(function(err, res){
        assert.equal(res.status, 200, "should have status 200");
        assert.equal(res.text, "cannot find book data with provided _id")
        done();
      });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
      .get('/api/books/' + test_id)
      .end(function(err, res){
        assert.equal(res.status, 200, "should have status 200");
        assert.isObject(res.body, "response body should be an object")
        assert.property(res.body, 'commentcount', 'Book should contain commentcount');
        assert.property(res.body, 'title', 'Book should contain title');
        assert.property(res.body, '_id', 'Book should contain _id');
       
        done();
      });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         chai.request(server)
      .post('/api/books/' + test_id)
      .send({comment: "A great book about Geralt searching for Ciri"})
      .end(function(err, res){
        assert.equal(res.status, 200, "should have status 200");
        assert.isObject(res.body, "response body should be an object");
        assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body, 'title', 'Books in array should contain title');
        assert.property(res.body, '_id', 'Books in array should contain _id');
        done();
      });
      });
      
    });

  });

});
