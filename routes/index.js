var express = require('express');
var crypto = require('crypto')
var router = express.Router();
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.query.latitude && req.query.longtitude){
    var query = Photo.find({'latitude':{ $gte: req.query.latitude-3, $lte: req.query.latitude+3}, 'longtitude': { $gte: req.query.longtitude-3, $lte: req.query.longtitude+3 }});
    query.exec(function(err,photo){
      if (err) { return next(err); }
      if (!photo){ return next(new Error ("Can't find photo")); }
      res.json(photo);
    });
  } else {
    Photo.find(function(err, photos){
      if (err) { return next(err); }
      res.json(photos);
    });
  }
});

router.param('uniq_token', function(req, res, next, uniq_token){
  var query = Photo.findByToken(uniq_token);

  query.exec(function(err, photo){
    if (err) { return next(err); }
    if (!photo) {
      return next(new Error ("cant find photo"));
    }
    req.photo = photo;
    return next();
    });
});

router.get('/get/:uniq_token/', function(req,res){
  res.json(req.photo);
});

router.put('/get/:uniq_token/upvote', function(req,res, next){
  //grab first from array, otherwise method won't work
  req.photo[0].upvote(function(err, photo){
    if (err) { return next(err); }

    res.json(photo);
  });
});

router.post('/create', function(req, res, next){
  var data = req.body
  var token = randomValueBase64(5);
  data['uniq_token'] = token;
  console.log(data);

  var photo = new Photo(data)
  photo.save(function(err,post){
    if(err){
      return next(err);
    }
    res.json(photo);
  });
});

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

module.exports = router;
