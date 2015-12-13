angular.module('localData.services', []).factory('LocalDataService', LocalDataService);

LocalDataService.$inject = [];
/*
 * Factory for storing and fetching data from local storage
 * */
function LocalDataService (){

  return {
    isStoredHistorySearch:isStoredHistorySearch,
    getHistorySearches: getHistorySearches,
    setHistorySearches: setHistorySearches,
    isStoredSpecificKeyword:isStoredSpecificKeyword,
    setOlderTweets:setOlderTweets,
    setNewTweets:setNewTweets,
    replaceTweets:replaceTweets
  };

  /*
   * Method checks if tweets are stored in local storage
   * */
  function isStoredHistorySearch(){
    return Boolean(JSON.parse(window.localStorage.getItem('tweets')));
  }

  /*
   * Method return history search (keyword+metadata+tweets) from local storage
   * */
  function getHistorySearches(){
    return JSON.parse(window.localStorage.getItem('tweets'));
  }

  /*
   * Method set history search (keyword+metadata+tweets) to local storage
   * */
  function setHistorySearches(searchHistory){
    window.localStorage.setItem('tweets',JSON.stringify(searchHistory));
  }

  /*
   * Method checks if specific keyword is stored in local storage
   * */
  function isStoredSpecificKeyword(keyword){
    var exist=false;
    var histories=this.getHistorySearches();
    angular.forEach(histories,function(history){
      if(history.keyword===keyword){
        exist=true;
      }
    });
    return exist;
  }

  /*
   * Method set fetched older tweets to local storage
   * */
  function setOlderTweets(keyword,tweets,next_results){
    var histories=this.getHistorySearches();
    angular.forEach(histories,function(history){
      if(history.keyword===keyword){
        history.tweets=tweets;
        history.metadata.next_results=next_results;
      }
    });
    this.setHistorySearches(histories);
  }

  /*
   * Method set new tweets to local storage
   * */
  function setNewTweets(keyword,tweets,refresh_url){
    var histories=this.getHistorySearches();
    angular.forEach(histories,function(history){
      if(history.keyword===keyword){
        history.tweets=tweets;
        history.metadata.refresh_url=refresh_url;
      }
    });
    this.setHistorySearches(histories);
  }

  /*
   * Method replace tweets and metadata with new one for stored keyword
   * For use case when user search keyword that is already in search history
   * */
  function replaceTweets(keyword,tweets,next_results,refresh_url){
    var histories=this.getHistorySearches();
    angular.forEach(histories,function(history){
      if(history.keyword===keyword){
        history.tweets=tweets;
        history.metadata.next_results=next_results;
        history.metadata.refresh_url=refresh_url;
      }
    });
    this.setHistorySearches(histories);
  }

}

