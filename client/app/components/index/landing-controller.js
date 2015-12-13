(function() {

  angular.module('landing.controller', []).controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['TwitterService','LocalDataService','$sce','$window'];
  /*
  * Controller for landing page
  * */
  function LandingCtrl(TwitterService,LocalDataService,$sce,$window) {
    //services
    this._TwitterService=TwitterService;
    this._LocalDataService=LocalDataService;
    this._$sce=$sce;
    this._$window=$window;
    //init values
    this.keywords='';
    this.highlightKeywords='';
    this.tweets=[];
    this.historySearch=this._LocalDataService.isStoredHistorySearch() ? this._LocalDataService.getHistorySearches(): [] ;
    //pagination
    this.currentPage = 1;
    this.pageSize = 20;
  }

  /*
  * Method for searching tweets.
  * It stores data to array and to local storage
  * */
  LandingCtrl.prototype.search = function(valid) {
    this.next_results='';
    this.refresh_url='';
    this.currentPage = 1;
    var that=this;
    if(valid){
       this._TwitterService.getTweets(this.keywords).then(function(data){
         that.tweets=[];
         if(data.statuses.length>0){
           that.customizeTweets(data);
           var search={
             keyword:that.keywords,
             tweets:that.tweets,
             metadata:{
               next_results:that.next_results,
               refresh_url:that.refresh_url
             }
           };
           if(that._LocalDataService.isStoredSpecificKeyword(that.keywords)){
             that._LocalDataService.replaceTweets(that.keywords,that.tweets,that.next_results,that.refresh_url);
             that.historySearch=that._LocalDataService.getHistorySearches();
           }else{
             that.historySearch.push(search);
             that._LocalDataService.setHistorySearches(that.historySearch);
           }
         }else{
           that._$window.alert("There is no tweets about "+that.keywords);
         }
       }, function(error){
         that._$window.alert("Something has gone wrong");
       });
      this.highlightKeywords=this.keywords;
    }
  };

  /*
  * Prepearing local tweets and other atributes for other methods
  * */
  LandingCtrl.prototype.showLocalTweets = function(search) {
    this.currentPage = 1;
    this.highlightKeywords=search.keyword;
    this.keywords=search.keyword;
    this.tweets=search.tweets;
    this.next_results=search.metadata.next_results;
    this.refresh_url=search.metadata.refresh_url;
  };

  /*
  * Method for highlighting word in tweet statuses.
  * */
  LandingCtrl.prototype.highlight = function(status) {
    if(!this.highlightKeywords) {
      return this._$sce.trustAsHtml(status);
    }
    return this._$sce.trustAsHtml(status.replace(new RegExp(this.highlightKeywords, "gi"), function(match) {
      return '<b class="bg-info">' + match + '</b>';
    }));
  };

  /*
  * Method for fetching older tweets when user is on last page
  * or page before last and if exists older tweets. Saving older tweets to localstorage
  * */
  LandingCtrl.prototype.pageChange = function(newPageNumber) {
    var that=this;
    var lastPageNumber=Math.ceil(this.tweets.length/this.pageSize);
    if(lastPageNumber-newPageNumber===1 || lastPageNumber===newPageNumber){
      if(this.next_results!=undefined){
        var max_id=this.next_results.split("=")[1].split("&q")[0];
        this._TwitterService.getNextTweets(max_id,this.keywords).then(function(data){
          that.customizeTweets(data);
          that._LocalDataService.setOlderTweets(that.keywords,that.tweets,that.next_results);
          that.historySearch=that._LocalDataService.getHistorySearches();
        },function(error){
          that._$window.alert("Something has gone wrong");
        })
      }
    }
  };

  /*
  * Method for fetching the newest tweets,
  * Saving new tweets to localstorage
  * */
  LandingCtrl.prototype.getNewTweets=function(){
    var that=this;
    var since_id=this.refresh_url.split("=")[1].split("&q")[0];
    this._TwitterService.getNewTweets(since_id,this.keywords).then(function(data){
      if(data.statuses.length>0){
        angular.forEach(data.statuses.reverse(),function(status){
          var status={
            user_name:status.user.name,
            screen_name:status.user.screen_name,
            profile_img:status.user.profile_image_url,
            created_at:status.created_at,
            text:status.text,
            favorite_count:status.favorite_count,
            retweet_count:status.retweet_count
          };
          that.tweets.unshift(status);
        });
        that.refresh_url=data.search_metadata.refresh_url;
        that._LocalDataService.setNewTweets(that.keywords,that.tweets,that.refresh_url);
        that.historySearch=that._LocalDataService.getHistorySearches();
        that.currentPage = 1;
      }else{
        that._$window.alert("There is no new tweets about "+that.keywords);
      }
    },function(error){
      that._$window.alert("Something has gone wrong");
    })
  };

  /*
  * Method for taking data from service response
  * */
  LandingCtrl.prototype.customizeTweets=function(data){
    var that=this;
    angular.forEach(data.statuses,function(status){
      var status={
        user_name:status.user.name,
        screen_name:status.user.screen_name,
        profile_img:status.user.profile_image_url,
        created_at:status.created_at,
        text:status.text,
        favorite_count:status.favorite_count,
        retweet_count:status.retweet_count
      };
      that.tweets.push(status);
    });
    that.next_results=data.search_metadata.next_results;
    that.refresh_url=data.search_metadata.refresh_url;
  }

})();
