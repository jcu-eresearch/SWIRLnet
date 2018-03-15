


  var defaultCharts=[];
  var defaultChart=false;
  var defaultHeadings=[];
  var otherHeadings=[];
  //TODO: read these paths from the config file
  var currentDir="data/processed/";
  var oldDir="data/old/processed/";
  var maxRange=150;

  var createContent= function () {
      for (var i = 1; i < 7; i++) {
          var content = '<div class="card cts-card t'+i+'">' +
              '<div class="card-body">' +
              '<h4 class="card-title"></h4>' +
              '<h6 class="card-subtitle mb-2 text-muted"></h6>' +
              '<div id="carousel-'+i+'" class="carousel slide" data-ride="carousel" data-interval="false">' +
              '<div class="carousel-inner">' +
              '<div class="carousel-item active text-center">' +
              '<div id="t'+i+'-wind" class="cts-chart"></div>' +
              '</div>' +
              '<div class="carousel-item text-center">' +
              '<div id="t'+i+'-pressure" class="cts-chart"></div>' +
              '</div>' +
              '</div>' +
              '<a class="carousel-control-prev" href="#carousel-'+i+'" role="button" data-slide="prev">' +
              '<i class="fa fa-chevron-circle-left" data-toggle="tooltip" data-placement="left" title="Click to view previous chart"></i>' +
              '</a>' +
              '<a class="carousel-control-next" href="#carousel-'+i+'" role="button" data-slide="next" >' +
              '<i class="fa fa-chevron-circle-right" data-toggle="tooltip" data-placement="left" title="Click to view next chart"></i>' +
              '</a>' +
              '</div>' +
              '<div class="btn-group cts-btn-group" data-toggle="buttons">' +
              '<label class="btn btn-outline-secondary active t'+i+'-wind-current">' +
              '<input type="radio" name="options" id="t'+i+'-wind-current" autocomplete="off" checked>' +
              '</label>' +
              '<label class="btn btn-outline-secondary t'+i+'-wind-old">' +
              '<input type="radio" name="options" id="t'+i+'-wind-old" autocomplete="off">' +
              '</label>' +
              '</div>' +
              '</div>' +
              '</div>';
          $(".cts-content").append(content);
      }
  };
  createContent();

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

  var showDiv= function(id){
      $(".t"+id).css({
          'position':'inherit',
          'left':'0'
      });
      for(var i=1; i<=6; i++) {
          Plotly.Plots.resize(plots[(i-1) * 2]);
          Plotly.Plots.resize(plots[(i-1) * 2 + 1]);
      }
  };

  var hideDiv= function(id){
      $(".t"+id).css({
          'position':'absolute',
          'left':'-2000px',
          'top':'-2000px'
      });
  };

  var hideExcept= function(id){
      for(var i=1; i<=8; i++){
          if(i!= id)
              hideDiv(i);
      }
  };

  $( "#move-1" ).click(function() {
      showDiv(1);
      hideExcept(1);
  });
  $( "#move-2" ).click(function() {
      showDiv(2);
      hideExcept(2);
  });
  $( "#move-3" ).click(function() {
      showDiv(3);
      hideExcept(3);
  });
  $( "#move-4" ).click(function() {
      showDiv(4);
      hideExcept(4);
  });
  $( "#move-5" ).click(function() {
      showDiv(5);
      hideExcept(5);
  });

  $( "#move-6" ).click(function() {
      showDiv(6);
      hideExcept(6);
  });

  $( "#move-7" ).click(function() {
      showDiv(7);
      hideExcept(7);
  });

  $( "#move-8" ).click(function() {
      showDiv(8);
      hideExcept(8);
  });

  $('#selector button').click(function() {
      $(this).addClass('active').siblings().removeClass('active');

  });

  var setHandler= function(x, chartNum, colNum, dir, tp, df, hds){
      $(document).on('change', 'input:radio[id="t'+chartNum+tp+df+'"]',
          (function () {
              return function() {
                  makeplotWind(dir + "t" + chartNum + ".csv", "t" + chartNum +"-wind");
                  makeplotWeather(dir + "t" + chartNum + ".csv", "t" + chartNum +"-pressure");
                  defaultCharts[x][colNum] = !(defaultCharts[x][colNum]);
                  var selected=$(".t"+chartNum);
                  selected.find( "h4" ).html(hds[x].h4);
                  selected.find( "h6" ).html(hds[x].h6);
              }
      })());
  };

  var ranges={};

  $(function () {
      $('[data-toggle="tooltip"]').tooltip({
          trigger : 'hover'
      });
  });

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

  var renderShapeFiles = function(mymap){



      var shpfile = new L.Shapefile('data/windarea.zip', {

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

      var shpfile1 = new L.Shapefile('data/track.zip', {
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



      var shpfile2 = new L.Shapefile('data/areas.zip', {

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


      var shpfile3 = new L.Shapefile('data/fix.zip', {
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
  };

  var defineVideoPopup = function(id, source1, source2) {
      var popupText = '<video id="my-video" class="video-js" controls preload="auto" width="300" height="225"\n' +
          '           data-setup="{}">\n' +
          '<source src="'+source1+'" type=\'video/mp4\'>\n' +
          '\n' +
          '<p class="vjs-no-js">\n' +
          'To view this video please enable JavaScript, and consider upgrading to a web browser that\n' +
          '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\n' +
          '</p>\n' +
          '</video>';
      return popupText;
  };

  $.getJSON("config/config.json", function(json) {

        var mymap = L.map('mapid', { maxZoom: 10}).setView([-20.311542, 148.588719], 8);

        L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
          , {
              attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '+
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox.streets-satellite',
              accessToken: 'pk.eyJ1Ijoic2FpcmFrIiwiYSI6ImNpcWFkeHZvZjAxcGNmbmtremEwNmV5ajkifQ.cOseeBhCXFdDPp06el09yQ'
        }).addTo(mymap);

        mymap.setZoom(5);
        mymap.scrollWheelZoom.disable();

        var mGroup=[];
        defaultChart=false;
        var defaultDir=oldDir;
        var otherDir=currentDir;
        var defaultLabel=0;
        var otherLabel=1;
        var defaultLocs=json.locationsOld? json.locationsOld: [] ;
        var otherLocs=json.locations? json.locations: [] ;

        var showNewCyclone = json.showNewCyclone? json.showNewCyclone: false;
        var showOldCyclone = json.showOldCyclone? json.showOldCyclone: false;

        if(json.defaultCharts==="current"){
            defaultChart=true;
            defaultDir=currentDir;
            otherDir=oldDir;
            defaultLabel=1;
            otherLabel=0;
            defaultLocs=json.locations ? json.locations: [];
            otherLocs=json.locationsOld? json.locationsOld: [] ;
        }

        if( (json.defaultCharts==="current" && !json.showOld) ||  (json.defaultCharts==="old" && !json.showCurrent)){
            $(".cts-btn-group").hide();
        }

        if(json.yAxesLimits && json.yAxesLimits.wind && json.yAxesLimits.wind.length>1){
          maxRange=json.yAxesLimits.wind[1];
        }

        var towerIcon = L.icon({
          iconUrl: 'images/tower.png',
          iconSize:     [30, 30], // size of the icon
          iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
          popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
        });

        if(json &&  defaultLocs && defaultLocs.length>0){
            for (var i=0; i< defaultLocs.length; i++){

                var l=defaultLocs[i];

                var marker1=L.marker([l.lat, l.lon]).addTo(mymap);
                      marker1.bindTooltip(L.tooltip({
                        direction: l.label,
                        permanent: true
                      })
                      .setContent(l.chartHeading));//.openTooltip();

                marker1.bindPopup("SWIRLnet "+l.name);

                mGroup.push (marker1);
                var num=i+1;

                var selected=$(".t"+num);
                selected.find( "h4" ).html(l.chartHeading);
                selected.find( "h6" ).html(l.chartSubheading);

                defaultHeadings.push({h4: l.chartHeading, h6: l.chartSubheading});

                //Labelling the toggle buttons
                var bg='<input type="radio" name="options" id="t';
                var ed='" autocomplete="off" checked>';
                if(json.dateRanges && json.dateRanges.length>1) {
                    $(".t" + num + " .t" + num + "-wind-current").html(bg + num + '-wind-current' + ed + json.dateRanges[defaultLabel].name);
                    $(".t" + num + " .t" + num + "-wind-old").html(bg + num + '-wind-old' + ed + json.dateRanges[otherLabel].name);
                    $(".t" + num + " .t" + num + "-pressure-current").html(bg + num + '-pressure-current' + ed + json.dateRanges[defaultLabel].name);
                    $(".t" + num + " .t" + num + "-pressure-old").html(bg + num + '-pressure-old' + ed + json.dateRanges[otherLabel].name);
                }
            }

            //Collect the headings for non-default locations if different from default locations
            for(var k=0; k<otherLocs.length; k++){
                var lo=otherLocs[k];
                otherHeadings.push({h4: lo.chartHeading, h6: lo.chartSubheading});
            }


            for(var x=0; x<json.locations.length; x++){
                defaultCharts.push([]);
                for (var y=0; y<2; y++)
                    defaultCharts[x].push(defaultChart);
                var chartNum=x+1;
                var colNum=0;

                //handling the toggle buttons
                setHandler(x, chartNum, colNum, otherDir, "-wind", "-old", otherHeadings);
                setHandler(x, chartNum, colNum, defaultDir, "-wind", "-current", defaultHeadings);
                setHandler(x, chartNum, colNum, otherDir, "-pressure", "-old", otherHeadings);
                setHandler(x, chartNum, colNum, defaultDir, "-pressure", "-current", defaultHeadings);
            }
        }
        var group = new L.featureGroup(mGroup);

        if(showNewCyclone)
            renderShapeFiles(mymap);

        if(showOldCyclone)
            renderTrack(mymap, "data/old/track.json");


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
        }).addTo(mymap);

        var lastZoom;
        mymap.on('zoomend', ( function(mymap){
              return function() {
                  var zoom = mymap.getZoom();
                  if (zoom < 7 && (!lastZoom || lastZoom >= 7)) {
                      mymap.eachLayer(function(l) {
                          if (l.getTooltip) {
                              var toolTip = l.getTooltip();
                              if (toolTip) {
                                  mymap.closeTooltip(toolTip);
                              }
                          }
                      });
                  } else if (zoom >= 7 && (!lastZoom || lastZoom < 7)) {
                      mymap.eachLayer(function(l) {
                          if (l.getTooltip) {
                              var toolTip = l.getTooltip();
                              if (toolTip) {
                                  mymap.addLayer(toolTip);
                              }
                          }
                      });
                  }
                  lastZoom = zoom;
              };
          })(mymap)
        );


        renderDefaultCharts(defaultChart);
  });

  function makeplotWind(path, id) {
    Plotly.d3.csv(path, function(data){ processWindData(data, id) } );
  }

  function makeplotWeather(path, id) {
    Plotly.d3.csv(path, function(data){ processWeatherData(data, id) } );
  }

  function processWindData(allRows, id) {
    var x = [], y1 = [], y2= [];
    var y3 = [], y4 = [], y5= [], y6=[];
    for (var i=0; i<allRows.length; i++) {
      row = allRows[i];
      x.push( row['TIMESTAMP'] );
      y1.push( row['Kmh_Max3Sec'] );
      y2.push( row['WS_kmh_3SecAvg_TMx'] );
      y3.push(row['WindDir_3sec']);
      y4.push( parseFloat(row['Kmh_Mean']).toFixed(2) );
      y5.push( parseFloat(row['WindDir_MeanVect']).toFixed(2) );
      y6.push(row['Kmh_StDev']);
    }
    makePlotlyWind(x , y1, y2, y3, y4, y5, y6, id);
  }

  function processWeatherData(allRows, id) {
    var x = [], y1 = [], y2= [];
    for (var i=0; i<allRows.length; i++) {
      row = allRows[i];
      x.push( row['TIMESTAMP'] );
      y1.push( row['Kmh_Max3Sec'] );
      y2.push( row['Pressure'] );
    }
    makePlotlyWeather(x , y1, y2, id);
  }

  function makePlotlyWeather( x, y1, y2, id ){
    var traces1 = [{
      x: x,
      y: y1,
      name: 'Max 3-sec Gust',
      line: {
        color: "red"
      }
    },{
      x: x,
      y: y2,
      yaxis: 'y2',
      name: 'Pressure',
      line: {
        color: "blue"
      }
    }];
    var layout = {
      yaxis:{
        title: 'Wind Speed km/h',
        autorange: false,
        fixedrange:true,
        range: [0, maxRange]
      },
      yaxis2:{
        autorange: false,
        fixedrange:true,
        title: 'Pressure hPa',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        zeroline: false,
        range: [960, 1020]
      },
      legend: {
          "orientation": "h",
          x: 0,
          y: -0.2
      }
    };

    Plotly.newPlot(id, traces1, layout);
  }

  function makePlotlyWind( x, y1, y2, y3, y4, y5, y6, id){
    var traces1 = [{
      x: x,
      y: y1,
      name: 'Max 3-sec Gust',
      line: {
        color: "red"
      }
    },{
      x: x,
      y: y4,
      name: '10 Minute Mean',
      line: {
        color: "gray"
      }
    },{
      x: x,
      y: y5,
      name: 'Direction',
      yaxis: 'y2',
      type: 'scatter',
      mode: "markers",
      color: "black",   
      marker: { size: 2.5, color: "black" }
    }];

    var layout = {
      yaxis:{
          title: 'Wind Speed km/h',
          autorange: false,
          fixedrange:true,
          range:[0,maxRange]
      },
      yaxis2: {
        title: 'Direction',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        autorange: false,
        fixedrange: true, 
        zeroline: false,
        range: [0,360]
      },
      legend: {
          "orientation": "h",
          x: 0,
          y: -0.2
      }
    };
    Plotly.newPlot(id, traces1,layout);
  };

  var d3 = Plotly.d3;
  var plots=[];

  var getNodes= function(){
      for (var i=1; i<=6; i++){
          plots.push((d3.select('div[id="t'+i+'-wind"]')).node());
          plots.push((d3.select('div[id="t'+i+'-pressure"]')).node());
      }
  };

  getNodes();

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


