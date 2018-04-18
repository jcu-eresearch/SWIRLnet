var swirlnetDashboard = (function (){

    var historicalMap= Object.create(swirlnetMap);
    var currentMap= Object.create(swirlnetMap);

    var historicalTowers= Object.create(swirlnetSections);
    var currentTowers= Object.create(swirlnetSections);

    var init = function (settings) {

        if(!settings) return;

        if(settings.showCurrent){

            // The default title for the map
            var title = "SWIRLnet Current Data";

            // If the title is available
            if(settings["dateRanges"] && settings["dateRanges"][1] )
                title= settings["dateRanges"][1].name;

            // Initialize the Map
            currentMap.initMap({
                parent: ".cts-content",
                title: title,
                id : "currentMap"
            });

            // Add markers
            currentMap.addMarkers(settings["locations"]);
            currentMap.fitBounds();
            currentMap.showCyclone();

            if(settings.yAxisLimits &&
                settings.yAxisLimits.wind  &&
                settings.yAxisLimits.wind[1])
                currentTowers.setMaxRange(settings.yAxisLimits.wind[1]);

            var displayCameras = [false, false];
            var cameraNames = ['Camera1', 'Camera2'];
            if(settings.cameraDateRanges && settings.cameraDateRanges.length>1){
                for(var i=0; i< settings.cameraDateRanges.length ; i++){
                    if(settings.cameraDateRanges[i].display)
                        displayCameras[i]= settings.cameraDateRanges[i].display;
                    if(settings.cameraDateRanges[i].name)
                        cameraNames[i] = settings.cameraDateRanges[i].name;
                }
            }

            currentTowers.init(
                "data-preview/processed/",
                ".cts-content",
                'current',
                settings["locations"],
                [
                    {
                        source: "data-preview/timelapse/ccfc1/Camera1.mp4",
                        display: displayCameras[0],
                        name : cameraNames[0]
                    },
                    {
                        source: "data-preview/timelapse/ccfc2/Camera2.mp4",
                        display: displayCameras[1],
                        name : cameraNames[1]
                    }
                ]
            );

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

            if(settings.yAxisLimits &&
                settings.yAxisLimits.windOld  &&
                settings.yAxisLimits.windOld[1])
                historicalTowers.setMaxRange(settings.yAxisLimits.windOld[1]);

            var displayCameras = [false, false];
            var cameraNames = ['Camera1', 'Camera2'];
            if(settings.cameraDateRanges && settings.cameraDateRanges.length>1){
                for(var i=0; i< settings.cameraDateRanges.length ; i++){
                    if(settings.cameraDateRanges[i].displayOld)
                        displayCameras[i]= settings.cameraDateRanges[i].displayOld;
                    if(settings.cameraDateRanges[i].nameOld)
                        cameraNames[i] = settings.cameraDateRanges[i].nameOld;
                }
            }

            historicalTowers.init(
                "data-preview/old/processed/",
                ".cts-content",
                'historical',
                settings["locationsOld"],
                [
                    {
                        source: "data-preview/timelapse/old/Camera1/Camera1.mp4",
                        display: displayCameras[0],
                        name : cameraNames[0]

                    },
                    {
                        source: "data-preview/timelapse/old/Camera2/Camera2.mp4",
                        display: displayCameras[1],
                        name : cameraNames[1]
                    }
                ]
            );

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
