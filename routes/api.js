/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require("dotenv").config()
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
function db_connect(callback) {
  MongoClient.connect(process.env.DB, function(err, db) {
    if(err) console.error(err);
    callback(db.collection("booklist"))
  })
}

module.exports = function (app) {

  app.route('/api/books')
    .get( function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      db_connect((db) => {
        db.find().toArray((err, books) => {
          if(err) console.error(err);
          res.json(books);
        })
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including at least _id and title
      if(title && title.length > 0) {
         db_connect((db) => {
        db.findOne({title: title}, function(err, book) {
          if(err) {
            console.error(err);
            res.status(500).send(err)
          }
          else if(book) {
            res.send(book);
              
          } else if(!book) {
            db.insert({title, comments: [], commentcount: 0}, function(err, book) {
              if(err) {
                console.error((err))
                res.status(500).send("could not add book data")
              }
              else res.send(book.ops[0]);
              
            })
          }
        })
      })
      } else {
        res.status(500).send("cannot find title in request body");
      }
     
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      db_connect((db)=>{
        db.remove({}, function(err, result) {
          if(err) console.error(err);
          else {
            res.send("complete delete successful")
          }
           
        })
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      if(req.params.id.length == 24) {
        var query = {_id:  new ObjectId(req.params.id) };
         db_connect((db) => {
        db.findOne(query, (err, books) => {
          if(err) console.error(err);
          res.send(books ? books : `cannot find book data with provided _id`);
         
        })
      })
      }  else {
        res.status(500).send("Invalid _id");
      }
      
   })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      
      if(bookid.length == 24 && comment) {
         var query = {_id: new ObjectId(req.params.id) };
         db_connect((collection) => {
         collection.findAndModify(query,
         [],
         {"$push": {"comments": comment}, 
         "$inc": {"commentcount": 1}},
         {upsert: false, new:false},
         function(err, result) {
           if(err) {
            console.error(err);
            res.send("error adding comment to book data")
           }
           
           res.send(result.value ? result.value : "could not update book data");
           
         })
      })
      } else {
        res.status(500).send("Invalid _id")
      }
     
     
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(bookid.length == 24) {
        db_connect((db)=>{
        db.remove({_id: ObjectId(bookid)}, function(err, result) {
          if(err) {
            console.error(err)
            res.status(500).send(err);
          }
          else {
            res.send("complete delete successful")
          }
           
        })
      })
      } else {
        res.status(500).send("Invalid _id")
      }
      
    });
  
};
