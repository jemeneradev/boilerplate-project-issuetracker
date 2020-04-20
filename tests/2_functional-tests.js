/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          assert.equal(res.body.open, true)
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.open, true)
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text'
          //created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(Object.keys(res.body).length,0)
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      let issueCreated;
      suiteSetup((done)=>{
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          issueCreated = res.body
          done();
        });
      }) 
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,"no updated field sent")
          done();
        }); 
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: issueCreated._id, open:false})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,"successfully updated")
          done();
        });  
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: issueCreated._id, open:false, created_by:"me"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,"successfully updated")
          done();
        });  
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      let project=`project${Date.now()}`
      suiteSetup((done)=>{
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title:"filter_this_issue",
          issue_text:"filter this",
          created_by:"Me",
          assigned_to: "TEST GET",
          status_text: "GETFILTER",
          open:false
        })
        .end((err,res) => {
          done()
        })        
      })
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({created_by:"Me"})
        .end(function(err, res){
          console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body[0].created_by,"Me")
          assert.equal(res.body[0].issue_title,"filter_this_issue")
          assert.equal(res.body[0].issue_text,"filter this")
          done();
        }); 
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({created_by:"Me",open:true})
        .end(function(err, res){
          console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.body[0].created_by,"Me")
          assert.equal(res.body[0].issue_title,"filter_this_issue")
          assert.equal(res.body[0].issue_text,"filter this")
          done();
        });  
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      let issueCreated;
      suiteSetup((done)=>{
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          issueCreated = res.body
          done();
        });
      })  
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,"_id error")
          done();
        }); 
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:issueCreated._id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,`deleted ${issueCreated._id}`)
          done();
        });  
      });

      test('inValid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:"doesnotexist"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body,`could not delete doesnotexist`)
          done();
        });  
      });;
      
    });

});
