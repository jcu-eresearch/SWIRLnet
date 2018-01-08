


  var defaultCharts=[[], [], [], [], [], []];
  var defaultChart=false;
  //TODO: read these paths from the config file
  var currentDir="data/processed/";
  var oldDir="data/old/processed/";


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
              '<div class="btn-group cts-btn-group" data-toggle="buttons">' +
              '<label class="btn btn-outline-secondary active t'+i+'-wind-current">' +
              '<input type="radio" name="options" id="t'+i+'-wind-current" autocomplete="off" checked>' +
              '</label>' +
              '<label class="btn btn-outline-secondary t'+i+'-wind-old">' +
              '<input type="radio" name="options" id="t'+i+'-wind-old" autocomplete="off">' +
              '</label>' +
              '</div>' +
              '</div>' +
              '<div class="carousel-item text-center">' +
              '<div id="t'+i+'-pressure" class="cts-chart"></div>' +
              '<div class="btn-group cts-btn-group" data-toggle="buttons">' +
              '<label class="btn btn-outline-secondary active t'+i+'-pressure-current">' +
              '<input type="radio" name="options" id="t'+i+'-pressure-current" autocomplete="off" checked>' +
              '</label>' +
              '<label class="btn btn-outline-secondary t'+i+'-pressure-old">' +
              '<input type="radio" name="options" id="t'+i+'-pressure-old" autocomplete="off">' +
              '</label>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<a class="carousel-control-prev" href="#carousel-'+i+'" role="button" data-slide="prev">' +
              '<i class="fa fa-chevron-circle-left"></i>' +
              '</a>' +
              '<a class="carousel-control-next" href="#carousel-'+i+'" role="button" data-slide="next">' +
              '<i class="fa fa-chevron-circle-right"></i>' +
              '</a>' +
              '</div>' +
              '</div>' +
              '</div>';
          $(".cts-content").append(content);
      }
  };
  createContent();

  $.getJSON("config/config.json", function(json) {

        var mymap = L.map('mapid', {minZoom: 7, maxZoom: 10}).setView([-20.311542, 148.588719], 8); 
        var mGroup=[];
        defaultChart=false;
        var defaultDir=oldDir;
        var otherDir=currentDir;
        var defaultLabel=0;
        var otherLabel=1;
        if(json.defaultCharts==="current"){
            defaultChart=true;
            defaultDir=currentDir;
            otherDir=oldDir;
            defaultLabel=1;
            otherLabel=0;
        }

        //TODO: add marker for Townsville
        if(json && json.locations && json.locations.length>0){
            for (var i=0; i< json.locations.length; i++){
                var l=json.locations[i];
                var marker1=L.marker([l.lat, l.lon]).addTo(mymap);
                      marker1.bindTooltip(L.tooltip({
                        direction: l.label,
                        permanent: true
                      })
                      .setContent(l.name)).openTooltip();
                mGroup.push (marker1);
                var num=i+1;
                var selected=$(".t"+num);
                selected.find( "h4" ).html(l.chartHeading);
                selected.find( "h6" ).html(l.chartSubheading);
                $(".t"+num+" .t"+num+"-wind-current" ).html('<input type="radio" name="options" id="t'+num+'-wind-current" autocomplete="off" checked>'+ json.dateRanges[defaultLabel].name);
                $(".t"+num+" .t"+num+"-wind-old" ).html('<input type="radio" name="options" id="t'+num+'-wind-old" autocomplete="off" checked>'+ json.dateRanges[otherLabel].name);
                $(".t"+num+" .t"+num+"-pressure-current" ).html('<input type="radio" name="options" id="t'+num+'-pressure-current" autocomplete="off" checked>'+json.dateRanges[defaultLabel].name);
                $(".t"+num+" .t"+num+"-pressure-old" ).html('<input type="radio" name="options" id="t'+num+'-pressure-old" autocomplete="off" checked>'+json.dateRanges[otherLabel].name);
            }
            for(var x=0; x< 6 ; x++){
                for (var y=0; y<2; y++)
                    defaultCharts[x].push(defaultChart);
                var chartNum=x+1;
                var colNum=0;
                $(document).on('change', 'input:radio[id="t'+chartNum+'-wind-old"]', (function (x, chartNum, colNum, dir) {
                    return function(event) {
                        makeplotWind(dir + "t" + chartNum + ".csv", "t" + chartNum + "-wind");
                        defaultCharts[x][colNum] = !(defaultCharts[x][colNum]);
                    }
                })(x, chartNum, colNum, otherDir));

                $(document).on('change', 'input:radio[id="t'+chartNum+'-wind-current"]', (function (x, chartNum, colNum, dir) {
                    return function(event) {
                        makeplotWind(dir + "t" + chartNum + ".csv", "t" + chartNum + "-wind");
                        defaultCharts[x][colNum] = !(defaultCharts[x][colNum]);
                    }
                })(x, chartNum, colNum, defaultDir));

                $(document).on('change', 'input:radio[id="t'+chartNum+'-pressure-old"]', (function (x, chartNum, colNum, dir) {
                    return function(event) {
                        makeplotWeather(dir + "t" + chartNum + ".csv", "t" + chartNum + "-pressure");
                        defaultCharts[x][colNum] = !(defaultCharts[x][colNum]);
                    }
                })(x, chartNum, colNum, otherDir));

                $(document).on('change', 'input:radio[id="t'+chartNum+'-pressure-current"]', (function (x, chartNum, colNum, dir) {
                    return function(event) {
                        makeplotWeather(dir + "t" + chartNum + ".csv", "t" + chartNum + "-pressure");
                        defaultCharts[x][colNum] = !(defaultCharts[x][colNum]);
                    }
                })(x, chartNum, colNum, defaultDir));
            }
        }
        var group = new L.featureGroup(mGroup);

        mymap.fitBounds(group.getBounds());

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoic2FpcmFrIiwiYSI6ImNpcWFkeHZvZjAxcGNmbmtremEwNmV5ajkifQ.cOseeBhCXFdDPp06el09yQ'
        }).addTo(mymap);

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
        autorange: true,
        fixedrange:true
      },
      yaxis2:{
        autorange: true,
          fixedrange:true,
        title: 'Pressure hPa',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        zeroline: false
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
          autorange: true,
          fixedrange:true
      },
      yaxis2: {
        title: 'Direction',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        autorange: true,
        fixedrange: true, 
        zeroline: false,
        
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

  var t1w = d3.select("div[id='t1-wind']");
   t1w = t1w.node();
  var t1p = d3.select("div[id='t1-pressure']");
   t1p = t1p.node();

  var t2w = d3.select("div[id='t2-wind']");
   t2w = t2w.node();
  var t2p = d3.select("div[id='t2-pressure']");
   t2p = t2p.node();


  var t3w = d3.select("div[id='t3-wind']");
   t3w = t3w.node();
  var t3p = d3.select("div[id='t3-pressure']");
   t3p = t3p.node();

  var t4w = d3.select("div[id='t4-wind']");
   t4w = t4w.node();
  var t4p = d3.select("div[id='t4-pressure']");
   t4p = t4p.node();


  var t5w = d3.select("div[id='t5-wind']");
   t5w = t5w.node();
  var t5p = d3.select("div[id='t5-pressure']");
   t5p = t5p.node();


  var t6w = d3.select("div[id='t6-wind']");
   t6w = t6w.node();
  var t6p = d3.select("div[id='t6-pressure']");
   t6p = t6p.node();

  window.onresize = function() {
    Plotly.Plots.resize(t1w);
    Plotly.Plots.resize(t1p);
    Plotly.Plots.resize(t2w);
    Plotly.Plots.resize(t2p);
    Plotly.Plots.resize(t3w);
    Plotly.Plots.resize(t3p);
    Plotly.Plots.resize(t4w);
    Plotly.Plots.resize(t4p);
    Plotly.Plots.resize(t5w);
    Plotly.Plots.resize(t5p);
    Plotly.Plots.resize(t6w);
    Plotly.Plots.resize(t6p);
  };

  $('#carousel-1').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t1w);
    Plotly.Plots.resize(t1p);
  })

  $('#carousel-2').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t2w);
    Plotly.Plots.resize(t2p);
  })
  
  $('#carousel-3').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t3w);
    Plotly.Plots.resize(t3p);
  })

  $('#carousel-4').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t4w);
    Plotly.Plots.resize(t4p);
  })

  $('#carousel-5').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t5w);
    Plotly.Plots.resize(t5p);
  })

  $('#carousel-6').on('slide.bs.carousel', function () {
    Plotly.Plots.resize(t6w);
    Plotly.Plots.resize(t6p);
  })

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


