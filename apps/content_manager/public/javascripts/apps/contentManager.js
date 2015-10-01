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
var CONTENT_TYPES_SUPPORTED_BY_APP = ["blog", "document", "file", "idea", "poll", "video", "event","discussion"];
var contentTypesForCurrentPlace = [];
var sourcePlaceUrl='';
var targetPlaceUrl='';
var targetPlaceBlogUrl='';
var currentUserUrl='';
var moveContent = MoveContent();
var tagManager = TagManager();
var categoryManager = CategoryManager();
var delContent = DeleteContent();
var validator = Validator();
var MINIMUM_APP_HEIGHT= 400;

var resetTarget = function(){
    viewHandler.resetTarget()
}

var logger = {
    generateLoggerRequest : function(logType, logData){
        return osapi.jive.connects.post({
            authz: "signed",
            alias: "contentService",
            headers: {"Content-Type": "application/json"},
            format: 'json',
            href: '/myTwServices/logger',
            body: {logs: logData, logType: logType}
        });
    },
    logManageContentResult : function(callback){
        $(".content").ready(function(){
            var successIds = [];
            $(".content.alert-success").each(function(){
                successIds.push($(this).find('td input').attr('id'));
            });
            var failureIds = [];
            $(".content.alert-danger").each(function(){
                failureIds.push($(this).find('td input').attr('id'));
            });
            callback({successContentIds:successIds,failedContentIds:failureIds})
        });
    }
};

var displayContentInCurrentPlace = function (paginationIndex){
    $(".cm-actions").show();
    var setAppView = function(){
        viewHandler.resetContentList();
        viewHandler.setupMoveContentView();
    }

    var getContentTypesToDisplay = function(){
        return viewHandler.getContentTypesOptions()
    }

    var setupCurrentGroupContext = function() {
        var deferred = Q.defer();
        jiveWrapper.getCurrentPlaceContext().then(function (placeUrl) {
            sourcePlaceUrl = placeUrl;
            deferred.resolve();
        })
        return deferred.promise;
    }

    var getContentListJson = function (items) {
        return {
            contentList: _.map(items.list, function(item) {
                return {
                    "contentId": item.contentID,
                    "contentUrl": item.resources.html.ref,
                    "contentTitle": item.subject,
                    "contentType": item.type,
                    "contentAuthor": item.author.displayName,
                    "contentAuthorUrl": item.author.resources.html.ref,
                    "contentUpdatedDate": new Date(item.updated).toDateString()
                }
            })
        }
    };

    var showPaginationLinks = function(data, itemsPerPage) {
        var paginationJSON = {};
        if(!data)
                paginationJSON.prevIndex = (paginationIndex - itemsPerPage).toString() ;
        else{
            if (data.links && data.links.next){
                paginationJSON.nextIndex = (paginationIndex + itemsPerPage).toString();
            }else{
                $('#next-btn').css('backgroundColor','RED');
            }
            if (data.links && data.links.previous)
                paginationJSON.prevIndex = (paginationIndex - itemsPerPage).toString() ;
        }
        viewHandler.setupPaginationLinks(paginationJSON)
    }

    setAppView();
    setupCurrentGroupContext().then(function(){
        var itemsPerPage = viewHandler.itemsPerPage();
        var sortBy = viewHandler.sortByOption();
        var authorFilter = viewHandler.authorFilter() == "self"?currentUserUrl:"";

        if(!paginationIndex)
            paginationIndex=0;

        jiveWrapper.getContent(sourcePlaceUrl, getContentTypesToDisplay(), itemsPerPage, sortBy, paginationIndex, authorFilter)
            .then(
            function(data){
                if(data.list.length != 0) {
                    viewHandler.showContent(getContentListJson(data));
                    showPaginationLinks(data, itemsPerPage);
                    if(data.list.length < 8)
                        gadgets.window.adjustHeight(MINIMUM_APP_HEIGHT);
                    else
                        gadgets.window.adjustHeight();
                }
                else {
                    if(paginationIndex == 0) {
                        viewHandler.showContent({});
                        viewHandler.setupPaginationLinks({})
                    } else {
                        showPaginationLinks('', itemsPerPage);
                        viewHandler.showContent({});
                    }
                }
            },
            function(err){
                viewHandler.showContent({});
                viewHandler.setupPaginationLinks({})
            })
    })
};


var refreshContent = function(){
    displayContentInCurrentPlace();
}

var getSupportedContentTypes = function(contentTypes){
    // getting the right set of supported content types by checking place supported and app supported content types
    var supportedContentTypes= []
    _.forEach(contentTypes, function(n){
        if(n != 'blog') n = n.substring(0, n.length - 1);
        if(CONTENT_TYPES_SUPPORTED_BY_APP.indexOf(n) > -1) {
            if(n == 'blog')
                n = 'post';
            supportedContentTypes.push(n)

        }
    })
    return supportedContentTypes;

}



function setupEventHandlersAndDisplayData() {
    $("#deleteContent").click(delContent.deleteSelectedContent);
    $("#target_place_picker").click(moveContent.displayTargetPlacePicker);
    $("#refreshContent").click(refreshContent);
    $("#itemsPerPageOption").change(refreshContent);
    $("#authorFilterOption").change(refreshContent);
    $("#sortByOption").change(refreshContent);
    $("#selectAllContent").change(viewHandler.selectAllContent);
    $("#addTags").click(tagManager.openTagEditor);
    $("#updateCategories").click(categoryManager.openCategoryEditor)
    displayContentInCurrentPlace()
}

var setup  = function(){
    $("#move-content").show();
    jiveWrapper.getContentTypesSupportedByCurrentPlace().then(function(contentTypes){
        contentTypesForCurrentPlace = getSupportedContentTypes(contentTypes);

        if(contentTypes.length == 0){
            messageHandler.displayErrorMessage("No content type setup for this group")
        } else {
            viewHandler.setContentTypeButtonsWithHandlers(contentTypesForCurrentPlace, refreshContent);
            refreshContent()
            setupEventHandlersAndDisplayData();
        }
    })
}

$(document).ready(function(){
    window.prettyPrint() && prettyPrint();
    Q.all([jiveWrapper.getCurrentUser(), jiveWrapper.getCurrentPlace()]).spread(
        function(userId, place){
            currentUserUrl = opensocial.getEnvironment()['jiveUrl']+"/api/core/v3/people/"+userId
            jiveWrapper.isSuperAdmin().then(function(){
                setup();
            }, function(){
                jiveWrapper.isGroupAdmin(place, currentUserUrl).then(function(){
                        setup()
                    },function(){
                    viewHandler.disableAuthorFilterForGeneralUser()
                    setup()
                });
            })
        });
});

