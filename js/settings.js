




var configSettings= {};



$.getJSON("../config/config.json", function(json) {

    configSettings=json;

    //put the

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

    //create a temp file for these values

});


$( "#apply" ).click(function() {
    //place temp file back in its place
});
