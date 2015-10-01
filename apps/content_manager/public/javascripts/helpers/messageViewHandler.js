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
var messageHandler = {

    displayInfoMessage : function (message) {
        var messageJson = {messageClass : "alert-info", message : message}
        $("#app-message").html(Mustache.render($('#message-template').html() ,messageJson));
        setTimeout(function(){
            $("#app-message").html('');
        },1500)
    },

    displayLoadMessage : function (message) {
        var messageJson = {message : message}
        $("#app-message").html(Mustache.render($('#message-template').html() ,messageJson));
    },

    displayErrorMessage : function (message) {
        var messageJson = {messageClass : "alert-danger", message : message}
        $("#app-message").html(Mustache.render($('#message-template').html() ,messageJson));
        setTimeout(function(){
            $("#app-message").html('');
        },3000)
    },

    resetMessage : function(){
        $("#app-message").html(Mustache.render($('#message-template').html() ,{}));
    },
    showJiveErrorMessage : function(message){
        osapi.jive.core.container.sendNotification( {'message':message, 'severity' : 'error'} );
    },
    getCurrentMessage : function(){
        return $("#app-message").text()
    },

    displayTagErrorMessage : function (message) {
        var messageJson = {messageClass : "alert-danger", message : message}
        $("#tag-message").html(Mustache.render($('#message-template').html() ,messageJson));
        setTimeout(function(){
            $("#tag-message").html('');
        },1500)
    },
    displayCategoryErrorMessage : function(message){
        var messageJson = {messageClass : "alert-danger", message : message}
        $("#category-message").html(Mustache.render($('#message-template').html() ,messageJson));
        setTimeout(function(){
            $("#category-message").html('');
        },1500)
    }
}

