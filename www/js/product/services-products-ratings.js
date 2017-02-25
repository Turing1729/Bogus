angular.module('starter.services-products-ratings', [])


.factory('ProductRatings', function($q, Utils, Profile, Indexing, FireFunc) {
    var self = this;


    /**
     * GET
     */
    self.load = function(productId) {
      var childRef = "products_ratings/" + productId;
      return FireFunc.onValue(childRef);
    };


    /**
     * SET
     */
    self.post = function(productId, userId, ratingObj) {
        var qPost = $q.defer();
        // var tid = Utils.genTimestampID();
        var childRef = "products_ratings/" + productId + '/' + userId;
        FireFunc.set(childRef, ratingObj).then(function(success){
          // --> resolve
          handleUpdates(productId, ratingObj);
          qPost.resolve(productId);
        },
        function(error){
          qPost.reject({
              error: error,
              productId: productId
          });
        })
        return qPost.promise;
    };

    // dynamic updates and indexing for ratings
    function handleUpdates(productId, ratingObj) {
        Indexing.updateDynamicIndex(productId, 'rating_new', {rating_value_new: ratingObj.value});
    };


    /**
     * GET and FILL
     * Loads the profiles of the users who rated on a certain productId
     *
     * @param: Ratings Object
     */
    self.loadProfiles = function(Ratings) {
        var promises = {};
        angular.forEach(Ratings, function(value, key){
            if(key != 'cache') {
                var promise = Profile.get(key).then(
                    function(ProfileData){
                        //var keys = Object.keys(ProfileData);
                        //return ProfileData[keys[0]];
                        return ProfileData;
                    },
                    function(error){
                        return error;
                    }
                )
            };
            promises[key] = promise;
        })
        return $q.all(promises)
    };


    /**
     * GET
     * Used to determine whether user has bought a certain item and is allowed to rate it
     */
    self.loadPurchase = function(productId, userId) {
        var qPurch = $q.defer();
        var childRef = "purchases/" + productId + "/" + userId;
        return FireFunc.onValue(childRef);
    };

    return self;
})
