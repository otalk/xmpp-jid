'use strict';

var punycode = require('punycode');


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
