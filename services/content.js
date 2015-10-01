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
var R = require('ramda');
var Q = require('q');

var content = {
    getContent: function(community, contentId){
        var url =env.jive.apiBaseUrl+'/contents/'+contentId;
        logger.debug("getContent for:" + url );
        return jive.community.doRequest(community, {url: url,
            method: "GET"});
    },
    updateContent: function(community, contentId, jiveContent) {
        logger.debug("updateContent for contentId: " + contentId);
        logger.debug(jiveContent);
        return this.getContent(community, contentId)
            .then(function (successResponse) {
                var existingContent = successResponse.entity;
                logger.debug('getContent: Retrieved content successfully', existingContent);
                var mergedContent = R.merge(existingContent, jiveContent);
                logger.debug('updateContent: Merged Content', mergedContent);
                return jive.community.doRequest(community,
                    {
                        url: env.jive.url + "/api/core/v3/contents/" + contentId,
                        "method": "PUT",
                        "postBody": mergedContent,
                        "minor": "true"
                    });
            }, function (errorResp) {
                var deferred = Q.defer();
                logger.error("Content with contentId:" + contentId + " not found.");
                logger.error(errorResp);
                deferred.reject(errorResp);
                return deferred.promise;
            });
    }
};


module.exports = content;