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
var DeleteContent = function(){
    var deleteContent = function(selectedContentIds){
        var deferred = Q.defer();
        var documentSuccessCount = 0;
        viewHandler.disableAllButtonsWhileProcessingContent();
        var counter = 1;
        _.forEach(selectedContentIds, function(contentId){
                jiveWrapper.deleteContent(contentId)
                    .then(function(){
                        documentSuccessCount = documentSuccessCount + 1;
                        messageHandler.displayInfoMessage(" Successfully deleted "+ documentSuccessCount + " out of " + selectedContentIds.length);
                        viewHandler.displayContentSuccessRow(contentId);
                        if(selectedContentIds.length == counter)
                            deferred.resolve();
                        counter++;
                    },
                    function(err){
                        viewHandler.displayContentErrorRow(contentId, err);
                        if(selectedContentIds.length == counter)
                            deferred.resolve();
                        counter++;
                    })
            }
        )
        return deferred.promise;
    }

    var logDeleteOperation= function(){
        logger.logManageContentResult(function(result){
            var logInfo = {app:'DeleteContent',user:currentUserUrl.split('/').slice(-1)[0],sourceGroup:sourcePlaceUrl};
            if(result.successContentIds.length!=-0){
                logInfo['successIds'] = result.successContentIds;
                logger.generateLoggerRequest("INFO", logInfo)
                    .execute(function (response) {
                    });
            }
            if(result.failedContentIds.length!=-0){
                if('successIds' in logInfo)
                    delete logInfo.successIds;
                logInfo['failedIds'] = result.failedContentIds.toString();
                logger.generateLoggerRequest("ERROR", logInfo)
                    .execute(function (response) {
                    });
            }
        });
    }
    var deleteSelectedContent = function(){
        messageHandler.resetMessage()
        var selectedIds = viewHandler.getSelectedContentIds();
        validator.validateIfContentSelected(selectedIds)
            .then(function(){
                $('#tw-move-content').append("<div id='delete-confirm' title='Delete selected content(s)?'><p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>The selected content(s) will be permanently deleted and cannot be recovered. Are you sure?</p></div>");
                $( "#delete-confirm" ).dialog({
                    resizable: false,
                    width:500,
                    height:200,
                    modal: true,
                    position: 'center',
                    open : function(){
                        $('.ui-dialog-titlebar').css({background:'transparent',border:'none'});
                        $('.ui-dialog-buttonset').css('float','left');
                    },
                    buttons: [{
                        text: "Delete",
                        "class": 'ui-button-icon-primary primary-btn',
                        click: function() {
                            deleteContent(selectedIds).then(
                                function () {
                                    viewHandler.showRefreshContentView();
                                    logDeleteOperation();
                                }
                            );
                            $(this).dialog('close');
                        }
                    },
                        {
                            text: "Cancel",
                            "class": 'ui-button-icon-primary cancel-btn',
                            click: function() {
                                $( this ).dialog("close");
                            }
                        }]
                });
            },function(error){
                messageHandler.displayErrorMessage(error)
            });
    }

    return {deleteSelectedContent:deleteSelectedContent}
}