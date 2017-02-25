angular.module('starter.services-orders', [])

// ** todo
// give the admin the right to add notes (like status: order in progress, order delivered, etc.)
// communication with client
// sort orders on date

.factory('OrdersManager', function($q, FireFunc) {
  var self = this;

  self.OrdersData = {}; //cache
  self.OrdersDataArray = [];

  self.getOrders = function(uid) {
    var qGet = $q.defer();

    var iter = 0;
    var childRef = "orders/" + uid;
    FireFunc.onValue(childRef).then(function(OrdersData){

        // --
        self.OrdersData = OrdersData;
        angular.forEach(OrdersData, function(value, key){
          self.OrdersDataArray[iter] = {
            key: key,
            value: value
          };
          iter = iter+1;
        })

        qGet.resolve(self.OrdersDataArray);
        // --

    },
    function(error){
      qGet.reject(error);
    })
    return qGet.promise;
  };


  /**
   * Depreciated in Ionic Shop ++
   * v3
   */
  self.addOrder = function(uid, OrderData) {
    var qUpdate = $q.defer();
    var orderId  = generateOrderId();

    var childRef = "orders/" + uid + "/" + orderId;
    FireFunc.set(childRef, OrderData).then(function(){
      qUpdate.resolve(orderId);
    },
    function(error){
      qUpdate.reject(error);
    });
    return qUpdate.promise;
  };

  self.prepareOrderData = function(Cart, StripeInvoiceData) {
    // remove screenshot or other images (optional)
    var CachedMetaAdj = Cart.CachedMeta;
    if(CachedMetaAdj.hasOwnProperty('screenshot1')){delete CachedMetaAdj['screenshot1']};
    // prepare
    var OrderData = {
      StripeInvoiceData: StripeInvoiceData,
      paymentId: StripeInvoiceData.balance_transaction,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      CachedTotal: Cart.CachedTotal,
      CachedMeta: CachedMetaAdj,
      CachedList: Cart.CachedList,
    };
    return OrderData;
  };

  // generic function to generate order id
  self.generateOrderId = function() {
    return generateOrderId();
  };
  function generateOrderId() {
    var d = new Date();

    var wordString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var letterPart = "";
    for (var i=0; i<3; i++) {
      letterPart = letterPart + wordString[Math.floor(26*Math.random())]
    };

    var fyear = d.getFullYear();
    var fmonth = d.getMonth()+1;
    var fday = d.getDate();
    var fhour = d.getHours();
    var fminute = d.getMinutes();

    fmonth = fmonth < 10 ? '0'+fmonth : fmonth;
    fday = fday < 10 ? '0'+fday : fday;
    fhour = fhour < 10 ? '0'+fhour : fhour;
    fminute = fminute < 10 ? '0'+fminute : fminute;

    var ftime = d.getTime();

    d = d.getTime();
    d = d.toString();

    var randomNumb = d.substr(d.length-3,d.length-1);

    return "O" + "-" + randomNumb + "-" + letterPart
  };

  return self;

});
