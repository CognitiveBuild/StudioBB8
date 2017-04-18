var sphero = require('sphero'), 
    utility = require('./utility.js');
/**
 * Use a local machine to control bb8
 * - Laptop
 * - Mobile
 */
var Droid = function(sn) {

    var orb = sphero(sn);

    return {
        bb8: function() {
            return orb;
        }, 
        connect: function(options) {

            var defaultOptions = {
                onConnected: function(_bb8, _handler) {
                    console.log('### Connected ###');
                }, 
                onAnything: function(error, data){
                    if(error) {
                        console.error(error);
                        return;
                    }
                    console.log(data);
                }
            };

            var o = utility.extend(defaultOptions, options);

            console.log('### Connecting... ###');

            orb.connect(function() {
                console.log('### Hello World! ###');
                o.onConnected(orb, o.onAnything);
            });
        }, 
        disconnect: function() {
            orb.sleep(0, 0, 0, function(err, data) {
                console.log('### Sleeped ###');
                orb.disconnect(function(){
                    console.log('### Disconnected ###');
                });
            });
        }
    };
}

module.exports = Droid;