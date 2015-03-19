#!/usr/bin/env node

var github = require('octonode');

fetchRepos();
function fetchRepos() {

  var personalToken = '4520266a04e29a092c2e25ff5e37482238635c2e';

  var client = github.client({
    username: 'tomusdrw',
    password: personalToken
  });

  var org = client.org('devmeetings');

  org.teams(function(err, data) {
    if (err) { 
      console.log(err);
    } else {
      console.log(data);
    }
  });

}
