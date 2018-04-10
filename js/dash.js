var swirlnetDashboard = (function (){

    var historicalMap= Object.create(swirlnetMap);
    var currentMap= Object.create(swirlnetMap);

    var historicalTowers= Object.create(swirlnetSections);

    var init = function (settings) {
        historicalMap.initMap({
            parent: ".cts-content",
            title: "SWIRLnet TC Debbie",
            id : "historicalMap"
        });
        historicalMap.addMarkers(settings["locationsOld"]);
        historicalTowers.init("data/old/processed/", ".cts-content", 'historical');

        currentMap.initMap({
            parent: ".cts-content",
            title: "SWIRLnet Current Data",
            id : "currentMap"
        });
        currentMap.addMarkers(settings["locations"]);
        historicalTowers.init("data/processed/", ".cts-content", 'current');



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

