var Client = require('node-rest-client').Client;

module.exports.Authenticator = function () {
  var client = new Client();
  var consumerKey ='aYMa6KweEyyiUnBPVURzhGuYR';
  var consumerSecret ='fG1u6fZKKaM2NWUp818q8OVisbX4rdEcTD3ayCvUDgP6doLLsK';
  var credentials = new Buffer(consumerKey + ':' + consumerSecret).toString('base64');

  var args = {
    data: 'grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  client.registerMethod("auth", "https://api.twitter.com/oauth2/token", "POST");

  this.authenticate = function (ops, callback) {
    client.methods.auth(args, function(data){
      callback(data.access_token);
    });
  };

  return this;
};

