const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Book = require('../models/book');
 
// Handle incoming GET requests to /books
router.get('/',(req,res,next) => {
       Book.find()
       .select('author title language county year _id')
       .exec()
       .then( docs => {
           const response = {
               count: docs.length, 
               books: docs.map(doc => {
                   return {
                       author: doc.author,
                       title: doc.title,
                       language: doc.language,
                       county:doc.county,
                       year: doc.year,
                       _id: doc._id,
                       request: {
                           type: 'GET',
                           url:'http://localhost:6002/books/' + doc._id
                       }
                   }
               })
           };
          // if(docs.length >=0) {
            res.status(200).json(response);
        //   } else {
         //      res.status(404).json({
         //          message: 'No entries found'
          //     });
          // }
           
       })
       .catch( err => {
           console.log(err);
           res.status(500).json({
               error: err
           });
       });
});
router.post('/',(req,res,next) => {
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.author,
        title: req.body.title,
        language: req.body.language,
        county: req.body.county,
        year: req.body.year
    });
    book
    .save()
    .then( result => {
        console.log(result);
        res.status(201).json({
            message:"Created book",
            createdBook:{
                author:result.author,
                title:result.title,
                language: result.language,
                county: result.county,
                year: result.year,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:6002/books/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
});
})
router.get('/:bookId',(req,res,next) => {
      const id =req.params.bookId;
      Book.findById(id)
      .select('author title language county year _id')
      .exec()
      .then( doc =>{
          console.log("From the database", doc);
          if(doc) {
            res.status(200).json({
                book: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:6002/books'
                }
            });
          } else {
              res.status(404).json({message: "No valid entry found for provided ID"});
          }
      })
      .catch( err => {
        console.log(err);
        res.status(500).json({error: err});
});
});
router.patch('/:bookId',(req,res,next) => {
    const id = req.params.bookId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName]=ops.value;
    }
  Book.update({_id: id},{$set: updateOps})
  .exec()
  .then(result => {
      res.status(200).json({
          message:"Book updated",
          request:{
              type: 'GET',
              url: 'http://localhost:6002/books/' + id
          }
      });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  });
});
router.delete('/:bookId',(req,res,next) => {
    const id = req.params.bookId;
    Book.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Book deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:6002/books',
                body: { author: 'String', title: 'String', language: 'String', county: 'String', year: 'Number'}
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;