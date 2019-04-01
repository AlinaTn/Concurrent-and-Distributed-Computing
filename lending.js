const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lending = require('../models/lending');
const Book = require('../models/book');
router.get('/',(req,res,next) => {
    Lending.find()
    .select('book numberOfBook _id')
    .exec()
    .then( docs => {
        res.status(200).json({
            count: docs.length,
            lending: docs.map(doc => {
                return {
                    _id: doc._id,
                    book: doc.book,
                    numberOfBooks: doc.numberOfBooks,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:6002/lending/' + doc._id
                    }
                }
            })
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
});
router.post('/',(req,res,next) => {
    Book.findById(req.body.bookId)
    .then( book => {
        if (!book) {
            return res.status(404).json({
              message: "Book not found"
            });
          }
        const lending = new Lending({
            _id:mongoose.Types.ObjectId(),
            numberOfBooks: req.body.numberOfBooks,
            book: req.body.bookId
        });
        return lending.save()
    })
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Lending stored',
                createdLending: {
                    _id: result._id,
                    book: result.book,
                    numberOfBooks: result.numberOfBooks
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:6002/lending/' + result._id
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
router.get('/:lendingId',(req,res,next) => {
    Lending.findById(req.params.lendingId)
    .exec()
    .then(lending => {
      if (!lending) {
        return res.status(404).json({
          message: "Lending not found"
        });
      }
      res.status(200).json({
        lending: lending,
        request: {
          type: "GET",
          url: "http://localhost:6002/lending"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:lendingId',(req,res,next) => {
    Lending.remove({ _id: req.params.lendingId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Lending deleted",
        request: {
          type: "POST",
          url: "http://localhost:6002/lending",
          body: { bookId: "ID", numberOfBooks: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;