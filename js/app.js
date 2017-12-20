

  $(document).on('change', 'input:radio[id="t1-wind-old"]', function (event) {
      makeplotWind("data/current/t1.csv", "t1-wind");
  });

  $(document).on('change', 'input:radio[id="t1-wind-current"]', function (event) {
      makeplotWind("data/old/t1.csv", "t1-wind");
  });

  $(document).on('change', 'input:radio[id="t1-pressure-old"]', function (event) {
      makeplotWeather("data/current/t1.csv", "t1-pressure");
  });

  $(document).on('change', 'input:radio[id="t1-pressure-current"]', function (event) {
      makeplotWeather("data/old/t1.csv", "t1-pressure");
  });


  $(document).on('change', 'input:radio[id="t2-wind-old"]', function (event) {
      makeplotWind("data/current/t2.csv", "t2-wind");
  });

  $(document).on('change', 'input:radio[id="t2-wind-current"]', function (event) {
      makeplotWind("data/old/t2.csv", "t2-wind");
  });

  $(document).on('change', 'input:radio[id="t2-pressure-old"]', function (event) {
      makeplotWeather("data/current/t2.csv", "t2-pressure");
  });

  $(document).on('change', 'input:radio[id="t2-pressure-current"]', function (event) {
      makeplotWeather("data/old/t2.csv", "t2-pressure");
  });


  $(document).on('change', 'input:radio[id="t3-wind-old"]', function (event) {
      makeplotWind("data/current/t3.csv", "t3-wind");
  });

  $(document).on('change', 'input:radio[id="t3-wind-current"]', function (event) {
      makeplotWind("data/old/t3.csv", "t3-wind");
  });

  $(document).on('change', 'input:radio[id="t3-pressure-old"]', function (event) {
      makeplotWeather("data/current/t3.csv", "t3-pressure");
  });

  $(document).on('change', 'input:radio[id="t3-pressure-current"]', function (event) {
      makeplotWeather("data/old/t3.csv", "t3-pressure");
  });



  $(document).on('change', 'input:radio[id="t4-wind-old"]', function (event) {
      makeplotWind("data/current/t4.csv", "t4-wind");
  });

  $(document).on('change', 'input:radio[id="t4-wind-current"]', function (event) {
      makeplotWind("data/old/t4.csv", "t4-wind");
  });

  $(document).on('change', 'input:radio[id="t4-pressure-old"]', function (event) {
      makeplotWeather("data/current/t4.csv", "t4-pressure");
  });

  $(document).on('change', 'input:radio[id="t4-pressure-current"]', function (event) {
      makeplotWeather("data/old/t4.csv", "t4-pressure");
  });



  $(document).on('change', 'input:radio[id="t5-wind-old"]', function (event) {
      makeplotWind("data/current/t5.csv", "t5-wind");
  });

  $(document).on('change', 'input:radio[id="t5-wind-current"]', function (event) {
      makeplotWind("data/old/t5.csv", "t5-wind");
  });

  $(document).on('change', 'input:radio[id="t5-pressure-old"]', function (event) {
      makeplotWeather("data/current/t5.csv", "t5-pressure");
  });

  $(document).on('change', 'input:radio[id="t5-pressure-current"]', function (event) {
      makeplotWeather("data/old/t5.csv", "t5-pressure");
  });




  $(document).on('change', 'input:radio[id="t6-wind-old"]', function (event) {
      makeplotWind("data/current/t6.csv", "t6-wind");
  });

  $(document).on('change', 'input:radio[id="t6-wind-current"]', function (event) {
      makeplotWind("data/old/t6.csv", "t6-wind");
  });

  $(document).on('change', 'input:radio[id="t6-pressure-old"]', function (event) {
      makeplotWeather("data/current/t6.csv", "t6-pressure");
  });

  $(document).on('change', 'input:radio[id="t6-pressure-current"]', function (event) {
      makeplotWeather("data/old/t6.csv", "t6-pressure");
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
    debugger;
    for (var i=0; i<allRows.length; i++) {
      row = allRows[i];
      x.push( row['TIMESTAMP'] );
      y1.push( row['Kmh_Max3Sec'] );
      y2.push( row['WS_kmh_3SecAvg_TMx'] );
      y3.push(row['WindDir_3sec']);
      y4.push( row['Kmh_Mean'] );
      y5.push( row['WindDir_MeanVect'] );
      y6.push(row['Kmh_StDev']);
    }
    debugger;

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
        autorange: true
      },
      yaxis2:{
        autorange: true,
        title: 'Pressure hPa',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        zeroline: false
      },
      legend: {"orientation": "h"}
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
          autorange: true
      },
      yaxis2: {
        title: 'Direction',
        titlefont: {color: 'black'},
        tickfont: {color: 'black'},
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        autorange: true,
        zeroline: false
      },
      legend: {"orientation": "h"}
    };
    Plotly.newPlot(id, traces1,layout);
  };


  makeplotWind("data/old/t1.csv", "t1-wind");
  makeplotWeather("data/old/t1.csv", "t1-pressure");

  makeplotWind("data/old/t2.csv", "t2-wind");
  makeplotWeather("data/old/t2.csv", "t2-pressure");

  makeplotWind("data/old/t3.csv", "t3-wind");
  makeplotWeather("data/old/t3.csv", "t3-pressure");

  makeplotWind("data/old/t3.csv", "t4-wind");
  makeplotWeather("data/old/t4.csv", "t4-pressure");

  makeplotWind("data/old/t5.csv", "t5-wind");
  makeplotWeather("data/old/t5.csv", "t5-pressure");

  makeplotWind("data/old/t6.csv", "t6-wind");
  makeplotWeather("data/old/t6.csv", "t6-pressure");

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

