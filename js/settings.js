




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


    var start= getDateToText(new Date(json.dateRanges[1].start));
    var end= getDateToText(new Date(json.dateRanges[1].end));

    $("input[type=date][id=date-0]").val(start);
    $("input[type=date][id=date-1]").val(end);

    $("input[type=time][id=time-0]").val(getTimeToText(json.dateRanges[1].start));
    $("input[type=time][id=time-1]").val(getTimeToText(json.dateRanges[1].end));


    $("input[type=text][id=event]")
        .val( json.dateRanges[1].name);


    for(var i=1; i<7; i++) {
        $("input[type=text][id=name-"+i+"]")
            .val( json.locations[i-1].name);

        $("input[type=text][id=lat-"+i+"]")
            .val(json.locations[i-1].lat);

        $("input[type=text][id=lon-"+i+"]")
            .val(json.locations[i-1].lon);

        $("input[type=text][id=label-"+i+"]")
            .val(json.locations[i-1].label);

        $("input[type=text][id=heading-"+i+"]")
            .val(json.locations[i-1].chartHeading);

        $("input[type=text][id=subheading-"+i+"]")
            .val(json.locations[i-1].chartSubheading);
    }
});



$( "#old" ).click(function() {
    configSettings.defaultCharts="old";
});

$( "#current" ).click(function() {
    configSettings.defaultCharts="current";
});

$( "#save" ).click(function() {

    for(var i=1; i<7; i++) {
        configSettings.locations[i-1].name=($("input[type=text][id=name-"+i+"]").val());

        configSettings.locations[i-1].lat=$("input[type=text][id=lat-"+i+"]")
            .val( );

        configSettings.locations[i-1].lon=$("input[type=text][id=lon-"+i+"]")
            .val( );

        configSettings.locations[i-1].label=$("input[type=text][id=label-"+i+"]")
            .val( );

        configSettings.locations[i-1].chartHeading=$("input[type=text][id=heading-"+i+"]")
            .val();

        configSettings.locations[i-1].chartSubheading=$("input[type=text][id=subheading-"+i+"]")
            .val( );
    }
    //create a temp file for these values
});


$( "#apply" ).click(function() {
    //place temp file back in its place
});