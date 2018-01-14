

var addMetaData= function(parentDiv, event){

    var sensorMetaData = '<div class="col-lg-12">'+
        '<h4>Event Name</h4>' +
        '<p>' +
        '<label for="event'+event+'"></label>' +
        '<input type="text" class="form-control" id="event'+event+'" aria-describedby="eventHelp" placeholder="Enter the Name of the Event">' +
        '<small class="form-text text-muted">This is the name of the event.</small>' +
        '</p>' +
        '<h4>Start and End Dates</h4>' +
        '<p>' +
        '<label for="date-start'+event+'">Start Date</label>' +
        '<input type="date" class="form-control" id="date-start'+event+'" aria-describedby="dateHelp" placeholder="Enter Start Date">' +
        '<small class="form-text text-muted">This is the date at which data will start displaying.</small>' +
        '<label for="time-start'+event+'">Start Time</label>' +
        '<input type="time" class="form-control" id="time-start'+event+'" aria-describedby="timeHelp" placeholder="Enter Start Time">' +
        '<small class="form-text text-muted">This is the time at which data will start displaying.</small>' +
        '<label for="date-end'+event+'">End Date</label>' +
        '<input type="date" class="form-control" id="date-end'+event+'" aria-describedby="dateHelp" placeholder="Enter End Date">' +
        '<small class="form-text text-muted">This is the date at which data will stop displaying. Leave blank if this date is in the future</small>' +
        '<label for="time-end'+event+'">End Time</label>' +
        '<input type="time" class="form-control" id="time-end'+event+'" aria-describedby="timeHelp" placeholder="Enter End Time">' +
        '<small class="form-text text-muted">This is the time at which data will stop displaying.</small>' +
        '</p>' +
        '</div>' +
        '<div class="col-lg-6 sensor-col-1"></div>' +
        '<div class="col-lg-6 sensor-col-2"></div>';

    $(parentDiv).append(sensorMetaData);

};

var addSensors= function(parentDiv, start, end, event){
    for (var i=start; i<=end; i++) {
        var sensorSettings = '<h4>Tower '+i+
            '</h4>' +
            '<p>' +
            '<label for="name-'+i+event+'">Name on Map</label>' +
            '<input type="text" class="form-control" id="name-'+i+event+'" aria-describedby="nameHelp" placeholder="Enter Name"> ' +
            '<small class="form-text text-muted">This is the name that appears next to the pin on the map.</small>' +
            '<label for="label-'+i+event+'">Map Label Direction</label>' +
            '<input type="text" class="form-control" id="label-'+i+event+'" aria-describedby="labelHelp" placeholder="Enter Label Direction">' +
            '<small class="form-text text-muted">This is the direction of the Label on the map. Only "left" and "right" are allowed.</small>' +
            '<label for="lat-'+i+event+'">Latitude in decimal</label>' +
            '<input type="text" class="form-control" id="lat-'+i+event+'" aria-describedby="latHelp" placeholder="Enter Latitude">' +
            '<small class="form-text text-muted">This is the latitude in decimal.</small>' +
            '<label for="lon-'+i+event+'">Longitude in decimal</label>' +
            '<input type="text" class="form-control" id="lon-'+i+event+'" aria-describedby="lonHelp" placeholder="Enter Longitude">' +
            '<small class="form-text text-muted">This is the longitude in decimal.</small>' +
            '<label for="heading-'+i+event+'">Chart Heading</label>' +
            '<input type="text" class="form-control" id="heading-'+i+event+'" aria-describedby="headingHelp" placeholder="Enter Heading">' +
            '<small class="form-text text-muted">This is the heading that appears on the chart.</small>' +
            '<label for="subheading-'+i+event+'">Chart Subheading</label>' +
            '<input type="text" class="form-control" id="subheading-'+i+event+'" aria-describedby="subheadingHelp" placeholder="Enter Subheading">' +
            '<small class="form-text text-muted">This is the subheading that appears on the chart.</small>' +
            '</p>';
        $(parentDiv).append(sensorSettings);
    }
};


addMetaData(".settings-new", "-current");
addSensors(".settings-new .sensor-col-1", 1, 3, "-current");
addSensors(" .settings-new .sensor-col-2", 4, 6, "-current");

addMetaData(".settings-old", "-old");
addSensors(".settings-old .sensor-col-1", 1, 3, "-old");
addSensors(" .settings-old .sensor-col-2", 4, 6, "-old");

var configSettings= {};

var getDateToText= function(dt){
    dt = new Date(dt);
    var day = ("0" + dt.getDate()).slice(-2);
    var month = ("0" + (dt.getMonth() + 1)).slice(-2);
    var today = dt.getFullYear()+"-"+(month)+"-"+(day) ;
    return today;
};

var getTimeToText= function(dt){
    return dt.slice(11, dt.length);
};


