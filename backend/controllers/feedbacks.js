var constants = require('../config/constants');
var utils = require('../config/utils');

var ObjectId = require("bson-objectid");


var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

exports.getFeedbacks = function(req, res) {
	/*var idSong = ObjectId(req.params.idSong);
	songsRepository.getFeedbacks(req.db,idSong,function(data){
		res.send(data);
	},function(code,msg){
		res.send(code,msg);
	})*/
};


exports.getMix = function(req, res) {
	var mixId = req.params.idMix;
    songsRepository.getSongsById(req.db, mixId, function(err, result1){
		if(err) {
		  console.log(err);
		  res.status(500);
		  res.json({ status: constants.JSON_STATUS_ERROR,
		  title: 'Error System',
		  message: 'An error has occured! Please try later or contact the administrator'});
		  return;	
		}
	
		songsRepository.getAverageMark(req.db, mixId, function(err, result2){

			if(err) {
			  console.log(err);
			  res.status(500);
			  res.json({ status: constants.JSON_STATUS_ERROR,
			  title: 'Error System',
			  message: 'An error has occured! Please try later or contact the administrator'});
			  return;	
			}

			var data = result1;
			if(result2.markAvg) {
				data.markAvg = result2.markAvg;
			}
			

			res.status(200);
			res.json({ status: constants.JSON_STATUS_SUCCESS,
			data : data,
			title: 'Add Mix to player',
			message: 'The mix is now in the player!'});
			return;
		});
	  });


			/*res.status(200);
			res.json({ status: constants.JSON_STATUS_SUCCESS,
			data : data,
			title: 'Add Mix to player',
			message: 'The mix is now in the player!'});
			return;*/

};

exports.postFeedback = function(req, res) {

	verifyRightToFeedback(req.db, req.body.songId, function(err, result) {
		var element = result.feedbacks.map(function(x) { return x._id.toString(); }).indexOf(req.token._id + "");
		if(element === -1){
			songsRepository.postComment(req.db, req.body.songId, req.token._id, req.body.comment, function(err, result){
				if(err) {
				  console.log(err);
				  res.status(500);
				  res.json({ status: constants.JSON_STATUS_ERROR,
				  title: 'Error System',
				  message: 'An error has occured! Please try later or contact the administrator'});
				  return;	
				}
			    res.status(200);
			    res.json({ status: constants.JSON_STATUS_SUCCESS,
			    title: 'Add Comment',
			    message: 'Your comment has been registred!'});
			  return;
			});
		} else {

			songsRepository.updateComment(req.db, req.body.songId, req.token._id, req.body.comment, function(err, result){
				if(err) {
				  console.log(err);
				  res.status(500);
				  res.json({ status: constants.JSON_STATUS_ERROR,
				  title: 'Error System',
				  message: 'An error has occured! Please try later or contact the administrator'});
				  return;	
				}

				res.status(200);
			    res.json({ 
			    	status: constants.JSON_STATUS_SUCCESS,
			    	title: 'Update Comment',
			    	message: 'Your comment has been updated!',
					data: result[0].markAvg
				});
			});			
		}

	});
};



/*
TODO : penser a faire un retour simple plutot que toArray dans le getAverage
 */
exports.postMark = function(req, res) {

	verifyRightToFeedback(req.db, req.body.songId, function(err, result) {

		var element = result.feedbacks.map(function(x) { return x._id.toString(); }).indexOf(req.token._id + "");
		if(element === -1){
			songsRepository.postMark(req.db, req.body.songId, req.token._id, req.body.mark, function(err, result){
				if(err) {
				  console.log(err);
				  res.status(500);
				  res.json({ status: constants.JSON_STATUS_ERROR,
				  title: 'Error System',
				  message: 'An error has occured! Please try later or contact the administrator'});
				  return;	
				}


				songsRepository.getAverageMark(req.db, req.body.songId, function(err, result) {

					if(err) {
						res.status(500);
					    res.json({ status: constants.JSON_STATUS_WARNING,
					    title: 'Post Mark',
					    message: 'Your mark has been post but it\'s not possible to display the new average mark!'});
					    return;
					}

					res.status(200);
				    res.json({
				    	status: constants.JSON_STATUS_SUCCESS,
				    	title: 'Add Mark',
				    	message: 'Your mark has been registred!',
				    	data: result.markAvg
				    });
				  	return;
				})
			});

		} else {

			songsRepository.updateMark(req.db, req.body.songId, req.token._id, req.body.mark, function(err, result){
				if(err) {
				  console.log(err);
				  res.status(500);
				  res.json({ status: constants.JSON_STATUS_ERROR,
				  title: 'Error System',
				  message: 'An error has occured! Please try later or contact the administrator'});
				  return;	
				}

				songsRepository.getAverageMark(req.db, req.body.songId, function(err, result) {

					if(err) {
						res.status(500);
					    res.json({ status: constants.JSON_STATUS_WARNING,
					    title: 'Update Mark',
					    message: 'Your mark has been updated but it\'s not possible to display the new average mark!'});
					    return;
					}

					res.status(200);
				    res.json({ 
				    	status: constants.JSON_STATUS_SUCCESS,
				    	title: 'Update Mark',
				    	message: 'Your mark has been updated!',
						data: result.markAvg
					});
				})
			});
		}
	});

};

var verifyRightToFeedback = function(db, songId, callback) {

	songsRepository.getSongsById(db, songId, function(err, result){
			
		if(err) {
		  callback({ status: constants.JSON_STATUS_ERROR,
		    title: 'Error System',
		    message: 'An error has occured! Please try later or contact the administrator'}, null);
		  return;
		}

        /*if(result.author._id == req.token._id) {
		  //res.status(403);
		  //res.json({ status: constants.JSON_STATUS_ERROR,
		    //title: 'Mark Error',
		    //message: 'It\'s impossible to mark our own mix!'});
		  //return;
		  callback({ 
		  	status: constants.JSON_STATUS_ERROR,
		    title: 'Mark Error',
		    message: 'It\'s impossible to mark our own mix!'
		  }, null);
		  return;
		} */
		callback(null, result);
	});
}

