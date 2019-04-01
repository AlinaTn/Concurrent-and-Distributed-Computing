const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
author: {type: String, required: true},
title: {type: String, required: true},
language: {type: String, required: true},
county: String,
year: {type: Number, required: true}
});

module.exports = mongoose.model('Book',bookSchema);
