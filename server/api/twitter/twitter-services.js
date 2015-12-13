var Client = require('node-rest-client').Client;

module.exports.TweetsService = function () {
  var twitterClient = new Client();

  twitterClient.registerMethod('search', 'https://api.twitter.com/1.1/search/${action}', 'GET');

  this.search = function (opts, callback) {
    var args = {
        path: {'action': 'tweets.json'},
        parameters: {
          'q': opts.query,
          'count':opts.count
        },
        headers: {Authorization: 'Bearer ' + opts.access_token}
    };
    twitterClient.methods.search(args, function (data, response) {
      callback(data);
    })
  };

  twitterClient.registerMethod('next_results', 'https://api.twitter.com/1.1/search/${action}', 'GET');

  this.searchMore = function (opts, callback) {
    var args = {
      path: {'action': 'tweets.json'},
      parameters: {
        'q': opts.query,
        'count':opts.count,
        'max_id':opts.max_id
      },
      headers: {Authorization: 'Bearer ' + opts.access_token}
    };
    twitterClient.methods.next_results(args, function (data, response) {
      callback(data);
    })
  };

  twitterClient.registerMethod('new', 'https://api.twitter.com/1.1/search/${action}', 'GET');

  this.searchNew = function (opts, callback) {
    var args = {
      path: {'action': 'tweets.json'},
      parameters: {
        'q': opts.query,
        'since_id':opts.since_id
      },
      headers: {Authorization: 'Bearer ' + opts.access_token}
    };
    twitterClient.methods.new(args, function (data, response) {
      callback(data);
    })
  };

  return this;
};

