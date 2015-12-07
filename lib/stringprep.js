'use strict';

var punycode = require('punycode');

try {
    var StringPrep = require('node-stringprep');

    // We still might not be able to use proper StringPrep,
    // so we create a test instance and check if the native
    // option is available.
    exports.available = new StringPrep.StringPrep('nodeprep').isNative();
    
    exports.toUnicode = function (data) {
        return punycode.toUnicode(StringPrep.toUnicode(data));
    };
    
    exports.nameprep = function (str) {
        var prep = new StringPrep.StringPrep('nameprep');
        return prep.prepare(str);
    };
    
    exports.nodeprep = function (str) {
        var prep = new StringPrep.StringPrep('nodeprep');
        return prep.prepare(str);
    };
    
    exports.resourceprep = function (str) {
        var prep = new StringPrep.StringPrep('resourceprep');
        return prep.prepare(str);
    };
} catch (err) {
    exports.available = false;
    
    exports.toUnicode = punycode.toUnicode;
    
    exports.nameprep = function (str) {
        return str.toLowerCase();
    };
    
    exports.nodeprep = function (str) {
        return str.toLowerCase();
    };
    
    exports.resourceprep = function (str) {
        return str;
    };
}
