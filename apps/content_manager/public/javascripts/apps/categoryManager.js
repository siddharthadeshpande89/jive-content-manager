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
var CategoryManager = function() {
    var openCategoryEditor = function () {
        var onOpenActions = function(){
            $('.ui-dialog-buttonset').css('float','left');
            $('.ui-dialog-buttonset').append('<span id="category-message"></span>')
            $('.ui-dialog-titlebar').css({background:'transparent',border:'none'});
            populateCategories();
        };

        var updateCategoriesEvent = function(button){
            if(getAllSelectedCategories().length!==0){
                $(button).submit(updateCategories(getAllSelectedCategories()).then(function(res){
                    logCategoryUpdate(res).then(function(){
                        if(res.failedIds.length==0){
                            messageHandler.displayInfoMessage('Selected contents updated successfully');
                        }else{
                            messageHandler.displayErrorMessage('Something went wrong. Please try again.')
                        }
                    });
                }));
                $(button).dialog('close');
                $("#spinner").show();
            }else{
                messageHandler.displayCategoryErrorMessage('You have not selected any category')
            }
        } ;

        validator.validateIfContentSelected(viewHandler.getSelectedContentIds())
            .then(function () {
                $('#categoryManager').show();
                $("#categoryManager").dialog({
                    autoOpen: true,
                    resize: 'auto',
                    width : 'auto',
                    height : 230,
                    minWidth : 400,
                    maxHeight:300,
                    modal: true,
                    position: ['top',100],
                    open: function () {
                        onOpenActions();
                    },
                    buttons: [{
                        text: "Update Categories",
                        "class": 'ui-button-icon-primary primary-btn',
                        click: function() {
                            updateCategoriesEvent(this);
                        }
                    },
                        {
                            text: "Cancel",
                            "class": 'ui-button-icon-primary cancel-btn',
                            click: function() {
                                $(this).dialog("close");
                                removeAllCategories();
                            }
                        }],
                    close: function () {
                        removeAllCategories();
                    }
                });
            }, function () {
                messageHandler.displayErrorMessage('No content selected')
            });
        ;
    }

    var logCategoryUpdate = function(logs){
        var q = Q.defer();
        var logInfo = {app:'BulkCategoriesUpdate',user:currentUserUrl.split('/').slice(-1)[0],sourceGroup:sourcePlaceUrl,successIds:logs.successIds,failedIds:logs.failedIds};
        logger.generateLoggerRequest('INFO',logInfo).execute(function (response) {
            q.resolve();
        },function(err){q.reject()});
        return q.promise;
    }

    var removeAllCategories = function(){
        $('.category-list li').remove();
    };

    var getGroupCategories = function(){
        var deferred = Q.defer();
        osapi.jive.core.get({
            v: "v3",
            href: "/places/"+_.last(sourcePlaceUrl.split('/'))+"/categories"
        }).execute(function (response) {
            var categoryNames = _.map(response.list, function(c){
                return c["name"];
            });
            deferred.resolve(categoryNames);
        });
        return deferred.promise;
    }

    var populateCategories = function(){
        removeAllCategories();
        getGroupCategories().then(function(categories){
            if(categories.length==0){
                $('button:contains("Update Categories")').hide();
                $('.category-list').append('<li>There are no categories associated to this group. Add via Manage->Categories</li>');
                $('button>span:contains("Cancel")').text('Close')
            }else {
                _.unique(categories).forEach(function (category) {
                    $('.category-list').append('<li><input type="checkbox" style="vertical-align: top" value="'+category+'"><label>' + category + '</label></li>');
                })
            }
        });
    }
    var logCategoryUpdate = function(logs){
        var q = Q.defer();
        var logInfo = {app:'BulkCategoryUpdate',user:currentUserUrl.split('/').slice(-1)[0],sourceGroup:sourcePlaceUrl,successIds:logs.successIds,failedIds:logs.failedIds};
        logger.generateLoggerRequest('INFO',logInfo).execute(function (response) {
            q.resolve();
        },function(err){q.reject()});
        return q.promise;
    }

    var getAllSelectedCategories = function () {
       return _.map($('.category-list input[type=checkbox]:checked'), function(c){
            return c["value"];
        });
    }

    var updateCategories = function (categories) {
        var deferred = Q.defer();
        var selectedContentIds = viewHandler.getSelectedContentIds();
        var result = {'successIds':[],'failedIds':[]}
        var counter = 1;
        _.forEach(selectedContentIds, function (contentId) {
                var existingCategories = [];
                osapi.jive.core.get({
                    v: "v3",
                    href: "/contents/" + contentId + ""
                }).execute(function (response) {
                    existingCategories = response.categories;
                    osapi.jive.connects.post({
                        authz: "signed",
                        alias: "contentService",
                        headers: {"Content-Type": "application/json"},
                        format: 'json',
                        href: '/updateContent',
                        body: {jiveContent: {'categories':_.union(categories,existingCategories)}, contentId: contentId}
                    }).execute(function (response) {
                        if(response.error){
                            result.failedIds.push(contentId);
                        }else{
                            result.successIds.push(contentId);
                        }
                        if(counter==selectedContentIds.length){
                            deferred.resolve(result);
                            $("#spinner").hide()
                        }
                        counter++;
                    },function(error){
                        result.failedIds.push(contentId);
                        if(counter==selectedContentIds.length){
                            deferred.resolve(result);
                            $("#spinner").hide()
                        }
                        counter++;
                    });
                });
            }
        )
        return deferred.promise;
    }

    return {
        openCategoryEditor:openCategoryEditor
    }
}
