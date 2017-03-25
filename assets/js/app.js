var userEtag = '';


  var config = {
    apiKey: "AIzaSyAUYsyg6BMEAfnFRIk2rjrtjQGJ_hQhgO8",
    authDomain: "my-awesome-project-2b194.firebaseapp.com",
    databaseURL: "https://my-awesome-project-2b194.firebaseio.com",
    storageBucket: "my-awesome-project-2b194.appspot.com",
    messagingSenderId: "901877515687"
  };
  firebase.initializeApp(config);



  var database = firebase.database();
  var databaseRef = database.ref();


  var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

  var signout = function() {
    hello('google').logout()
    localStorage.removeItem('hello');
    location.reload();
  	delete_cookie('NID');

  };



  hello.init({
    google: "901877515687-0d07o7leoihhv3ina4bqcv40ab347q86.apps.googleusercontent.com"
  }, {
    redirect_uri: 'https://dangnabit.github.io/OAuth/OAuth%20Test.html'
  });

  hello.on('auth.login', function(auth) {

    // Call user information, for the given network
    hello(auth.network).api('me').then(function(r) {
      console.log(r);
      // Inject it into the container
      var label = document.getElementById('profile_' + auth.network);
      if (!label) {
        label = document.createElement('div');
        label.id = 'profile_' + auth.network;
        document.getElementById('profile').appendChild(label);
      }
      
      userEtag = r.etag;

      label.innerHTML = '<img src="' + r.thumbnail + '" /> Hey ' + r.name + "<br>" + r.etag;
      var googSession = hello('google').getAuthResponse()

      var googAccessToken = googSession.access_token

      var googExpires = googSession.expires

      console.log(googAccessToken);
      console.log(googExpires);
     	
      writeUserData(r.etag, r.name, r.email, r.thumbnail);
    });
  });


function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    profile_picture : imageUrl
  });
}