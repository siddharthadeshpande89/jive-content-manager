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
var MoveContent = function(){
    var displayTargetPlacePicker = function () {
        var setTargetPlaceNameAndUrl = function (place) {
            viewHandler.displayTargetPlaceName(place.name);
            jiveWrapper.hasAccess(place, currentUserUrl).done(function(){
                $('#moveContentConformation').dialog({
                    title : 'Move Content Confirmation',
                    resizable: false,
                    width:600,
                    height:200,
                    modal: true,
                    position: 'center',
                    open : function(){
                        $('.ui-dialog-titlebar').css({background:'transparent',border:'none'});
                        $('.ui-dialog-buttonset').css('float','left');
                        $('#moveContentConformation').html('');
                        $('#moveContentConformation').html("<span class='ui-icon ui-icon-alert' style='float:left; margin:3px 7px 20px 0;'/><span>" +
                        "The selected content(s) will be moved to the group '"+place.name+"'. Are you sure?"+"</span>");
                    },
                    buttons: [{
                        text: "Yes",
                        "class": 'ui-button-icon-primary primary-btn',
                        click: function() {
                            targetPlaceUrl = place.resources.self.ref;
                            targetPlaceBlogUrl = place.resources.blog?place.resources.blog.ref:"";
                            messageHandler.resetMessage();
                            processMoveContent();
                            $(this).dialog('close');
                        }
                    },
                        {
                            text: "Cancel",
                            "class": 'ui-button-icon-primary cancel-btn',
                            click: function() {
                                $( this ).dialog( "close" );
                            }
                        }]
                });
            },function(){
                messageHandler.displayErrorMessage("Access Restricted")
            })
        }
        validator.validateIfContentSelected(viewHandler.getSelectedContentIds()).then(function(){
            osapi.jive.corev3.search.requestPicker({
                excludeContent : true,
                excludePeople : true,
                success : function(place) {
                    validator.validateSelectedPlacesAndContent(sourcePlaceUrl, place.resources.self.ref)
                        .then(function(){
                            setTargetPlaceNameAndUrl(place)
                        },function(error){
                            messageHandler.displayErrorMessage(error);
                        })
                }
            });
        },function(error){
            messageHandler.displayErrorMessage(error)
        })


    }

    var processMoveContent = function () {
        var moveSelectedContentToTargetPlace = function(){
            var selectedContentIds = viewHandler.getSelectedContentIds()
            var deferred = Q.defer();
            var contentCounter = 1;
            validator.validateSelectedPlacesAndContent(sourcePlaceUrl, targetPlaceUrl, selectedContentIds)
                .then(function(){
                    var contentSuccessCount = 0;
                    viewHandler.disableAllButtonsWhileProcessingContent();
                    var counter = 1;
                    _.forEach(selectedContentIds, function(contentId){
                            jiveWrapper.updateContentParentPlace(contentId, targetPlaceUrl, targetPlaceBlogUrl)
                                .then(function(){
                                    contentSuccessCount = contentSuccessCount + 1;
                                    viewHandler.displayContentSuccessRow(contentId);
                                    if(counter==selectedContentIds.length){
                                        messageHandler.displayInfoMessage(" Successfully moved "+ contentSuccessCount + " out of " + contentCounter);
                                        deferred.resolve();
                                    }
                                    counter++,contentCounter++;
                                },
                                function(err){
                                    if(err !== 'no discussions')
                                    {
                                        viewHandler.displayContentErrorRow(contentId, err);
                                        contentCounter++;
                                    }
                                    if(counter==selectedContentIds.length)
                                        deferred.resolve();
                                    counter++;
                                })
                        }
                    )
                },
                function(err){
                    messageHandler.displayErrorMessage(err)
                })

            return deferred.promise;
        }

        messageHandler.resetMessage()
        moveSelectedContentToTargetPlace().then(
            function () {
                viewHandler.showRefreshContentView()
                logger.logManageContentResult(function(result){
                    var logInfo = {app:'MoveContent',user:currentUserUrl.split('/').slice(-1)[0],sourceGroup:sourcePlaceUrl,destinationGroup:targetPlaceUrl};
                    if(result.successContentIds.length!=-0){
                        logInfo['successIds'] = result.successContentIds;
                        logger.generateLoggerRequest("INFO", logInfo)
                            .execute(function (response) {
                            });
                    }
                    if(result.failedContentIds.length!=-0){
                        if('successIds' in logInfo)
                            delete logInfo.successIds;
                        logInfo['failedIds'] = result.failedContentIds;
                        logger.generateLoggerRequest("ERROR", logInfo)
                            .execute(function (response) {
                            });
                    }
                });
            }
        );
    };
    return{displayTargetPlacePicker:displayTargetPlacePicker}
}

