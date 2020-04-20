var ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

//! Required:issue_title, issue_text, created_by
//! Optional: assigned_to and status_text.
const issueSchema = new mongoose.Schema({
  open:{
    type: Boolean,
    default: true
  },
  project:{
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true,
    min: 1,
    max: 100
  },
  issue_text: {
    type: String,
    required: true,
    min: 1,
    max: 250
  },
  created_by: {
    type: String,
    required: true,
    min: 1,
    max: 50
  },
  assigned_to: {
    type: String,
    default:""
  },
  status_text: {
    type: String,
    default:""
  },
  created_on:{
    type: Date,
    default: Date.now() 
  },
  updated_on:{
    type:Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Issue',issueSchema)