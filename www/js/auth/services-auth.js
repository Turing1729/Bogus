angular.module('starter.services-auth', [])

/**
 * General Wrapper for Auth
 * This version: 25/07/2015
 * See also: https://www.firebase.com/docs/web/libraries/ionic/guide.html
 */
.factory('Auth', function($q, $rootScope) {
  var self = this;
  self.AuthData = {};

  /**
   * Init the global variable AuthData
   */
  onAuth().then(
      function(AuthData){
        self.AuthData = AuthData;
      }
  );

  /**
   * v3
   * unAuthenticate the user
   * independent of method (password, twitter, etc.)
   */
  self.unAuth = function() {
    var qSignOut = $q.defer();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      broadcastAuthChange();
      qSignOut.resolve();
    }, function(error) {
      // An error happened.
      qSignOut.reject(error);
    });
    return qSignOut.promise;
  };

  /**
   * v3
   * Monitor the current authentication state
   * returns on success:  AuthData
   * returns on fail:     AUTH_LOGGED_OUT
   */
  function onAuth() {
    var qCheck = $q.defer();
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          self.AuthData = user;//gv
          qCheck.resolve(user);
        } else {
          console.log("logged out");
          qCheck.reject("AUTH_LOGGED_OUT");
        };
    });
    return qCheck.promise;
  };
  self.getAuthState = function() {
    return onAuth();
  };

  /**
   * v3
   * Authenticate the user with password
   * returns on success: AuthData
   * returns on error: error
   *
   * common error.code:
   * INVALID_USER (user does not excist)
   * INVALID_EMAIL (email incorrect)
   * INVALID_PASSWORD
   */
  self.signInPassword = function(userEmail, userPassword) {

    var qAuth = $q.defer();
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    .then(function(User){
        broadcastAuthChange();
        self.AuthData = User; //gv
        qAuth.resolve(User);
    })
    .catch(function(error) {
        broadcastAuthChange();
        if(error.code == 'auth/network-request-failed') {
            error['message'] = "Oops... It seems that your browser is not supported. Please download Google Chrome or Safari and try again."
        };
        qAuth.reject(error);
    });
    return qAuth.promise;
  };


  /**
   * v3
   * Create a new user with password
   * method: does not require confirmation of email
   * returns on success: userData =/= AuthData (??)
   * returns on error: error
   *
   */
  self.signUpPassword = function(userEmail, userPassword) {
    var qAuth = $q.defer();
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
    .then(function(User){
        broadcastAuthChange();
        self.AuthData = User; //gv
        qAuth.resolve(User);
    })
    .catch(function(error) {
        broadcastAuthChange();
        if(error.code == 'auth/network-request-failed') {
            error['message'] = "Oops... It seems that your browser is not supported. Please download Google Chrome or Safari and try again."
        };
        qAuth.reject(error);
    });
    return qAuth.promise;
  };

  /**
   * XXX
   * Change Password or Email / Reset Password
   */
  self.changePassword = function(userEmail, oldPassword, newPassword) {
    var qChange = $q.defer();
    var ref = new Firebase(FBURL);
    ref.changePassword({
        email       : userEmail,
        oldPassword : oldPassword,
        newPassword : newPassword
    }, function(error) {
        if (error === null) {
            qChange.resolve("CHANGE_PASSWORD_SUCCESS");
        } else {
            qChange.reject(error);
        }
    });
    return qChange.promise;
  };

  //    * XXX
  self.changeEmail = function(oldEmail, newEmail, userPassword) {
    var qChange = $q.defer();
    var ref = new Firebase(FBURL);
    ref.changeEmail({
        oldEmail : oldEmail,
        newEmail : newEmail,
        password : userPassword
    }, function(error) {
        if (error === null) {
            qChange.resolve("CHANGE_EMAIL_SUCCESS");
        } else {
            qChange.reject(error);
        }
    });
    return qChange.promise;
  };

  // v3
  self.resetPassword = function(userEmail) {
    var qReset  = $q.defer();
    var auth    = firebase.auth();
    auth.sendPasswordResetEmail(emailValue).then(function() {
      qReset.resolve("RESET_PASSWORD_SUCCESS");
    }, function(error) {
      qReset.reject(error);
    });
    return qReset.promise;
    return qConfirm.promise;
  };

  /**
   * ---------------------------------------------------------------------------
   * Social Authentication
   * TODO: please follow the instructions here: https://firebase.google.com/docs/auth/web/google-signin
   */
   self.signInSocial = function(provider) {
      console.log("signInSocial", provider)
      var provider = new firebase.auth.GoogleAuthProvider();
      var qSignIn = $q.defer();
      qSign.resolve(false)
      return qSignIn.promise;
  };

  function broadcastAuthChange() {
    $rootScope.$broadcast('rootScope:authChange', {});
  };

  return self;
})
