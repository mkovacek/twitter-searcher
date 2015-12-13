import auth from './twitter-authentication';
import tweetService from './twitter-services';

// Get tweets
exports.getTweets = function(req, res) {
  auth.Authenticator().authenticate({},function(token){
    var opts = {
      query: req.query.q,
      count: req.query.count,
      access_token: token
    };
    tweetService.TweetsService().search(opts, function (data) {
      res.json(data);
    });
  });
};

// Get more tweets, older one
exports.getMoreTweets = function(req, res) {
  auth.Authenticator().authenticate({},function(token){
    var opts = {
      query: req.query.q,
      count: req.query.count,
      max_id:req.query.max_id,
      access_token: token
    };
    tweetService.TweetsService().searchMore(opts, function (data) {
      res.json(data);
    });
  });
};

// Get the newest tweets
exports.getNewTweets = function(req, res) {
  auth.Authenticator().authenticate({},function(token){
    var opts = {
      query: req.query.q,
      since_id:req.query.since_id,
      access_token: token
    };
    tweetService.TweetsService().searchNew(opts, function (data) {
      res.json(data);
    });
  });
};
