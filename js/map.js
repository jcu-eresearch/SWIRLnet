var swirlnetMap = {

    mapObject: "",
    accessToken: 'pk.eyJ1Ijoic2FpcmFrIiwiYSI6ImNpcWFkeHZvZjAxcGNmbmtremEwNmV5ajkifQ.cOseeBhCXFdDPp06el09yQ',
    markers: [],
    lastZoom: "",

    setAccessToken: function (token) {
        this.accessToken = token;
    },

    createMapDiv: function (map) {
        var mapDiv = '<div class="card cts-card leaflet-map">' +
            '<div class="card-body">' +
            '<h4 class="card-title">' + map.title + '</h4>' +
            '<h6 class="card-subtitle mb-2 text-muted">Towers</h6>' +
            '<div id="' + map.id + '" class="custom-popup cts-map"></div>' +
            '</div>' +
            '</div>';
        $(map.parent).append(mapDiv);
    },

    initMap: function (map) {
        if (!map || !map.id) return;
        this.createMapDiv(map);
        this.mapObject = L.map(map.id, {maxZoom: 10}).setView([-20.311542, 148.588719], 8);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
            'contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets-satellite',
            accessToken: this.accessToken
        }).addTo(this.mapObject);
        this.mapObject.scrollWheelZoom.disable();
    },

    addMarkers: function (locations) {
        if (!this.mapObject || !locations || locations.length < 1) return;
        locations.forEach( (function(mapObject, markers) {
            return function (l) {
                var marker = L.marker([l.lat, l.lon])
                    .addTo(mapObject);

                marker.bindTooltip(L.tooltip({
                    direction: l.label,
                    permanent: true
                }).setContent(l.name));
                marker.bindPopup("SWIRLnet " + l.name);
                markers.push(marker);
            };
        })(this.mapObject, this.markers));
        this.addZoomHandler();
    },

    renderTrack: function (trackFile) {
        if (!this.mapObject) return;
        $.getJSON(trackFile,  (function (mapObject) {
            return function (json) {
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
                L.geoJson(json, {
                    style: myStyle,
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                }).addTo(mapObject);
            };
        })(this.mapObject));
    },

    addZoomHandler: function () {
        if (!this.mapObject) return;
        this.mapObject.on('zoomend', (function (mapObject, lastZoom) {
                return function () {
                    var zoom = mapObject.getZoom();
                    if (zoom < 7 && (!lastZoom || lastZoom >= 7)) {
                        mapObject.eachLayer(function (l) {
                            if (l.getTooltip) {
                                var toolTip = l.getTooltip();
                                if (toolTip) {
                                    mapObject.closeTooltip(toolTip);
                                }
                            }
                        });
                    } else if (zoom >= 7 && (!lastZoom || lastZoom < 7)) {
                        mapObject.eachLayer(function (l) {
                            if (l.getTooltip) {
                                var toolTip = l.getTooltip();
                                if (toolTip) {
                                    mapObject.addLayer(toolTip);
                                }
                            }
                        });
                    }
                    lastZoom = zoom;
                };
            })(this.mapObject, this.lastZoom)
        );
    },

    fitBounds: function(){
        var group = new L.featureGroup(this.markers);
        this.mapObject.fitBounds(group.getBounds());
    },

    addPopUps: function (){
        //Adding popups to the markers
        L.geoJson({features:[]},{
            onEachFeature:function popUp(f,l){
                var out = [];
                if (f.properties){
                    for(var key in f.properties){
                        out.push(key+": "+f.properties[key]);
                    }
                    l.bindPopup(out.join("<br />"));
                }
            }
        }).addTo(this.mapObject);
    },

    renderCyclone: function () {}
};