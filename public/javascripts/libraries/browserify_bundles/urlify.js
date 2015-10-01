//This file is created using browserify node module to require urlify node module on client side

require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
function extend(base) {
	for(var i = 1; i < arguments.length; i++) {
		var extension = arguments[i];
		if(typeof extension === 'object')
			for(var key in extension)
				base[key] = extension[key];
	}
	return base;
}

var regExpPattern= new RegExp(
	'(\\' + [
		'/', '.', '*', '+', '?', '|',
		'(', ')', '[', ']', '{', '}', '\\'
		].join('|\\') + ')', 'g'
);

function trim(text, seq) {
	var pattern = seq.replace(regExpPattern, '\\$1');
	return text
		.replace(new RegExp("^"+pattern), "")
		.replace(new RegExp(pattern+"$"), "")
		.replace(new RegExp("("+pattern+"){2,}", "g"), seq);
}

var setImmediate = function(cb) { cb(); };
if(typeof process !== 'undefined' && typeof process.nextTick === 'function') {
	setImmediate = process.nextTick;
}

var whitespace = /\s/g;
var nonAlphaNum = /[^a-z0-9-]/gi;

var umlautsWithE = {
	'Ä': 'Ae',
	"ä": "ae",
	'Ö': 'Oe',
	"ö": "oe",
	"ü": "ue",
	'Ü': 'Ue'
};

var szToSs = {
	'ß': 'ss'
};

var accents = {
	'À': 'A',
	'Á': 'A',
	'Â': 'A',
	'Ã': 'A',
	'Ä': 'A',
	'Å': 'AA',
	'Æ': 'AE',
	'Ç': 'C',
	'Č': 'C',
	'Ď': 'D',
	'È': 'E',
	'É': 'E',
	'Ě': 'E',
	'Ê': 'E',
	'Ë': 'E',
	'Ì': 'I',
	'Í': 'I',
	'Î': 'I',
	'Ï': 'I',
	'Ð': 'D',
	'Ł': 'L',
	'Ň': 'N',
	'Ñ': 'N',
	'Ò': 'O',
	'Ó': 'O',
	'Ô': 'O',
	'Õ': 'O',
	'Ö': 'O',
	'Ř': 'R',
	'Š': 'S',
	'Ś': 'S',
	'Ť': 'T',
	'Ø': 'OE',
	'Ù': 'U',
	'Ú': 'U',
	'Ü': 'U',
	'Û': 'U',
	'Ý': 'Y',
	'Ž': 'Z',
	'Þ': 'Th',
	'ß': 'sz',
	'à': 'a',
	'á': 'a',
	'â': 'a',
	'ã': 'a',
	'ä': 'a',
	'å': 'aa',
	'æ': 'ae',
	'ą': 'a',
	'ç': 'c',
	'č': 'c',
	'ď': 'd',
	'è': 'e',
	'é': 'e',
	'ê': 'e',
	'ě': 'e',
	'ë': 'e',
	'ì': 'i',
	'í': 'i',
	'î': 'i',
	'ï': 'i',
	'ð': 'd',
	'ł': 'l',
	'ñ': 'n',
	'ń': 'n',
	'ň': 'n',
	'ò': 'o',
	'ó': 'o',
	'ô': 'o',
	'õ': 'o',
	'ō': 'o',
	'ö': 'o',
	'ø': 'oe',
	'ř': 'r',
	'š': 's',
	'ś': 's',
	'ť': 't',
	'ù': 'u',
	'ú': 'u',
	'û': 'u',
	'ū': 'u',
	'ü': 'u',
	'ý': 'y',
	'þ': 'th',
	'ÿ': 'y',
	'ż': 'z',
	'ž': 'z',
	'Œ': 'OE',
	'œ': 'oe',
	'&': 'and',
	'ı': 'i',
	'ş': 's',
	'ğ': 'g',
	'Ş': 'S',
	'Ğ': 'g',
	'İ': 'I'
};

var cyrillic = {
	'а':'a',
	'б':'b',
	'в':'v',
	'г':'g',
	'д':'d',
	'е':'e',
	'ё':'yo',
	'ж':'zh',
	'з':'z',
	'и':'i',
	'й':'j',
	'к':'k',
	'л':'l',
	'м':'m',
	'н':'n',
	'о':'o',
	'п':'p',
	'р':'r',
	'с':'s',
	'т':'t',
	'у':'u',
	'ф':'f',
	'х':'h',
	'ц':'c',
	'ч':'ch',
	'ш':'sh',
	'щ':'sh',
	'ъ':'',
	'ы':'y',
	'ь':'',
	'э':'e',
	'ю':'yu',
	'я':'ya',
	'А':'A',
	'Б':'B',
	'В':'V',
	'Г':'G',
	'Д':'D',
	'Е':'E',
	'Ё':'Yo',
	'Ж':'Zh',
	'З':'Z',
	'И':'I',
	'Й':'J',
	'К':'K',
	'Л':'L',
	'М':'M',
	'Н':'N',
	'О':'O',
	'П':'P',
	'Р':'R',
	'С':'S',
	'Т':'T',
	'У':'U',
	'Ф':'F',
	'Х':'H',
	'Ц':'C',
	'Ч':'Ch',
	'Ш':'Sh',
	'Щ':'Sh',
	'Ъ':'',
	'Ы':'Y',
	'Ь':'',
	'Э':'E',
	'Ю':'Yu',
	'Я':'Ya'
};

function apply(str, map) {
	var result = []
	for(var i = 0; i < str.length; i++) {
		var repl = map[str[i]];
		result.push(repl === undefined ? str[i] : repl)
	}
	return result.join("");
}

exports.create = function(options) {
	var defaults = extend({
		addEToUmlauts:false,
		szToSs:true,
		spaces:"_",
		toLower:false,
		nonPrintable:"_",
		trim:false,
		extendString:false,
		failureOutput:"non-printable"
	}, options);

	var urlify = function(string, options, cb) {
		if(string == '')
			return '';
		if(typeof options === 'function') {
			cb = options;
			options = undefined;
		}

		if(cb) {
			var callee = arguments.callee;
			setImmediate(function() {
				cb(callee.call(0, string, options));
			});
			return;
		}

		options = extend({}, defaults, options);
		if(options.szToSs === true)
			string = apply(string, szToSs);
		if(options.addEToUmlauts === true)
			string = apply(string, umlautsWithE)
		string = apply(string, accents);
		string = apply(string, cyrillic);

		string = string.replace(nonAlphaNum, function(occ) {
			return occ.search(whitespace) !== -1
				? options.spaces
				: options.nonPrintable;
		});
		if(options.trim !== false) {
			string = trim(string, options.nonPrintable);
			string = trim(string, options.spaces);
		}
		if(string == "")
			return options.failureOutput;
		return (options.toLower === true) ? string.toLowerCase() : string;
	}

	if(defaults.extendString === true)
		String.prototype.urlify = function(options) {
			return urlify(this, options)
		};
	return urlify;
}

}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"urlify":[function(require,module,exports){
module.exports = require('./lib/urlify');

},{"./lib/urlify":1}]},{},[]);
