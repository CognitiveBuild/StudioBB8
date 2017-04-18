var iotClient = require('ibmiotf'), 
    utility = require('./utility.js');

var deviceService = function(config) {

    var deviceClient = new iotClient.IotfDevice(config);
    var methods = {
        connect: function(options) {

            var defaultOptions = {
                logLevel: 'trace', 
                onConnected: function() {
                    console.log('### deviceService.Connected ###');
                }, 
                onReConnected: function() {
                    console.log('### deviceService.Re-connected ###');
                }, 
                onDisConnected: function() {
                    console.log('### deviceService.Disconnected ###');
                }, 
                onError: function(argument) {
                    console.log('### deviceService.Error ###');
                    console.log(argument);
                    console.log('### /deviceService.Error ###');
                }
            };
            var o = utility.extend(defaultOptions, options);

            console.log('### deviceService.Connecting... ###');
            deviceClient.log.setLevel(o.logLevel);
            deviceClient.connect();

            deviceClient.on('connect', o.onConnected);

            deviceClient.on('reconnect', o.onReConnected);

            deviceClient.on('disconnect', o.onDisConnected);

            deviceClient.on('error', o.onError);

            return this;
        }, 
        publish: function(options) {
            var defaultOptions = {
                type: 'status',
                format: 'json', 
                data: {  }
            };
            var o = utility.extend(defaultOptions, options);

            console.log('### deviceService.Publishing ###');
            console.log(JSON.stringify(o.data));
            console.log('### /deviceService.Publishing ###');

            deviceClient.publish(o.type, o.format, JSON.stringify(o.data));

            return this;
        }, 
        disconnect: function() {
            deviceClient.disconnect();
        }
    };
    return methods;
};

var appService = function(config) {

    var deviceClient = new iotClient.IotfApplication(config);
    var methods = {
        connect: function(options) {

            var defaultOptions = {
                logLevel: 'error', 
                onConnected: function() {
                    console.log('### appService.Connected ###');
                }, 
                onReConnected: function() {
                    console.log('### appService.Re-connected ###');
                }, 
                onDisConnected: function() {
                    console.log('### appService.Disconnected ###');
                }, 
                onError: function(argument) {
                    console.log('### appService.Error ###');
                    console.log(argument);
                    console.log('### /appService.Error ###');
                }, 
                onDeviceEvent: function(deviceType, deviceId, eventType, format, payload) {
                    console.log('### appService.DeviceEvent ###');
                    console.log(deviceType, deviceId, eventType, format);
                    console.log(payload);
                    console.log('### /appService.DeviceEvent ###');
                }
            };
            var o = utility.extend(defaultOptions, options);

            console.log('### appService.Connecting... ###');
            deviceClient.log.setLevel(o.logLevel);
            deviceClient.connect();

            deviceClient.on('connect', o.onConnected);

            deviceClient.on('reconnect', o.onReConnected);

            deviceClient.on('disconnect', o.onDisConnected);

            deviceClient.on('error', o.onError);

            deviceClient.on('deviceEvent', o.onDeviceEvent);

            return this;
        }, 
        subscribe: function(deviceType, deviceId, eventType) {
            deviceClient.subscribeToDeviceEvents(deviceType, deviceId, eventType, "json");
        }, 
        publish: function(options) {
            var defaultOptions = {
                type: 'type', 
                id: 'id',
                event: 'event',

                format: 'json', 
                data: {  }
            };
            var o = utility.extend(defaultOptions, options);

            console.log('### deviceService.Publishing ###');
            console.log(JSON.stringify(o.data));
            console.log('### /deviceService.Publishing ###');

            deviceClient.publishDeviceEvent(o.type, o.id, o.event, o.format, JSON.stringify(o.data));

            return this;
        },
        disconnect: function() {
            deviceClient.disconnect();
        }
    };
    return methods;
};

module.exports = { DeviceService: deviceService, AppService: appService };
