/**
 * ng-awspaho
 *
 * @version 0.0.1
 * @author Lei Xu <komushi@gmail.com>
 * @license MIT
 */

(function (factory) {
  'use strict'
  if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      typeof angular !== 'undefined' ? angular : require('angular'),
      typeof Paho !== 'undefined' ? Paho : require('mqttws31'),
      typeof AWSIoTSign !== 'undefined' ? AWSIoTSign : require('aws-iot-sign')
    )
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'mqttws31', 'aws-iot-sign'], factory)
  } else {
    // Browser globals
    factory(angular, Paho, AWSIoTSign)
  }
}(function (angular, Paho, AWSIoTSign) {
  angular
  .module('ng-awspaho', [])
  .service('$paho', [
    '$rootScope', '$q',
    function ($rootScope, $q) {

      var pahoClients = {}

      this.connect = function (name, region, endpoint, credentials) {

        var dfd = $q.defer()

        var iotSignUtil = AWSIoTSign.getUtil(region, endpoint, credentials)

        var promise = $q(function(resolve, reject) {
          iotSignUtil.getSignedUrl(15, function (err, url){
              if (!err) {
                resolve(url);
              } else {
                reject(err);
              }
            })
        })

        promise.then(function(url) {
          pahoClients[name] = new Paho.MQTT.Client(url, 'mqtt-client-' + (Math.floor((Math.random() * 100000) + 1)))  

          var connectOptions = {
              onSuccess: function(invocationContext){
                dfd.resolve({topic: 'connack', invocationContext: invocationContext})
              },
              useSSL: true,
              timeout: 3,
              mqttVersion: 4,
              onFailure: function(invocationContext, errorCode, errorMessage) {
                dfd.reject({topic: 'connfail', invocationContext: invocationContext})
              }
          };
          pahoClients[name].connect(connectOptions);

        }, function(reason) {
          console.log('getSignedUrl Failed: ' + reason);
        })

        return dfd.promise
      }

      this.subscribe = function (name, topic, qos) {
        var dfd = $q.defer()

        if (pahoClients[name]) {
          if (pahoClients[name].isConnected()){
            pahoClients[name].subscribe(topic, {
              qos: qos,
              timeout: 1,
              onSuccess: function(invocationContext){
                dfd.resolve({topic: 'subscribed', invocationContext: invocationContext})
              },
              onFailure: function(invocationContext, errorCode, errorMessage) {
                dfd.reject({invocationContext: invocationContext, errorCode: errorCode, errorMessage: errorMessage})
              }
            })
          } else {
            dfd.reject('Not connected to AWS IoT MQTT Broker.');  
          }
        } else {
          dfd.reject('Paho Client does not exist: ' + name);
        }

        return dfd.promise
      }

      this.received = function (name) {
        var dfd = $q.defer()

        if (pahoClients[name]) {
          if (pahoClients[name].isConnected()){
            pahoClients[name].onMessageArrived = function(message) {
              dfd.notify({message: message})
            };
          }
        }

        return dfd.promise
      }


      this.send = function (name, topic, body) {
        if (pahoClients[name]) {
          if (pahoClients[name].isConnected()){
            var message = new Paho.MQTT.Message(body)
            message.destinationName = topic
            pahoClients[name].send(message)
          }
        }
      }
/*
      this.disconnect = function (name) {
        var dfd = $q.defer()

        pahoClients[name].end(true, dfd.resolve)

        return dfd.promise
      }


      this.unsubscribe = function (name, topic) {

        var dfd = $q.defer()

        if (pahoClients[name]) {
          if (pahoClients[name].connected){
            pahoClients[name].unsubscribe(topic, function (err) {
              if (err) {
                dfd.reject(err)
              } else {
                dfd.resolve({subscribedTopics: pahoClients[name]._subscribedTopics})
              }
            })
          }
        }

        return dfd.promise
      }



*/
    }]
  )
}))
