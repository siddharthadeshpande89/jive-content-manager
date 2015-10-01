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
var TagManager = function() {
    var openTagEditor = function () {

        var onOpenActions = function(){
            $('.ui-dialog-buttonset').css('float','left');
            $('.ui-dialog-buttonset').append('<span id="tag-message"></span>')
            $('.ui-dialog-titlebar').css({background:'transparent',border:'none'});
        };

        var onAddTagButtonClick = function(button){
            if(getAllEnteredTags().length!==0){
                $(button).submit(updateTags(getAllEnteredTags()).then(function(res){
                    logTagUpdate(res).then(function(){
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
                messageHandler.displayTagErrorMessage('Please enter at least one tag')
            }
            removeAllTags();
        } ;

        validator.validateIfContentSelected(viewHandler.getSelectedContentIds())
            .then(function () {
                $('#tagManager').show();
                $("#tagManager").dialog({
                    autoOpen: true,
                    width: 600,
                    modal: true,
                    position: ['top',100],
                    open: function () {
                        onOpenActions();
                        tagSearch();
                    },
                    buttons: [{
                        text: "Add Tags",
                        "class": 'ui-button-icon-primary primary-btn',
                        click: function() {
                          onAddTagButtonClick(this);
                        }
                    },
                    {
                        text: "Cancel",
                        "class": 'ui-button-icon-primary cancel-btn',
                         click: function() {
                             $(this).dialog("close");
                             removeAllTags();
                        }
                    }],
                    close: function () {
                        removeAllTags();
                    }
                });
            }, function () {
                messageHandler.displayErrorMessage('No content selected')
            });
        ;
    }

    var logTagUpdate = function(logs){
        var q = Q.defer();
        var logInfo = {app:'BulkTagUpdate',user:currentUserUrl.split('/').slice(-1)[0],sourceGroup:sourcePlaceUrl,successIds:logs.successIds,failedIds:logs.failedIds};
        logger.generateLoggerRequest('INFO',logInfo).execute(function (response) {
            q.resolve();
        },function(err){q.reject()});
        return q.promise;
    }
    var clearInput = function(event){
        if (event.keyCode == 188)  // KeyCode For comma is 188
            $('#tag-id').val('');
    }
    var removeAllTags= function(){
        $('#tags li:not(:last)').remove();
        $('#tag-id').val('');
    }

    var getCurrentTag = function () {
        return $('#tag-id').val().trim()
    }

    var removeTag = function (event) {
        event.parentElement.remove();
    };

    var getAllEnteredTags = function () {
        var tags = [];
        $('#tags li.tag').each(function (e) {
            tags.push($(this).text().slice(0, -1));
        });
        return tags;
    }

    var checkComma = function(e){
        if (e.keyCode == 188) { // KeyCode For comma is 188
            $('#tag-id').val( $('#tag-id').val().split(',')[0]);
            event.preventDefault();
            addTagToList($.Event( "keydown", { keyCode: 13 } ));
        }
    }

    var addTag = function (tag) {
        if (!validator.validateEmptyTag(tag)) {
            if (validator.validateTagAlreadyPresent(getAllEnteredTags(), tag)) {
                $("li").filter(function () {
                    return $(this).text() === tag + 'X';
                }).effect("highlight", {color: '#49E43E'}, 1500);
            } else {
                $('#tags li:last').before('<li class="tag">' + tag + '<a href="#" class="close-btn" onclick="tagManager.removeTag(this)">X</a></li>');
            }
        }
        $('#tag-id').val('');
    }

    var addTagToList = function(e){
        var ENTER = 13;
        if (e.keyCode == ENTER) {
            tagManager.addTag(getCurrentTag())
        }
    }

    var handleKeyEvents = function(e){
        if (e.which === 13) {
            $(".ui-menu-item").hide();
            $('.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content').hide();
        }if (e.which === 27) {
            $('#tag-id').val('');
            $(".autocomplete").hide();
        }
    }

    var updateTags = function (newTags) {
        var deferred = Q.defer();
        var selectedContentIds = viewHandler.getSelectedContentIds();
        var result = {'successIds':[],'failedIds':[]}
        var counter = 1;
        _.forEach(selectedContentIds, function (contentId) {
                var tags = [];
                osapi.jive.core.get({
                    v: "v3",
                    href: "/contents/" + contentId + ""
                }).execute(function (response) {
                    tags = response.tags;
                    osapi.jive.connects.post({
                        authz: "signed",
                        alias: "contentService",
                        headers: {"Content-Type": "application/json"},
                        format: 'json',
                        href: '/updateContent',
                        body: {jiveContent: {'tags':_.union(tags,newTags)}, contentId: contentId}
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

    var tagSearch = function () {
        $("#tag-id").autocomplete({
            containment: "parent",
            open : function(){
            },
            source: function (request, response) {
                var tagVal = getCurrentTag();
                osapi.jive.core.get({
                    v: "v3",
                    href: "/search/tags?filter=search("+tagVal+")&count=100"
                }).execute(function (tags) {
                    if ($('#tag-id').val() == tagVal)
                        response( _.map(tags.list, function(c){
                            return c["name"];
                        }));
                }, function (err) {
                });
            },
            select: function (event, ui) {
                addTag(ui.item.value);
                event.preventDefault();
            },
            minLength: 3
        }).keyup(function (e) {
            handleKeyEvents(e);
        });
    }
    return {
        openTagEditor:openTagEditor,
        addTag:addTag,
        removeTag:removeTag,
        tagSearch:tagSearch,
        addTagToList: addTagToList,
        checkComma : checkComma,
        clearInput:clearInput
    }
}
