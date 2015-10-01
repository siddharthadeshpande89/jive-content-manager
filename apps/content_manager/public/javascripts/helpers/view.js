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
viewHandler = {
    setupMoveContentView : function () {
        $("#spinner").show();
        $("#refreshContent").hide();
        $("#selectAllContent").prop('checked', true);
        $("#resetTarget").show();
    },

    resetTarget : function(){
        $("#moveContent").hide();
        $("#resetTarget").hide();
        $("#target_place_picker").show();
        $("#deleteContent").show();
        $("#targetPlace").val("");
        $("#move-content-message").removeClass().html("");
    },

    displayNonAdminWarningMessage : function(groupAdmins){
        $('#non-admin-info').html('<div class="alert alert-warn" role="alert">Only group admins can access this app.<br/> Please contact following administrator(s) to move content :</div>');
        $('#non-admin-info').append("<ul>")
        groupAdmins.list.splice(0,5).forEach(function (user) {
            $('#non-admin-info').append("<li><div class='admins' role='alert'>" + user.person.displayName + "</div></li>")
        })
        $('#non-admin-info').append("</ul>")
    },

    setContentTypeButtonsWithHandlers : function (supportedContentTypes, eventHandler) {

        _.forEach(supportedContentTypes, function(type){
            $("#content-type-options").append('<option value="'+type+'" selected>'+type+'</option>')
        })
        $('#content-type-options').multiselect({
            includeSelectAllOption: true,
            nonSelectedText:"Content Types",
            allSelectedText:"Content Types",
            nSelectedText: 'Content Types',
            numberDisplayed:0,
            selectAllText: 'Select All',
            selectedClass: '',
            maxHeight: 100,
            selectAllValue: 'select-all-value',
               onChange: function(option, checked) {
                   eventHandler()
            }
        });
    },

    showRefreshContentView : function () {
        $("#spinner").hide();
        $("#refreshContent").show().removeAttr("disabled");
        $(".cm-actions").hide();
    },
    disableAllButtonsWhileProcessingContent : function(){
        $("#spinner").show();
        $("#resetTarget").hide();
    },

    displayTargetPlaceName : function(placeName){
        $("#targetPlace").val(placeName);
        $("#targetPlace").prop("size",placeName.length+2);
        $("#moveContent").show();
        $("#resetTarget").show();
        $("#resetTarget").click(resetTarget);
        //$("#deleteContent").hide();
    },

    setupPaginationLinks : function(paginationData){
        $("#pagination").html(Mustache.render($('#pagination-template').html(),paginationData));
    },


    selectAllContent : function () {
        $('#content-body input:checkbox').each(function () {
            this.checked = $("#selectAllContent:checked").val();
        });
    },

    displayContentSuccessRow : function(contentId) {
        $("#" + contentId).closest('tr').addClass("alert-success");
    },

    displayContentErrorRow : function(contentId, error) {
        var message = ""
        if(error.code == 500)
            message = "Error, please try moving item again or contact admin"
        if(error.code == 403)
            message = "content type not supported in target place or you have insufficient permissions"
        else if(error.code == 400 && error.message == "api.core.v3.error.missing_event_access")
            message = "Missing event access, contact admin"
        else
            message = "Error, please try moving item again or contact admin"

        var messagespan = '<span aria-hidden="true" data-toggle="tooltip" data-placement="top" title="'+message+'"><span class="info-icon">i</span></span>'
        $("#" + contentId).closest('tr').find('.rowMessage').html(messagespan);
        $("#" + contentId).closest('tr').addClass("alert-danger");
    },

    showContent : function(contentJson) {
        $("#content-body").html(Mustache.render($('#content-list-template').html(),contentJson));
        $(".contentCheck").change(this.areAllContentsSelected);
        $("#spinner").hide();
    },

    resetContentList : function(){
        $("#content-body").html("");
    },

    getSelectedContentIds : function(){
        idList = [];
        $(".content td input:checked").each(function(index){
            idList.push(this.id);
        });
        return idList;
    },

    areAllContentsSelected : function(){
        var idList = [];
        $(".content td input").each(function(index){
            idList.push(this.checked);
        });

        if(idList.indexOf(false) > -1){
            $("#selectAllContent").removeAttr('checked');
        } else {
            $("#selectAllContent").prop('checked', true);
        }
    },

    isContentTypeChecked : function(contentType){
        return $("#"+contentType).is(":checked")
    },

    itemsPerPage : function(){
        return parseInt($("#itemsPerPageOption").val());
    },

    authorFilter : function(){
        return $("#authorFilterOption").val();
    },

    sortByOption : function(){
        return $("#sortByOption").val();
    },

    disableAuthorFilterForGeneralUser : function(){
        $("#authorFilterOption").val('self');
        $("#authorFilterOption").prop("disabled", true);
    },

    disableBlogsView : function(){
        $("#nav-tabs").hide()
    },

    disableOtherContentsView : function(){
        $("#nav-tabs").hide()
    },

    getContentTypesOptions : function(){
        var selectedOptions = []
        $('#content-type-options option:selected').each(function(){
            selectedOptions.push(this.value);
        })
        return selectedOptions;

    }
}

