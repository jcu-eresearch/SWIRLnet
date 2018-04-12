var swirlnetDashboard = (function (){

    var historicalMap= Object.create(swirlnetMap);
    var currentMap= Object.create(swirlnetMap);

    var historicalTowers= Object.create(swirlnetSections);
    var currentTowers= Object.create(swirlnetSections);

    var init = function (settings) {

        if(!settings) return;

        if(settings.showCurrent){
            var title = "SWIRLnet Current Data";
            if(settings["dateRanges"] && settings["dateRanges"][1] )
                title= settings["dateRanges"][1].name;
            currentMap.initMap({
                parent: ".cts-content",
                title: title,
                id : "currentMap"
            });
            currentMap.addMarkers(settings["locations"]);
            currentMap.fitBounds();
            currentMap.showCyclone();
            if(settings.yAxisLimits && settings.yAxisLimits.wind  && settings.yAxisLimits.wind[1])
                currentTowers.setMaxRange(settings.yAxisLimits.wind[1]);
            currentTowers.init("data-preview/processed/", ".cts-content",
                'current', settings["locations"],
                ["data-preview/timelapse/ccfc1/Camera1.mp4",
                    "data-preview/timelapse/ccfc2/Camera2.mp4"],
                false);

        }

        if(settings.showOld){
            title = "SWIRLnet Historical Data";
            if(settings["dateRanges"] && settings["dateRanges"][0] )
                title= settings["dateRanges"][0].name;

            historicalMap.initMap({
                parent: ".cts-content",
                title: title,
                id : "historicalMap"
            });
            historicalMap.addMarkers(settings["locationsOld"]);
            historicalMap.fitBounds();
            historicalMap.renderTrack('data-preview/old/cyclone-track.geojson');
            if(settings.yAxisLimits && settings.yAxisLimits.windOld  && settings.yAxisLimits.windOld[1])
                historicalTowers.setMaxRange(settings.yAxisLimits.windOld[1]);
            historicalTowers.init("data-preview/old/processed/", ".cts-content",
                'historical', settings["locationsOld"],
                ["data-preview/timelapse/old/Camera1/Camera1.mp4",
                    "data-preview/timelapse/old/Camera2/Camera2.mp4"],
                true);

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

$(document).ready(function() {
    $.ajaxSetup({ cache: false });
    $.getJSON("config/config-preview.json", function (json) {
        swirlnetDashboard.init(json);

    });
})
