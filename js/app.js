



  $.getJSON("config/config.json", function(json) {


        var mymap = L.map('mapid', {minZoom: 7, maxZoom: 10}).setView([-20.311542, 148.588719], 8); 
        var mGroup=[];

        if(json && json.locations && json.locations.length>0){

            for (var i=0; i< json.locations.length; i++){
                var l=json.locations[i];
                var marker1=L.marker([l.lat, l.lon]).addTo(mymap);
                      marker1.bindTooltip(L.tooltip({
                        direction: l.label,
                        permanent: true
                      })
                      .setContent(l.name)).openTooltip();
                mGroup.push (
                    marker1

                );

                var num=i+1;

                $( ".t"+num ).find( "h4" ).html(l.chartHeading);
                $( ".t"+num ).find( "h6" ).html(l.chartSubheading);

                $( ".t"+num+" .t"+num+"-wind-current" ).html('<input type="radio" name="options" id="t'+num+'-wind-current" autocomplete="off" checked>'+ json.dateRanges[0].name);
                $( ".t"+num+" .t"+num+"-wind-old" ).html('<input type="radio" name="options" id="t'+num+'-wind-old" autocomplete="off" checked>'+ json.dateRanges[1].name);

                $( ".t"+num+" .t"+num+"-pressure-current" ).html('<input type="radio" name="options" id="t'+num+'-pressure-current" autocomplete="off" checked>'+json.dateRanges[0].name);
                $( ".t"+num+" .t"+num+"-pressure-old" ).html('<input type="radio" name="options" id="t'+num+'-pressure-old" autocomplete="off" checked>'+json.dateRanges[1].name);

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




  });

  var currentDir="data/processed/";
  var oldDir="data/old/processed/";

  var t11show="old";
  var t12show="old";
  var t21show="old";
  var t22show="old";
  var t31show="old";
  var t32show="old";
  var t41show="old";
  var t42show="old";
  var t51show="old";
  var t52show="old";
  var t61show="old";
  var t62show="old";

  $(document).on('change', 'input:radio[id="t1-wind-old"]', function (event) {
      makeplotWind(currentDir+"t1.csv", "t1-wind");
      t11show="current";
  });

  $(document).on('change', 'input:radio[id="t1-wind-current"]', function (event) {
      makeplotWind(oldDir+"t1.csv", "t1-wind");
      t11show="old";
  });

  $(document).on('change', 'input:radio[id="t1-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t1.csv", "t1-pressure");
      t12show="current";
  });

  $(document).on('change', 'input:radio[id="t1-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t1.csv", "t1-pressure");
      t12show="old";
  });


  $(document).on('change', 'input:radio[id="t2-wind-old"]', function (event) {
      makeplotWind(currentDir+"t2.csv", "t2-wind");
      t21show="current";
  });

  $(document).on('change', 'input:radio[id="t2-wind-current"]', function (event) {
      makeplotWind(oldDir+"t2.csv", "t2-wind");
      t21show="old";
  });

  $(document).on('change', 'input:radio[id="t2-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t2.csv", "t2-pressure");
      t22show="current";
  });

  $(document).on('change', 'input:radio[id="t2-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t2.csv", "t2-pressure");
      t22show="old";
  });


  $(document).on('change', 'input:radio[id="t3-wind-old"]', function (event) {
      makeplotWind(currentDir+"t3.csv", "t3-wind");
      t31show="current";
  });

  $(document).on('change', 'input:radio[id="t3-wind-current"]', function (event) {
      makeplotWind(oldDir+"t3.csv", "t3-wind");
      t31show="old";
  });

  $(document).on('change', 'input:radio[id="t3-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t3.csv", "t3-pressure");
      t32show="current";
  });

  $(document).on('change', 'input:radio[id="t3-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t3.csv", "t3-pressure");
      t32show="current";
  });



  $(document).on('change', 'input:radio[id="t4-wind-old"]', function (event) {
      makeplotWind(currentDir+"t4.csv", "t4-wind");
      t41show="current";
  });

  $(document).on('change', 'input:radio[id="t4-wind-current"]', function (event) {
      makeplotWind(oldDir+"t4.csv", "t4-wind");
      t41show="old";
  });

  $(document).on('change', 'input:radio[id="t4-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t4.csv", "t4-pressure");
      t42show="current";
  });

  $(document).on('change', 'input:radio[id="t4-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t4.csv", "t4-pressure");
      t42show="old";
  });



  $(document).on('change', 'input:radio[id="t5-wind-old"]', function (event) {
      makeplotWind(currentDir+"t5.csv", "t5-wind");
      t51show="current";
  });

  $(document).on('change', 'input:radio[id="t5-wind-current"]', function (event) {
      makeplotWind(oldDir+"t5.csv", "t5-wind");
      t51show="old";
  });

  $(document).on('change', 'input:radio[id="t5-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t5.csv", "t5-pressure");
      t52show="current";
  });

  $(document).on('change', 'input:radio[id="t5-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t5.csv", "t5-pressure");
      t52show="old";
  });




  $(document).on('change', 'input:radio[id="t6-wind-old"]', function (event) {
      makeplotWind(currentDir+"t6.csv", "t6-wind");
      t61show="current";
  });

  $(document).on('change', 'input:radio[id="t6-wind-current"]', function (event) {
      makeplotWind(oldDir+"t6.csv", "t6-wind");
      t61show="old";
  });

  $(document).on('change', 'input:radio[id="t6-pressure-old"]', function (event) {
      makeplotWeather(currentDir+"t6.csv", "t6-pressure");
      t62show="current";
  });

  $(document).on('change', 'input:radio[id="t6-pressure-current"]', function (event) {
      makeplotWeather(oldDir+"t6.csv", "t6-pressure");
      t62show="old";
  });


  function makeplotWind(path, id) {
    Plotly.d3.csv(path, function(data){ processWindData(data, id) } );
  }

  function makeplotWeather(path, id) {
    Plotly.d3.csv(path, function(data){ processWeatherData(data, id) } );
  }

  function parseDatesArray(x){
    var x1=[];
    if(x && x.length>0)
    x.forEach(function (d) {
      var dt=null;
      if(d){
        if(d.charAt(2)=='/'){
          if(d.charAt(4)=='/'){
            if(d.charAt(9)==':')
              dt=moment(d, 'DD/M/YY H:mm', true).format();
            else if(d.charAt(10)==':')
              dt=moment(d, 'DD/M/YY HH:mm', true).format();
          }
          else if(d.charAt(5)=='/'){
            if(d.charAt(10)==':')
              dt=moment(d, 'DD/MM/YY H:mm', true).format();
            else if(d.charAt(11)==':')
              dt=moment(d, 'DD/MM/YY HH:mm', true).format();
          }
        }
        else if(d.charAt(1)=='/'){
          if(d.charAt(3)=='/'){
            if(d.charAt(8)==':')
              dt=moment(d, 'D/M/YY H:mm', true).format();
            else if(d.charAt(9)==':')
              dt=moment(d, 'D/M/YY HH:mm', true).format();
          }
          else if(d.charAt(4)=='/'){
            if(d.charAt(9)==':')
              dt=moment(d, 'D/MM/YY H:mm', true).format();
            else if(d.charAt(10)==':')
              dt=moment(d, 'D/MM/YY HH:mm', true).format();
          }
        }
        else if(d.charAt(4)=='-')//2017-03-26 18:10:00
          dt=moment(d, 'YYYY-MM-DD HH:mm:ss', true).format();
      }
      x1.push(dt);
    });
    return x1;
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
        title: 'Wind Speed kmh/h',
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
          title: 'Wind Speed kmh/h',
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


  makeplotWind(oldDir+"t1.csv", "t1-wind");
  makeplotWeather(oldDir+"t1.csv", "t1-pressure");

  makeplotWind(oldDir+"t2.csv", "t2-wind");
  makeplotWeather(oldDir+"t2.csv", "t2-pressure");

  makeplotWind(oldDir+"t3.csv", "t3-wind");
  makeplotWeather(oldDir+"t3.csv", "t3-pressure");

  makeplotWind(oldDir+"t4.csv", "t4-wind");
  makeplotWeather(oldDir+"t4.csv", "t4-pressure");

  makeplotWind(oldDir+"t5.csv", "t5-wind");
  makeplotWeather(oldDir+"t5.csv", "t5-pressure");

  makeplotWind(oldDir+"t6.csv", "t6-wind");
  makeplotWeather(oldDir+"t6.csv", "t6-pressure");

  var d3 = Plotly.d3;

  var t1w = d3.select("div[id='t1-wind']");
  var t1w = t1w.node();
  var t1p = d3.select("div[id='t1-pressure']");
  var t1p = t1p.node();

  var t2w = d3.select("div[id='t2-wind']");
  var t2w = t2w.node();
  var t2p = d3.select("div[id='t2-pressure']");
  var t2p = t2p.node();


  var t3w = d3.select("div[id='t3-wind']");
  var t3w = t3w.node();
  var t3p = d3.select("div[id='t3-pressure']");
  var t3p = t3p.node();

  var t4w = d3.select("div[id='t4-wind']");
  var t4w = t4w.node();
  var t4p = d3.select("div[id='t4-pressure']");
  var t4p = t4p.node();


  var t5w = d3.select("div[id='t5-wind']");
  var t5w = t5w.node();
  var t5p = d3.select("div[id='t5-pressure']");
  var t5p = t5p.node();


  var t6w = d3.select("div[id='t6-wind']");
  var t6w = t6w.node();
  var t6p = d3.select("div[id='t6-pressure']");
  var t6p = t6p.node();

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
      if(t11show=="current")
        makeplotWind(currentDir+"t1.csv", "t1-wind");
      if(t12show=="current")    
        makeplotWeather(currentDir+"t1.csv", "t1-pressure");
      
      if(t21show=="current")
        makeplotWind(currentDir+"t2.csv", "t2-wind");
      if(t22show=="current")    
        makeplotWeather(currentDir+"t2.csv", "t2-pressure");
      
      if(t31show=="current")
        makeplotWind(currentDir+"t3.csv", "t3-wind");
      if(t32show=="current")    
        makeplotWeather(currentDir+"t3.csv", "t3-pressure");
      
      if(t41show=="current")
        makeplotWind(currentDir+"t4.csv", "t4-wind");
      if(t42show=="current")    
        makeplotWeather(currentDir+"t4.csv", "t4-pressure");
      
      if(t51show=="current")
        makeplotWind(currentDir+"t5.csv", "t5-wind");
      if(t52show=="current")    
        makeplotWeather(currentDir+"t5.csv", "t5-pressure");
      
      if(t61show=="current")
        makeplotWind(currentDir+"t6.csv", "t6-wind");
      if(t62show=="current")    
        makeplotWeather(currentDir+"t6.csv", "t6-pressure");
      
      
  };

  var interval = 1000 * 60 * 5; 

  setInterval(refresh, interval);


