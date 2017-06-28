# AWS IoT Service Paho Client Library for AngularJS

## How to use
```
var app =  angular.module('ngPahoExample', ['ng-awspaho']);

app.controller('mqttController', ['$scope', '$paho', function($scope, $paho){

    // Connect
    $scope.connect = function () {
      $paho.connect($scope.awsMqtt.name, $scope.awsMqtt.region, $scope.awsMqtt.endpoint, $scope.awsMqtt.credentials)
        .then(function(payload) {
          console.log(JSON.stringify(payload));
        }, function(payload) {
            console.error(JSON.stringify(payload));
        });
    };

    // Subscribe a topic
    $scope.subscribe = function () {
      $paho.subscribe($scope.awsMqtt.name, $scope.awsMqtt.topic, 1)
        .then(function(payload) {
          // console.log(payload.topic, payload.invocationContext)
          console.log(JSON.stringify(payload));
          $paho.received($scope.awsMqtt.name)
            .then(null,null,showResponse);
        }, function(payload) {
            console.error(JSON.stringify(payload));
          // console.error(payload.topic, payload.invocationContext, payload.errorCode, payload.errorMessage)
        });
    };

    // Disconnect
    $scope.disconnect = function () {
      $paho.disconnect($scope.awsMqtt.name).then(
        function () {
            console.log('Disconnected');
        });        
    };

    // Unsubscribe a topic
    $scope.unsubscribe = function () {
      $paho.unsubscribe($scope.awsMqtt.name, $scope.awsMqtt.topic)
        .then(function (message) {
            console.log(JSON.stringify(message));
        })
        .catch(function (err) {
            console.error(err);
        });
    };

    // Send a message
    $scope.send = function () {
      // use JSON.parse($scope.awsMqtt.payload) to send JSON string
      $paho.send($scope.awsMqtt.name, $scope.awsMqtt.topic, $scope.awsMqtt.payload);
    };

    // notify callback function
    var showResponse = function (payload) {
        console.log(payload.message.payloadString);
    };

    var initialize = function () {
      $scope.awsMqtt = {}

      $scope.awsMqtt.region = 'ap-northeast-1';
      $scope.awsMqtt.endpoint = 'a2sdpyfw66qrvw.iot.ap-northeast-1.amazonaws.com';
      $scope.awsMqtt.identityPoolId = 'ap-northeast-1:b0ea8e9d-0401-434f-a295-2b201efdfb97';
      AWS.config.region = $scope.awsMqtt.region;
      $scope.awsMqtt.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: $scope.awsMqtt.identityPoolId});
      $scope.awsMqtt.topic = 'iotbutton/001';

    };

    initialize();

}]);
```

## TODO
* $paho.disconnect
* $paho.unsubscribe
* $paho.send