$.getJSON("../config/config.json", function(json) {

    configSettings=json;

    if(json.yAxesLimits && json.yAxesLimits.wind && json.yAxesLimits.wind.length>1){
        $("input[type=number][id=wind-axis]")
            .val(json.yAxesLimits.wind[1]);
    }

    var event="-old";
    for(var k=0;k<=1; k++) {
        var start = getDateToText(new Date(json.dateRanges[k].start));
        var end = getDateToText(new Date(json.dateRanges[k].end));
        $("input[type=date][id=date-start"+event+"]").val(start);
        $("input[type=date][id=date-end"+event+"]").val(end);
        $("input[type=time][id=time-start"+event+"]").val(getTimeToText(json.dateRanges[k].start));
        $("input[type=time][id=time-end"+event+"]").val(getTimeToText(json.dateRanges[k].end));
        $("input[type=text][id=event"+event+"]")
            .val(json.dateRanges[k].name);
        event="-current";
    }
    for(var j=1;j<=2; j++) {
        for (var i = 1; i < 7; i++) {
            $("input[type=text][id=name-" + i + event+"]")
                .val(json.locations[i - 1].name);
            $("input[type=text][id=lat-" + i +event+ "]")
                .val(json.locations[i - 1].lat);
            $("input[type=text][id=lon-" + i +event+ "]")
                .val(json.locations[i - 1].lon);
            $("input[type=text][id=label-" + i+event+ "]")
                .val(json.locations[i - 1].label);
            $("input[type=text][id=heading-" + i +event+ "]")
                .val(json.locations[i - 1].chartHeading);
            $("input[type=text][id=subheading-" + i +event+ "]")
                .val(json.locations[i - 1].chartSubheading);
        }
        event="-old";
    }
    if(json.defaultCharts==="current") {
        $('#' + "current").prop('checked', true);
        $('.' + "show-charts-label").html("Show Historical Charts");
        if(json.showOld==="true")
            $('#' + "show-charts").prop('checked', true);
        else
            $('#' + "show-charts").prop('checked', false);
    }
    else{
        $('#' + "old").prop('checked', true);
        $('.' + "show-charts-label").html("Show Current Charts");
        if(json.showCurrent==="true")
            $('.' + "show-charts").prop('checked', true);
        else
            $('.' + "show-charts").prop('checked', false);
    }

});

$( ".show-charts" ).click(function() {
    configSettings.showCharts=$("input[type=checkbox][id=show-charts]").val();
});

var toggleCharts= function(event){
    if(event==="current")
        $('.' + "show-charts-label").html("Show Historical Charts");
    else
        $('.' + "show-charts-label").html("Show Current Charts");

    if (configSettings.showCharts === "true")
        $('.' + "show-charts").prop('checked', true);
    else
        $('.' + "show-charts").prop('checked', false);
};

$( "#old" ).click(function() {
    configSettings.defaultCharts="old";
    toggleCharts("old");
});

$( "#current" ).click(function() {
    configSettings.defaultCharts="current";
    toggleCharts("current");
});

var saveData= function(){
    var event="-current";
    var loc=["locations", "locationsOld"];
    for(var j=0;j<2; j++) {
        for (var i = 1; i < 7; i++) {
            configSettings[loc[j]][i - 1].name =
                ($("input[type=text][id=name-" + i + event + "]").val());
            configSettings[loc[j]][i - 1].lat =
                $("input[type=text][id=lat-" + i + event + "]").val();
            configSettings[loc[j]][i - 1].lon =
                $("input[type=text][id=lon-" + i + event + "]").val();
            configSettings[loc[j]][i - 1].label =
                $("input[type=text][id=label-" + i + event + "]").val();
            configSettings[loc[j]][i - 1].chartHeading =
                $("input[type=text][id=heading-" + i + event + "]").val();
            configSettings[loc[j]][i - 1].chartSubheading =
                $("input[type=text][id=subheading-" + i + event + "]").val();
        }
        event="-old";
    }

    if(configSettings.yAxesLimits && configSettings.yAxesLimits.wind && configSettings.yAxesLimits.wind.length>1){
        configSettings.yAxesLimits.wind[1]$("input[type=number][id=wind-axis]").val();
    }

    var event="-old";
    for(var k=0;k<=1; k++) {
        //TODO: put this into date ranges
        $("input[type=date][id=date-start"+event+"]").val();
        $("input[type=date][id=date-end"+event+"]").val();
        $("input[type=time][id=time-start"+event+"]").val();
        $("input[type=time][id=time-end"+event+"]").val();
        $("input[type=text][id=event"+event+"]").val();
        event="-current";
    }

    configSettings.showCurrent="true";
    configSettings.showOld="true";

    if(configSettings.defaultCharts==="current" && !configSettings.showCharts){
        configSettings.showCurrent="true";
        configSettings.showOld="false";
    }
    else if (!configSettings.showCharts){
        configSettings.showCurrent="false";
        configSettings.showOld="true";
    }
};
$( "#save" ).click(saveData);


$( "#apply" ).click(function() {
    //place temp file back in its place
});