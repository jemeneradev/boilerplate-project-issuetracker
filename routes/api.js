/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

require('dotenv').config()

const mongoose = require('mongoose');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Issue = require('../models/issue.js')
module.exports = function (app) {

  //?I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
  //?I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.

  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;
      Issue.aggregate()
        .match({
          project: project
        })
        .exec((err, issuesFound) => {
          if (issuesFound !== null) {
            res.json(issuesFound)
          } else {
            res.json({});
          }
        })
    })

    //?I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
    //?The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.

    .post(function (req, res) {
      //var project = req.params.project;
      //console.log(req.body,req.params)
      Issue.create({
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      }, (err, issueCreated) => {
        //console.log("issues created", err,issueCreated)
        if(issueCreated!==null){
          res.json(issueCreated);
        }
        else{
          res.json({});
        }        
      })
    })

    //?I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
    .put(function (req, res) {
      if((Object.keys(req.body).length===0) || (Object.keys(req.body).length===1 && req.body._id!==undefined)){
        res.json("no updated field sent")
      }
      else
      {
        Issue.findOneAndUpdate(req.body._id,Object.assign({},req.body,{updated_on:Date.now()}),(err,issueFound)=>{
          if(issueFound!==null){
            res.json("successfully updated")
          }else{
            res.json(`could not update ${req.body._id}`)
          }
        })
      }
    })

    //?I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    .delete(function (req, res) {
      var project = req.params.project;
      if(req.body._id===undefined){
        res.json("_id error")
      }
      else(
        Issue.findByIdAndDelete(req.body._id,(err,issueRemoved)=>{
          if (issueRemoved === null) {
            res.json(`could not delete ${req.body._id}`)
          }
          else {
            console.log(issueRemoved)
            res.json(`deleted ${req.body._id}`) 
          }
        })
      )
    });

};