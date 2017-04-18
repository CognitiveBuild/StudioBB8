var net = require('net'),
    events = require('events'),
    util = require('util');

var ThinkGearClient = function (opts) {
    opts || (opts = {});

    this.port = opts.port || 13854;
    this.host = opts.host || 'localhost';

    var enableRawOutput = !!opts.enableRawOutput;

    this.config = {
        enableRawOutput: enableRawOutput,
        format: "Json"
    };

    events.EventEmitter.call(this);
};

util.inherits(ThinkGearClient, events.EventEmitter);

ThinkGearClient.prototype.connect = function () {
    var self = this;

    var client = this.client = net.connect(this.port, this.host, function () {
        client.write(JSON.stringify(self.config));
    });

    client.on('data', function (data) {
        try {
            var json = JSON.parse(data.toString());
            if (json['rawEeg']) {
                self.emit('raw', json);
            } else if (json['blinkStrength']) {
                self.emit('blink', json);
            } else {
                self.emit('data', json);
            }
        } catch (e) {
            self.emit('error', data.toString());
        }
    });
};

var Brain = function () {
    var brain = new ThinkGearClient({

    });
    return {
        think: function () {
            brain.connect();
            return brain;
        }
    };
}

module.exports = Brain;