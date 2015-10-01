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
var jiveWrapper = {
    getCurrentPlaceContext: function () {
        var deferred = Q.defer();
        var JIVE_GROUP_IDENTIFIER = 700;
        var JIVE_SPACE_IDENTIFIER = 14;
        osapi.jive.core.container.getLaunchContext(function (selection) {
            var containerId = selection.jive.content.id;
            var containerType = selection.jive.content.type == "osapi.jive.core.Group" ? JIVE_GROUP_IDENTIFIER : JIVE_SPACE_IDENTIFIER;

            osapi.jive.corev3.places.get({entityDescriptor: [containerType, containerId]})
                .execute(function (osapiResponse) {
                    deferred.resolve(osapiResponse.list[0].resources.self.ref);
                });
        });
        return deferred.promise;
    },

    getCurrentPlace: function () {
        var deferred = Q.defer();
        var JIVE_GROUP_IDENTIFIER = 700;
        var JIVE_SPACE_IDENTIFIER = 14;
        osapi.jive.core.container.getLaunchContext(function (selection) {
            var containerId = selection.jive.content.id;
            var containerType = selection.jive.content.type == "osapi.jive.core.Group" ? JIVE_GROUP_IDENTIFIER : JIVE_SPACE_IDENTIFIER;

            osapi.jive.corev3.places.get({entityDescriptor: [containerType, containerId]})
                .execute(function (place) {
                    deferred.resolve(place.list[0]);
                });
        });
        return deferred.promise;
    },

    getContent: function (placeUrl, contentTypesToDisplay, itemsPerPage, sortBy, paginationIndex, authorFilter) {

        var deferred = Q.defer();
        var apiUrl = '/contents?filter=place('+ placeUrl
            +')&startIndex='+ paginationIndex
            +'&count='+ itemsPerPage
            +'&sort=' + sortBy
            +'&filter=type('+contentTypesToDisplay.join()+')'
            +'&includeBlogs=true';
        if (authorFilter)
            apiUrl = apiUrl + '&filter=author(' + authorFilter +')'
        osapi.jive.core.get({
            v: "v3",
            href: apiUrl
        }).execute(function (response) {
            if (response.error) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
        })
        return deferred.promise;
    },

    deleteContent: function (contentId) {
        var deferred = Q.defer();
        var content_url = opensocial.getEnvironment()['jiveUrl'] + "/api/core/v3/contents/" + contentId
        osapi.jive.corev3.contents.get({"uri": content_url}).execute(function (content) {
            content.destroy().execute(function (response) {
                if (response.error)
                    deferred.reject(response.error);
                else
                    deferred.resolve(response);
            })
        });
        return deferred.promise;
    },

    updateContentParentPlace: function (contentId, targetPlaceUrl, targetPlaceBlogUrl) {
        var deferred = Q.defer();
        var content_url = opensocial.getEnvironment()['jiveUrl'] + "/api/core/v3/contents/" + contentId
        osapi.jive.corev3.contents.get({"uri": content_url}).execute(function (content) {
            content.parent = (content.type == 'post') ? targetPlaceBlogUrl : targetPlaceUrl;
            content.categories = [];
            content.update({"minor": "true"}).execute(function (response) {
                if (response.error) {
                    if (response.error.code == "peopleNotActiveAccount") {
                        delete content.authors;
                        content.update({"minor": "true"}).execute(function (resp) {
                            if (resp.error)
                                deferred.reject(resp.error)
                            else
                                deferred.resolve();
                        })
                    } else {
                        deferred.reject(response.error)
                    }
                }
                else
                    deferred.resolve();
            })
        });
        return deferred.promise;
    },

    getContentTypesSupportedByCurrentPlace: function () {
        var deferred = Q.defer();
        var JIVE_GROUP_IDENTIFIER = 700;
        var JIVE_SPACE_IDENTIFIER = 14;
        osapi.jive.core.container.getLaunchContext(function (selection) {
            var containerId = selection.jive.content.id;
            var containerType = selection.jive.content.type == "osapi.jive.core.Group" ? JIVE_GROUP_IDENTIFIER : JIVE_SPACE_IDENTIFIER;

            osapi.jive.corev3.places.get({entityDescriptor: [containerType, containerId]})
                .execute(function (osapiResponse) {
                    deferred.resolve(osapiResponse.list[0].contentTypes);
                });
        });
        return deferred.promise;
    },

    isSuperAdmin: function () {
        var deferred = Q.defer();
        osapi.jive.corev3.securityGroups.get({"id": "1001"}).execute(function (data) {
            if (data.status != '403' && data.type && data.type.toUpperCase() == 'SECURITYGROUP') {
                deferred.resolve(true);
            } else {
                deferred.reject(false);
            }
        });
        return deferred.promise;
    },
    getCurrentUser: function () {
        var deferred = Q.defer();
        osapi.people.getViewer().execute(
            function (currentUser) {
                deferred.resolve(currentUser.id);
            },
            function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    },
    isGroupAdmin: function (place, personUrl) {
        var deferred = Q.defer();
        osapi.jive.core.get({
            v: "v3",
            href: '/members/places/' + place.placeID + '?state=owner&filter=person(' + personUrl + ')'
        }).execute(function (response) {
            response.list.length != 0 ? deferred.resolve() : deferred.reject()
        });
        return deferred.promise;
    },

    hasAccess: function (place, personUrl) {
        var deferred = Q.defer();
        jiveWrapper.isSuperAdmin().then(function(){
            deferred.resolve();
        });
        if (place.groupType == "OPEN") {
            deferred.resolve(true)
        }else{
            osapi.jive.core.get({
                v: "v3",
                href: '/members/places/' + place.placeID + '?filter=person(' + personUrl + ')'
            }).execute(function (response) {
                response.list.length != 0 ? deferred.resolve() : deferred.reject()
            });
        }
        return deferred.promise;
    }
}


