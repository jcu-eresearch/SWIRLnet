var swirlnetDashboard = (function (){

    var historicalMap= Object.create(swirlnetMap);
    var currentMap= Object.create(swirlnetMap);

    var historicalTowers= Object.create(swirlnetSections);
    var currentTowers= Object.create(swirlnetSections);

    var init = function (settings) {

        if(settings.showOld){
            historicalMap.initMap({
                parent: ".cts-content",
                title: "SWIRLnet TC Debbie",
                id : "historicalMap"
            });
            historicalMap.addMarkers(settings["locationsOld"]);
            historicalMap.renderTrack('data/old/TC_Debbie_Track.json');
            historicalTowers.init("data/old/processed/", ".cts-content",
                'historical', settings["locationsOld"],
                ["data/old/Camera1/Camera1.mp4", "data/old/Camera2/Camera2.mp4"],
                true);
        }

        if(settings.showCurrent){
            currentMap.initMap({
                parent: ".cts-content",
                title: "SWIRLnet Current Data",
                id : "currentMap"
            });
            currentMap.addMarkers(settings["locations"]);
            currentTowers.init("data/processed/", ".cts-content",
                'current', settings["locations"],
                ["data/ccfc1/Camera1.mp4", "data/old/ccfc2/Camera2.mp4"],
                false);


        }

        if(settings.showCombined){

        }






        window.onresize = function() {
            historicalTowers.resize();
            currentTowers.resize();
        };

        $(function () {
            $('[data-toggle="tooltip"]').tooltip({
                trigger : 'hover'
            });
        });

        $('#selector button').click(function() {
            $(this).addClass('active').siblings().removeClass('active');
        });
    };



    return {
        init: init
    };
})();

$.getJSON("config/config-preview.json", function(json) {
  swirlnetDashboard.init(json);

});

