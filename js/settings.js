




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



    //create a temp file for these values

});


$( "#apply" ).click(function() {
    //place temp file back in its place
});
