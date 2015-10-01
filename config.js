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
var lodash = require('lodash');
var req = require(process.cwd() + '/require-from-app-root').req;
var env = req('./env.json');
exports.config = function () {
    if (process.env.auth) {
        env = lodash.merge(env, JSON.parse(process.env.auth));
    }
    console.log("***env***", env)
    return env;
}();
