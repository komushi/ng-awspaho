# ng-awspaho
# AWS IoT Service Paho Client Library for AngularJS

----

## 1. Installation
### Install via Bower:
```bash
$ bower install ng-awspaho
```

## 2. Usages
### 2-1. Add dependencies to your HTML file
```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/aws-iot-sign/lib/aws-iot-sign.js"></script>
<script src="bower_components/paho-mqtt/src/mqttws31.js"></script>
<script src="bower_components/ng-awspaho/src/ng-awspaho.js"></script>
```

### 2-2. Declare ng-awsmqtt as a dependency in your application
```
var app =  angular.module('your-app', ['ng-awspaho']);
```

### 2-3. Inject in your controller
```
app.controller('your-controller', ['$scope', '$paho', function($scope, $paho){
    ...
}
```

### 2-4. Available Methods
#### 2-4-1. Connect to an endpoint
```
// Credentials
AWS.config.region = '<region>';
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: '<region>:<identity_pool_id>'
});

// Connect
$paho.connect('my-connection-to-endpoint1', '<region>', '<iot_endpoint>.iot.<region>.amazonaws.com', credentials)
  .then(function(payload) {
    console.log(JSON.stringify(payload));
  }, function(payload) {
    console.error(JSON.stringify(payload));
  });
```

#### 2-4-2. Disconnect from an endpoint - TODO
```
$mqtt.disconnect('my-connection-to-endpoint1',).then(
    function () {
        console.log('Disconnected');
    });   
```

#### 2-4-3. Subscribe to a topic
```
$mqtt.subscribe('my-connection-to-endpoint1', 'iotbutton/001')
    .then(function (message) {
        // when receive a message
        console.log(JSON.stringify(message));
    })
    .catch(function (err) {
        // error handling
        console.error(err);
    });

// Subscribe a topic
$paho.subscribe('my-connection-to-endpoint1', 'iotbutton/001', 1)
  .then(function(payload) {
    console.log(JSON.stringify(payload));
    $paho.received('my-connection-to-endpoint1')
      .then(null,null, function(payload){
        console.log(payload.message.payloadString);
      });
  }, function(payload) {
      console.error(JSON.stringify(payload));
  });
```

#### 2-4-4. Unsubscribe from a topic - TODO
```
$mqtt.unsubscribe($scope.awsMqtt.name, $scope.awsMqtt.subdest)
    .then(function (message) {
        // unsubscribe result
        console.log(JSON.stringify(message));
    })
    .catch(function (err) {
        // error handling
        console.error(err);
    });
```

#### 2-4-5. Send message to a topic - TODO
```
$mqtt.send('my-connection-to-endpoint1', 
    'iotbutton/002', 
    'my-payload-text');
```

----

## Example
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

      $scope.awsMqtt.region = '<region>';
      $scope.awsMqtt.endpoint = '<iot_endpoint>.iot.<region>.amazonaws.com';
      $scope.awsMqtt.identityPoolId = '<region>:<identity_pool_id>';
      AWS.config.region = $scope.awsMqtt.region;
      $scope.awsMqtt.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: $scope.awsMqtt.identityPoolId});
      $scope.awsMqtt.topic = 'iotbutton/001';

    };

    initialize();

}]);
```

## TODO: implement the following
* $paho.disconnect
* $paho.unsubscribe