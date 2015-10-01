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
var env = req('env.json');

module.exports.getPeopleServiceUrlFor = function (userid) {
    return env.jive.apiBaseUrl + "/people/" + userid;
};

module.exports.getStreamsServiceUrlFor = function (userid) {
    return  env.jive.apiBaseUrl + "/people/" + userid + "/streams";
}

module.exports.getGroupMembersServiceUrlFor = function (groupid) {
    return  env.jive.apiBaseUrl + "/members/places/" + groupid;
}

module.exports.getPlaceServiceUrlFor = function (groupid) {
    return env.jive.apiBaseUrl + '/places/' + groupid;
}

module.exports.getDirectMessageServiceUrl = function () {
    return env.jive.apiBaseUrl + '/dms';
}

module.exports.getPlaceServiceUrl = function() {
    return env.jive.apiBaseUrl+'/places';
}

module.exports.getTagUrl = function() {
    return env.jive.apiBaseUrl+'/search/tags';
}

module.exports.getContentUrl = function(contentID) {
    return env.jive.apiBaseUrl+'/contents/' + contentID;
};

