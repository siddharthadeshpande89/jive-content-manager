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
var req = require(process.cwd() + '/require-from-app-root').req;
var env = req('config').config;
var jive = require('jive-sdk');
var logger = req('logger')();
var structuredLogger = req('utils/logger');
var fs = require('fs');
var Q = require('q');
var R = require('ramda');
var api = require('jive-api-client')(env.jive.url);

exports.eventLogger = {
    'path': '/myTwServices/logger',
    'verb': 'post',
    'route': function (req, res) {
        if(req.body.logType.toLowerCase() === 'error'){
            structuredLogger.error(req.body.logs);
        }
        if(req.body.logType.toLowerCase() === 'info'){
            structuredLogger.info(req.body.logs);
        }
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(JSON.stringify({}));
    }
};

