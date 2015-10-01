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
var Validator = function () {
    var targetPlaceNotSelected = function (targetPlaceId) {
        return  _.isEmpty(targetPlaceId);
    }

    var sourceAndTargetPlacesAreSame = function (sourcePlaceId,targetPlaceId) {
        return _.isEqual(sourcePlaceId,targetPlaceId)
    };
    var validateSelectedPlacesAndContent = function (sourcePlaceId, targetPlaceId) {

        var deferred = Q.defer();
        if (targetPlaceNotSelected(targetPlaceId)) {
            deferred.reject("Please select a target place");
        }
        else if (sourceAndTargetPlacesAreSame(sourcePlaceId,targetPlaceId)) {
            deferred.reject("Target place should not be same as source");
        }else{
            deferred.resolve(true);
        }
        return deferred.promise;
    }
    var validateIfContentSelected = function (contentIds) {
        var deferred = Q.defer();
        if (contentIds.length == 0) {
            deferred.reject("No content selected");
        } else {
            deferred.resolve(true);
        }

        return deferred.promise;
    }
    var validateEmptyTag = function(tag) {
        if(tag=='')
            return true;
        return false;
    }
    var validateTagAlreadyPresent = function(tags,tag) {
        if (_.indexOf(tags, tag) == -1)
            return false;
        return true;
    }

    return {
        validateSelectedPlacesAndContent: validateSelectedPlacesAndContent,
        validateIfContentSelected: validateIfContentSelected,
        validateTagAlreadyPresent: validateTagAlreadyPresent,
        validateEmptyTag : validateEmptyTag
    }

}
