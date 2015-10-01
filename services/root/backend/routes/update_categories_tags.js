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
var jive = require('jive-sdk');
var req = require(process.cwd() + '/require-from-app-root').req;
var env = req('config').config;
var logger = req('utils/logger');
var content = req('services/content');

exports.updateContent = {
    'path': '/updateContent',
    'verb': 'post',
    'route': function (req, res) {
        var jiveContent = req.body.jiveContent;
        var contentId = req.body.contentId;
        logger.debug("contentId",contentId);
        logger.debug("jiveContent",jiveContent);
        logger.debug("Parsed jiveContent",jiveContent);
        jive.context.persistence.findByID("community", env.jive.url)
            .then(function (community) {
                logger.debug("Community in explicit routes");
                logger.debug(community);
                content.updateContent(community, contentId, jiveContent)
                    .then(function(resp){
                        res.writeHead(200);
                        res.end();
                    },function(err){
                        logger.error("Error while updating the jiveContent for contentId: " + contentId);
                        logger.error(err);
                        res.writeHead(400);
                        res.end();
                    });
            });
    }
};

