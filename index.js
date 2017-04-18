var IBMIoT = require('./iot.js'), 
    Droid = require('./droid.js'), 
    Brain = require('./brain.js');

function withEar(droid, bb8, handler) {

    var config = {
        // place your configurations here
        "org" : "",
        "id" : "",
        "domain": "internetofthings.ibmcloud.com",
        "auth-key" : "",
        "auth-token" : ""
    };

    var iot = new IBMIoT.AppService(config);
    iot.connect({
        onConnected: function() {
            console.log('### Subscriber.Connected ###');
            bb8.color('white', handler);
            iot.subscribe('Robot', 'Robot', 'Run');
        }, 
        onDeviceEvent: function(deviceType, deviceId, eventType, format, payload) {
            console.log('### appService.DeviceEvent ###');

            var command = JSON.parse(payload);
            console.log(command);

            switch(command.action) {
                case '#spin':
                    bb8.setHeading(45);
                    break;
                case '#turn':
                    bb8.setHeading(90);
                    break;
                case '#color':
                    bb8.randomColor(handler);
                    break;
                case '#run':
                    bb8.roll(150, 0);
			        setTimeout(function(){
                        bb8.stop(handler);
			        }, 3000);
                    break;
                case '#back':
                    bb8.roll(150, 180);
                    setTimeout(function(){
                        bb8.stop();
                    }, 3000);
                    break;
            }
        }
    });
}

function initDroid(callback) {
    // Michael's bb8 by default
    var droid = new Droid('4bffadbe51124d2c832f46f4ade1ff86');
    droid.connect({
        onConnected: function(bb8, handler) {
            bb8.startCalibration();
            callback(droid, bb8, handler);
        }
    });
}

initDroid(withEar);

function withMouth(think) {
    var config = {
        // place your configurations here
        "org" : "",
        "id" : "",
        "domain": "",
        "auth-key" : "",
        "auth-token" : ""
    };

    var iot = new IBMIoT.AppService(config);
    iot.connect({
        onConnected: function() {
            console.log('### Publisher.Connected ###');

            iot.publish({
                type: 'Controller',
                id: 'Mind', 
                event: 'Run', 
                data: { connect: true }
            });

            think.on('blink', function (data) {
                console.log('### blink ###');
                data.blink = true;
                iot.publish({
                    type: 'Controller',
                    id: 'Mind', 
                    event: 'Run', 
                    data: data
                });
            });

            think.on('data', function (data) {
                console.log('### data ###');
                data.data = true;
                iot.publish({
                    type: 'Controller',
                    id: 'Mind', 
                    event: 'Run', 
                    data: data
                });
            });
        }
    });
}

function initBrain(callback) {
    var brain = new Brain();
    var think = brain.think();
    callback(think);
}

initBrain(withMouth);