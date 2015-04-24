'use strict';

var StringPrep = require('./lib/stringprep');

// All of our StringPrep fallbacks work correctly
// in the ASCII range, so we can reliably mark
// ASCII-only JIDs as prepped.
var ASCII = /^[\x00-\x7F]*$/;



function bareJID(local, domain) {
    if (local) {
        return local + '@' + domain;
    }
    return domain;
}

function fullJID(local, domain, resource) {
    if (resource) {
        return bareJID(local, domain) + '/' + resource;
    }
    return bareJID(local, domain);
}


exports.prep = function (data) {
    var local = data.local;
    var domain = data.domain;
    var resource = data.resource;
    var unescapedLocal = local;

    if (local) {
        local = StringPrep.nodeprep(local);
        unescapedLocal = exports.unescape(local);
    }

    if (resource) {
        resource = StringPrep.resourceprep(resource);
    }

    if (domain[domain.length - 1] === '.') {
        domain = domain.slice(0, domain.length - 1);
    }

    domain = StringPrep.nameprep(domain.split('.').map(StringPrep.toUnicode).join('.'));

    return {
        prepped: data.prepped || StringPrep.available,
        local: local,
        domain: domain,
        resource: resource,
        bare: bareJID(local, domain),
        full: fullJID(local, domain, resource),
        unescapedLocal: unescapedLocal,
        unescapedBare: bareJID(unescapedLocal, domain),
        unescapedFull: fullJID(unescapedLocal, domain, resource)
    };
};

exports.parse = function (jid, trusted) {
    var local = '';
    var domain = '';
    var resource = '';

    trusted = trusted || ASCII.test(jid);

    var resourceStart = jid.indexOf('/');
    if (resourceStart > 0) {
        resource = jid.slice(resourceStart + 1);
        jid = jid.slice(0, resourceStart);
    }

    var localEnd = jid.indexOf('@');
    if (localEnd > 0) {
        local = jid.slice(0, localEnd);
        jid = jid.slice(localEnd + 1);
    }

    domain = jid;

    var preppedJID = exports.prep({
        local: local,
        domain: domain,
        resource: resource,
    });

    preppedJID.prepped = preppedJID.prepped || trusted;

    return preppedJID;
};

exports.equal = function (jid1, jid2, requirePrep) {
    jid1 = new exports.JID(jid1);
    jid2 = new exports.JID(jid2);
    if (arguments.length === 2) {
        requirePrep = true;
    }
    return jid1.local === jid2.local &&
           jid1.domain === jid2.domain &&
           jid1.resource === jid2.resource &&
           (requirePrep ? jid1.prepped && jid2.prepped : true);
};

exports.equalBare = function (jid1, jid2, requirePrep) {
    jid1 = new exports.JID(jid1);
    jid2 = new exports.JID(jid2);
    if (arguments.length === 2) {
        requirePrep = true;
    }
    return jid1.local === jid2.local &&
           jid1.domain === jid2.domain &&
           (requirePrep ? jid1.prepped && jid2.prepped : true);
};

exports.isBare = function (jid) {
    jid = new exports.JID(jid);

    var hasResource = !!jid.resource;

    return !hasResource;
};

exports.isFull = function (jid) {
    jid = new exports.JID(jid);

    var hasResource = !!jid.resource;

    return hasResource;
};

exports.escape = function (val) {
    return val.replace(/^\s+|\s+$/g, '')
              .replace(/\\5c/g, '\\5c5c')
              .replace(/\\20/g, '\\5c20')
              .replace(/\\22/g, '\\5c22')
              .replace(/\\26/g, '\\5c26')
              .replace(/\\27/g, '\\5c27')
              .replace(/\\2f/g, '\\5c2f')
              .replace(/\\3a/g, '\\5c3a')
              .replace(/\\3c/g, '\\5c3c')
              .replace(/\\3e/g, '\\5c3e')
              .replace(/\\40/g, '\\5c40')
              .replace(/ /g, '\\20')
              .replace(/\"/g, '\\22')
              .replace(/\&/g, '\\26')
              .replace(/\'/g, '\\27')
              .replace(/\//g, '\\2f')
              .replace(/:/g, '\\3a')
              .replace(/</g, '\\3c')
              .replace(/>/g, '\\3e')
              .replace(/@/g, '\\40');
};

exports.unescape = function (val) {
    return val.replace(/\\20/g, ' ')
              .replace(/\\22/g, '"')
              .replace(/\\26/g, '&')
              .replace(/\\27/g, '\'')
              .replace(/\\2f/g, '/')
              .replace(/\\3a/g, ':')
              .replace(/\\3c/g, '<')
              .replace(/\\3e/g, '>')
              .replace(/\\40/g, '@')
              .replace(/\\5c/g, '\\');
};


exports.create = function (local, domain, resource) {
    return new exports.JID(local, domain, resource);
};

exports.JID = function JID(localOrJID, domain, resource) {
    var parsed = {};
    if (localOrJID && !domain && !resource) {
        if (typeof localOrJID === 'string') {
            parsed = exports.parse(localOrJID);
        } else if (localOrJID._isJID || localOrJID instanceof exports.JID) {
            parsed = localOrJID;
        } else {
            throw new Error('Invalid argument type');
        }
    } else if (domain) {
        var trusted = ASCII.test(localOrJID) && ASCII.test(domain);
        if (resource) {
            trusted = trusted && ASCII.test(resource);
        }

        parsed = exports.prep({
            local: exports.escape(localOrJID),
            domain: domain,
            resource: resource,
            prepped: trusted
        });
    } else {
        parsed = {};
    }

    this._isJID = true;

    this.local = parsed.local || '';
    this.domain = parsed.domain || '';
    this.resource = parsed.resource || '';
    this.bare = parsed.bare || '';
    this.full = parsed.full || '';

    this.unescapedLocal = parsed.unescapedLocal || '';
    this.unescapedBare = parsed.unescapedBare || '';
    this.unescapedFull = parsed.unescapedFull || '';

    this.prepped = parsed.prepped;
};

exports.JID.prototype.toString = function () {
    return this.full;
};

exports.JID.prototype.toJSON = function () {
    return this.full;
};
