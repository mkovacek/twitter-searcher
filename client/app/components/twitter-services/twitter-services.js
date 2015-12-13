angular.module('twitter.services', []).factory('TwitterService', TwitterService);

TwitterService.$inject = ['$q', '$resource'];
/*
 * Factory for calling web services
 * */
function TwitterService ($q, $resource){
  var numOfTweets=80;
  var nextNumOfTweets=60;

  var getAction = $resource('/:action', {
      action: '@action'
  },{
      query: {
        method: 'GET',
        isArray: true
      }
  });

  var getTweetsAction = $resource('/:action/:secondAction', {
    action: '@action',
    secondAction: '@secondAction'
  },{
    query: {
      method: 'GET',
      isArray: true
    }
  });

  return {
    getTweets: getTweets,
    getNextTweets:getNextTweets,
    getNewTweets: getNewTweets
  };

  /*
   * Method fetch tweets for specific keyword
   * */
  function getTweets(keyword){
      var q = $q.defer();
      getAction.get({
          action: 'tweets',
          q:       window.encodeURIComponent(keyword),
          count:   numOfTweets
      }, function(response) {
          q.resolve(response);
      }, function(error) {
          q.reject(error);
      });
      return q.promise;
  }

  /*
   * Method fetch more, older tweets for specific keyword from max_id
   * */
  function getNextTweets(max_id,keyword){
    var q = $q.defer();
    getTweetsAction.get({
      action: 'tweets',
      secondAction: 'next_results',
      q:       window.encodeURIComponent(keyword),
      count:   nextNumOfTweets,
      max_id:  max_id
    }, function(response) {
      q.resolve(response);
    }, function(error) {
      q.reject(error);
    });
    return q.promise;
  }

  /*
   * Method fetch the newest tweets for specific keyword from since_id
   * */
  function getNewTweets(since_id,keyword){
    var q = $q.defer();
    getTweetsAction.get({
      action: 'tweets',
      secondAction: 'new',
      q:       window.encodeURIComponent(keyword),
      since_id: since_id
    }, function(response) {
      q.resolve(response);
    }, function(error) {
      q.reject(error);
    });
    return q.promise;
  }
}

