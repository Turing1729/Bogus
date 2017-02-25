angular.module('starter.services-products-comments', [])


.factory('ProductComments', function($q, Utils, Profile, Indexing, FireFunc) {
    var self = this;


    /**
     * GET
     */
    self.load = function(productId) {
        var childRef = "products_comments/" + productId;
        return FireFunc.onValue(childRef);
    };

    /**
     * SET
     */
    self.post = function(productId, userId, commentObj) {
        var qPost = $q.defer();
        var tid = Utils.genTimestampID();
        var childRef = "products_comments/" + productId + '/' + tid;
        FireFunc.set(childRef, commentObj).then(function(success){
          // --> resolve
          handleUpdates(productId, commentObj);
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

    // dynamic updates and indexing for comments
    function handleUpdates(productId) {
        Indexing.updateDynamicIndex(productId, 'comment_new');
    };

    /**
     * GET and FILL
     * Loads the profiles of the users commented on a certain productId
     *
     * @param: Comments Array
     */
    self.loadProfiles = function(Comments) {
        var promises = {};
        for (var i=0; i<Comments.length; i++) {
            var promise = Profile.get(Comments[i].userId).then(
                function(ProfileData){
                    return ProfileData;
                },
                function(error){
                    return error;
                }
            );
            promises[Comments[i].userId] = promise;
        }
        return $q.all(promises)
    };


    return self;
})
