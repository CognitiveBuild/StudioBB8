var utility = {
    extend: function() {
        var length = arguments.length;

        for (var i = 1; i < length; i++) {
            for ( var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }
};

module.exports = utility;