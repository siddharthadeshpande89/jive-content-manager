/*
 This file is part of ContentManager.

 ContentManager is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 ContentManager is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with ContentManager.  If not, see <http://www.gnu.org/licenses/>.
 */
var winston = require('winston');
var req = require(process.cwd() + '/require-from-app-root').req;
var env = req('config').config;

var log_file = env.logFile || "jive_admin_add_ons.log";

var logFileName = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();

winston.add(winston.transports.File, { filename: log_file, json: true });

if (process.env.NODE_ENV === 'test') {
    winston.remove(winston.transports.Console)
}

var log = function(level, title, message) {
    message = (message instanceof Array || typeof(message) === 'string') ? message : JSON.stringify(message)
    if (title) {
        message = title+' : ' +message;
    }
    winston.log(level, message)
}

module.exports = function() {
    return {
        info: function(title, message) {
            log('info', title, message)
        },
        debug: function(title, message) {
            log('debug', title, message)
        },
        error: function(title, message) {
            log('error', title, message)
        }
    }
}
