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

$.getJSON("config/config.json", function(json) {
  swirlnetDashboard.init(json);

});

/*

//TODO: read these paths from the config file
var currentDir="data/processed/";
var oldDir="data/old/processed/";
var maxRange=150;




var renderDefaultCharts =function(defaults){
    var dir=oldDir;
    if(defaults)
        dir=currentDir;
    for(var x=0; x< 6 ; x++){
        var chartNum=x+1;
        for (var y=0; y<2; y++){
            makeplotWind(dir+"t"+chartNum+".csv", "t"+chartNum+"-wind");
            makeplotWeather(dir+"t"+chartNum+".csv", "t"+chartNum+"-pressure");
        }
    }
};



//TODO change this
var addClickHandlers = function () {
    for (var i=1; i<9 ; i++){
        $( "#move-"+i ).click(
            (function (i) {
                return function() {
                    showDiv(i);
                    hideExcept(i);
                }
            })(i));
    }
};

addClickHandlers();


var ranges={};




$.getJSON("config/config.json", function(json) {

    if(json.yAxisLimits && json.yAxisLimits.wind && json.yAxisLimits.wind.length>1){
        maxRange=json.yAxisLimits.wind[1];
    }
    var towerIcon = L.icon({
        iconUrl: 'images/tower.png',
        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
    });



    renderDefaultCharts(defaultChart);
});



var getNodes= function(){
    for (var i=1; i<=6; i++){
        plots.push((d3.select('div[id="t'+i+'-wind"]')).node());
        plots.push((d3.select('div[id="t'+i+'-pressure"]')).node());
    }
};



window.onresize = function() {

    plots.forEach(function (t) {
        Plotly.Plots.resize(t);
    });
};

var initComponents= function(){
    for(var i=1; i<=6; i++) {
        $('#carousel-'+i).on('slide.bs.carousel',(function (i) {
            return function () {
                Plotly.Plots.resize(plots[(i-1) * 2]);
                Plotly.Plots.resize(plots[(i-1) * 2 + 1]);
            }
        })(i));
    }
    for(var i=2; i<=8; i++){
        hideDiv(i);
    }
};

getNodes();
initComponents();

var refresh = function() {
    for(var x=0; x< 6 ; x++){
        var chartNum=x+1;
        for (var y=0; y<2; y++){
            if(defaultCharts[x][y])
                makeplotWind(currentDir+"t"+chartNum+".csv", "t"+chartNum+"-wind");
            if(defaultCharts[x][y])
                makeplotWeather(currentDir+"t"+chartNum+".csv", "t"+chartNum+"-pressure");
        }
    }
};

var interval = 1000 * 60 * 5;

setInterval(refresh, interval);


*/
