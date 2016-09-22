'use strict';

var app = require('../server.js');
var assert = require('assert');
var supertest = require("supertest");


describe('Demo', function() {
  it('should return -1 when the value is not present', function() {
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});

describe('Car', function() {
  it('should return 200 OK', function(done) {
    	supertest(app)
      .get('/api/car')
      .expect(200)
      .end(done);
  });
});
// console.log(app);
// console.log(mocha);