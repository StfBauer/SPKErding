'use script';

window.appHelper = {
    getRelativeUrlFromAbsolute: function (absoluteUrl) {
        absoluteUrl = absoluteUrl.replace('https://', '');
        var parts = absoluteUrl.split('/');
        var relativeUrl = '/';
        for (var i = 1; i < parts.length; i++) {
            relativeUrl += parts[i] + '/';
        }
        return relativeUrl;
    }
};

var deployment = function () {

    var curSP = {
        ctx: null,
        web: null
    };

    var mainDfd = $.Deferred();

    var createContext = function () {

        mainDfd = $.Deferred();

        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {


            var relativeUrl = appHelper.getRelativeUrlFromAbsolute(hostweburl);

            console.log(relativeUrl);

            curSP.ctx = new SP.ClientContext(relativeUrl);
            curSP.web = curSP.ctx.get_web();

            curSP.ctx.load(curSP.web);

            curSP.ctx.executeQueryAsync(
                function () {
                    console.log('Success');
                    mainDfd.resolve();
                },
                function () {
                    console.log('Error');
                    mainDfd.resolve();
                });

        });

        return mainDfd.promise();

    };

    var createFields = function (fieldDefinition) {

        dfdInternal = $.Deferred();

        index = 0;

        fieldDef = fieldDefinition;

        $.when(createField(fieldDefinition[index]))
            .done(
                function () {

                    var web = curSP.ctx.get_web();
                    web.update();

                    curSP.ctx.executeQueryAsync(
                        function () {

                            mainDfd.resolve();
                        },
                        function () {

                            mainDfd.resolve();
                        }
                    );
                });

        return dfdInternal.promise();
    };

    var createField = function (field) {

        if (index >= fieldDef.length) {
            return dfdInternal.resolve();
        }

        var ctx = curSP.ctx;

        var fieldCreation = field;

        var web = ctx.get_web();
        var fields = web.get_fields();
        var fieldGuid = SP.Guid.newGuid().toString('B');

        var newFieldXML = String.format('<Field DisplayName=\'{0}\' Name=\'{1}\' ID=\'{2}\' Group=\'{3}\' Type=\'{4}\' />',
            fieldCreation.displayName, fieldCreation.internalName, fieldGuid, fieldCreation.group, fieldCreation.fieldType);

        fields.addFieldAsXml(newFieldXML, true, SP.AddFieldOptions.addToDefaultContentType);

        ctx.load(fields);

        ctx.executeQueryAsync(function () {

            index = index + 1;

            $("#message").append("Field created " + fieldCreation.displayName + "<br>");

            createField(fieldDef[index]);

        }, function (sender, args) {
            index = index + 1;

            var errorMsg = args.get_message();

            $("#message").append("ERROR: " + errorMsg + "<br>");

            createField(fieldDef[index]);

        });

        return dfdInternal.promise();
    };

    return {

        createContext: createContext,
        createFields: createFields

    };

}();