




var configSettings= {};



$.getJSON("../config/config.json", function(json) {

    configSettings=json;

    //put the


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
