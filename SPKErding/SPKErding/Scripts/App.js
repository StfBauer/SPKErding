'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var hostweburl,
    appweburl;

jQuery.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return jQuery.getUrlVars()[name];
    }
});



var fieldDefs = [{
    internalName: 'Textfield',
    displayName: 'Text Field',
    fieldType: 'Text',
    group: 'Test Columns'
}, {
    internalName: 'Numericfield',
    displayName: 'Numeric Field',
    fieldType: 'Number',
    group: 'Test Columns'
}, {
    internalName: 'Datefield',
    displayName: 'Date Field',
    fieldType: 'DateTime',
    group: 'Test Columns'
}, {
    internalName: 'NoteField',
    displayName: 'Note Field',
    fieldType: 'Note',
    group: 'Test Columns'
},
{
    internalName: 'NoteField2',
    displayName: 'Note Field2',
    fieldType: 'Note',
    group: 'Test Columns'
}];


// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    console.log(context);

    hostweburl = decodeURIComponent($.getUrlVar("SPHostUrl"));
    appweburl = decodeURIComponent($.getUrlVar("SPAppWebUrl"));

    $('#dplFields').click(function (event) {

        event.preventDefault();

        // create the context
        $.when(deployment.createContext())
            .done(function () {
                // Deploy fields
                deployment.createFields(fieldDefs).done(function () {

                    $("#message").append("All done now");

                })
            });

    })


});