function showFooter(){
    var ctx = SP.ClientContext.get_current();
    var props = ctx.get_web().get_allProperties();
    ctx.load(props);
    ctx.executeQueryAsync(function () {
        $("#DeltaPlaceHolderFooter").html('<div style="margin-left:100px; font-weight:bold">' + props.get_fieldValues()["DemoKey"] + '</div>');
    }, null);
}
ExecuteOrDelayUntilScriptLoaded(showFooter, "sp.js")