var renderShapeFiles = function(mymap, path, name){

    var shpfile2 = new L.Shapefile(path +  '.areas.zip', {

        style:function(feature){

            if (feature.properties && feature.properties.areaType==="Warning Area") {
                return {color:"#f57f17", weight: 1, strokeOpacity: 0.2, fillColor:"#f57f17",fillOpacity:.5}
            }
            if (feature.properties && feature.properties.areaType==="Likely Tracks Area") {
                return {color:"#e0e0e0", weight: 1, strokeOpacity: 1, fillColor:"#e0e0e0",fillOpacity:0.2}
            }
            else
                return {color:"#F4C182", weight: 1, strokeOpacity: 0.6, fillColor:"#F4C182",fillOpacity:.4}
        },

        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                    if(k==="areaType" )
                        return feature.properties[k] +"<br>";
                    if(k==="fcastTime" )
                        return "Forecast Time" + ": " + feature.properties[k] +"<br>";
                    if(k==="extent")
                        return "Extent" + ": " + feature.properties[k]+"<br>";
                    else
                        return;
                }).join(""), {
                    maxHeight: 200
                });
            }

        }



    }); shpfile2.addTo(mymap);
    var shpfile = new L.Shapefile(path + '.windarea.zip', {

            style:function(feature){
                return {color:"#ef5350", weight: 0.5, strokeOpacity: 0.4, fillColor:"#ef5350",fillOpacity:.3}
            },

            onEachFeature: function(feature, layer) {

                /*layer.bindPopup("Low", {closeButton: false, offset: L.point(0, -10)});
                layer.on('mouseover', function() { layer.openPopup(); });
                layer.on('mouseout', function() { layer.closePopup(); });*/

                if (feature.properties) {

                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        if(k==="windtype" )
                            return "Wind Type" + ": " +feature.properties[k] +"<br>";
                        if(k==="fcastTime" )
                            return "Forecast Time" + ": " + feature.properties[k] +"<br>";
                        if(k==="marineType")
                            return  "Marine Type" + ": " +feature.properties[k]+"<br>";
                        else
                            return;
                    }).join(""), {
                        maxHeight: 200
                    });
                }

            }
        }

    );
    shpfile.addTo(mymap);

    var shpfile1 = new L.Shapefile(path + '.track.zip', {
        style:function(feature){
            return {color:"#ef5350", weight: 1, strokeOpacity: 1, fillColor:"#ef5350",fillOpacity: 0.8}
        },

        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function(k) {

                }).join(""), {
                    maxHeight: 200
                });
            }
        }
    });
    shpfile1.addTo(mymap);

    var shpfile3 = new L.Shapefile(path +  '.fix.zip', {
        pointToLayer: function(feature, latlng) {
            /* return L.circleMarker(latlng, {
                 radius: 6,
                 fillColor: "#ef5350",
                 color: "#ef5350",
                 weight: 1,
                 opacity: 1,
                 fillOpacity: 0.5,
                 icon: 'images/low.png'
             });*/
            var iconPath= 'images/low.png';
            if(feature.properties && feature.properties.category){
                var ct= feature.properties.category;
                switch (ct){
                    case 1:
                        iconPath='images/one.png'; break;
                    case 2:
                        iconPath='images/two.png'; break;
                    case 3:
                        iconPath='images/three.png'; break;
                    case 4:
                        iconPath='images/four.png'; break;
                    case 5:
                        iconPath='images/five.png'; break;
                }
            }

            var greenIcon = L.icon({
                iconUrl: iconPath,
                iconSize:     [24, 24], // size of the icon
                iconAnchor:   [12, 12] // point of the icon which will correspond to marker's location
            });
            return L.marker(latlng, {icon: greenIcon});
        },

        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                    if(k==="fixTimeQLD" ) {
                        var str = feature.properties[k].replace("ESTX", " AEST ");
                        return str + "<br>";
                    }
                    if(k==="category")
                        return "Category" + ": " + feature.properties[k];
                    else
                        return;
                }).join(''), {
                    maxHeight: 200
                });
            }

        }

    }); shpfile3.addTo(mymap);

};

var renderTrack= function(map, trackFile) {
    $.getJSON(trackFile, function(json) {

        var myStyle = {
            "color": "#e57373",
            "weight": 1,
            "opacity": 0.65
        };

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#e57373",
            color: "#e57373",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var layer = L.geoJson(json, {
            style: myStyle,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });

};



var mymap = L.map('mapid', { maxZoom: 10}).setView([-22.86944, 132.04453], 4);

//Latitude:-28.86944°. Longitude:153.04453°
L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '+
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets-satellite',
        accessToken: 'pk.eyJ1Ijoic2FpcmFrIiwiYSI6ImNpcWFkeHZvZjAxcGNmbmtremEwNmV5ajkifQ.cOseeBhCXFdDPp06el09yQ'
}).addTo(mymap);


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#f57f17;' + '"></i>'
        + 'Warning Zone</div><br>' ;
    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#F4C182;' + '"></i>'
        + 'Watch Zone</div><br>' ;
    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#e0e0e0;' + '"></i>'
        + 'Likely Tracks Area</div><br>' ;

    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#ef5350;' + '"></i>'
        + 'Very Destructive</div> <br>' ;
    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#e57373;' + '"></i>'
        +'Destructive</div><br>' ;
    div.innerHTML += '<div><i class="legend-icon" style="background:' + '#ef9a9a;' + '"></i>'
        + 'Damaging</div>' ;

    return div;
};

legend.addTo(mymap);

//renderShapeFiles(mymap);

var names= ["IDW60266", "IDD65401", "IDQ65248",
    "IDW60267",  "IDD65402" ,   "IDQ65249",
    "IDW60268",  "IDQ65251" ,   "IDQ65250",
    "IDD65408",  "IDW60283" ,   "IDD65409"
];


$.getJSON("config/config.json", function(json) {
    var showNewCyclone = json.showNewCyclone? json.showNewCyclone: false;
    var showOldCyclone = json.showOldCyclone? json.showOldCyclone: false;

    if(showNewCyclone){
        names.forEach(function(n){
            $.ajax({
                type: "GET",
                url: 'data/cyclone/'+n+".gml",
                dataType: "xml",
                success: xmlParser
            });
            function xmlParser(xml) {
                var xml = $(xml);
                var name= "";
                var start="";
                var split=[];

                // find the name of the cyclone
                if(xml.find('distName')){
                    name = xml.find('distName').text();
                }

                // invisible marker with name
                if(xml.find('lineString') ){
                    var ls= xml.find('lineString');
                    if(ls[0] && ls[0].children && ls[0].children[0]) {
                        start = xml.find('lineString')[0].children[0].textContent;
                        split = start.split("\n");
                        if(split.length>0) {
                            split = split[split.length - 1].split(",");
                            if(split && split.length>0) {
                                var marker1 = L.marker([split[1], split[0]], {opacity: 0.01}).addTo(mymap);
                                marker1.bindTooltip(L.tooltip({
                                    direction: 'top',
                                    permanent: true
                                }).setContent(name)).openTooltip();
                            }
                        }
                    }
                }

                renderShapeFiles(mymap, 'data/cyclone/'+n);
            }
        });
    }

    if(showOldCyclone)
        renderTrack(mymap, "data/old/track.json");
});

