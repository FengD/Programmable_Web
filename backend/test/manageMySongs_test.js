'use strict';

var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');
var ObjectID = require("bson-objectid");

var mongoose = require('mongoose');
var db;
var dbs;
var userID = "56bc9b6846f1be7a164358c1";

// On set notre adresse serveur
var server = request.agent("http://localhost:3000");

describe("Unit test for manageMySongs routes", function() {

	before(function (done) {

		mongoose.connect(constants.MONGO_URL_TEST_DB);
		db = mongoose.connection;
		dbs = mongoose.connection.db;

		dbs.dropDatabase();
		dbs.createCollection('users');

		db.collection('users').insertOne(
			{ 
				"_id" : userID,
				'email': 'test@gmail.com',
				'password' : "$2a$10$vGVaf40wcE/DqZqp2FkUtepyq.CxsRehgk./Z37LzRQ.YizXdclfO"
			}, function(err, result) {
  		});

   		dbs.createCollection('songs');

		db.collection('songs').insertOne(
			{
				"_id" : "56bc9b6846f1be7a164358c3",
				"author": {
					"full_name":"Echyzen Ryoama",
					"_id":userID
				}
			}, function(err, res) {

  		});
	    done();
		mongoose.connection.close();

    });

	after(function (done) {
		dbs.dropDatabase();
        done();
    });

	
	it("should return all user songs", function(done) {
		server.post("/login")
            .send({email : "test@gmail.com", password : "azerty"})
            .end( function(err, res) {

			server.get("/manageMySongs/" + userID)
				.expect(200)
				.end( function(err, res) {
					console.log(res);
					expect(res.status).to.be.equal(200);
					console.log(res.body);
					/*expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
					expect(res.body.title).to.be.equal("Add Mix to player");
					expect(res.body.message).to.be.equal("The mix is now in the player!");*/
					
					done();
			});
        });		
	});

});
