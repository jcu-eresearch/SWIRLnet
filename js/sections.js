var swirlnetSections = {

    plots : [],
    d3: Plotly.d3,
    maxRange : 150,

    setMaxRange: function(x){
        this.maxRange = x;
    },

    makeplotWind: function makeplotWind(path, id) {
        Plotly.d3.csv(path, function(data){ processWindData(data, id) } );
    },

    createNav: function (parent, id) {
        var nav =  '<div class="card cts-card no-border">'+
            '<div id="selector" class="card-body">'+
            '<button type="button" class="btn btn-light active " id="move-1'+id+'">Tower 1</button>'+
            '<button type="button" class="btn btn-light" id="move-2'+id+'">Tower 2</button>'+
            '<button type="button" class="btn btn-light" id="move-3'+id+'">Tower 3</button>'+
            '<button type="button" class="btn btn-light" id="move-4'+id+'">Tower 4</button>'+
            '<button type="button" class="btn btn-light" id="move-5'+id+'">Tower 5</button>'+
            '<button type="button" class="btn btn-light" id="move-6'+id+'">Tower 6</button>'+
            '<button type="button" class="btn btn-light" id="move-7'+id+'">Camera 1</button>'+
            '<button type="button" class="btn btn-light" id="move-8'+id+'">Camera 2</button>'+
            '</div>'+
            '</div>';
        $(parent).append(nav);
    },

    createVideo: function (parent, id, source, name) {
    var vid = '<div class="card cts-card t'+id+'" >' +
        '<div class="card-body">' +
        '<h4 class="card-title">'+name+'</h4>' +
        '<h6 class="card-subtitle mb-2 text-muted">Timelapse Video</h6>' +
        '<video id="my-video" class="video-js  vjs-default-skin vjs-4-3" controls preload="auto"  height="auto" width="auto"' +
        'data-setup="{}">' +
        '<source src="'+source+'" type="video/mp4">' +
        '<p class="vjs-no-js">' +
        'To view this video please enable JavaScript, and consider upgrading to a web browser that' +
        '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>' +
        '</p>' +
        '</video>' +
        '</div>' +
        '</div>';
    $(parent).append(vid);
},

    createTowers: function (parent, event) {
        for (var i = 1; i < 7; i++) {
            var content = '<div class="card cts-card t'+i+event+'">' +
                '<div class="card-body">' +
                '<h4 class="card-title"></h4>' +
                '<h6 class="card-subtitle mb-2 text-muted"></h6>' +
                '<div id="carousel-'+i+event+'" class="carousel slide" data-ride="carousel" data-interval="false">' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active text-center">' +
                '<div id="t'+i+event+'-wind" class="cts-chart"></div>' +
                '</div>' +
                '<div class="carousel-item text-center">' +
                '<div id="t'+i+event+'-pressure" class="cts-chart"></div>' +
                '</div>' +
                '</div>' +
                '<a class="carousel-control-prev" href="#carousel-'+i+event+'" role="button" data-slide="prev">' +
                '<i class="fa fa-chevron-circle-left" data-toggle="tooltip" data-placement="left" title="Click to view previous chart"></i>' +
                '</a>' +
                '<a class="carousel-control-next" href="#carousel-'+i+event+'" role="button" data-slide="next" >' +
                '<i class="fa fa-chevron-circle-right" data-toggle="tooltip" data-placement="left" title="Click to view next chart"></i>' +
                '</a>' +
                '</div>' +
                '<div class="btn-group cts-btn-group" data-toggle="buttons">' +
                '<label class="btn btn-outline-secondary active t'+i+event+'-wind-current">' +
                '<input type="radio" name="options" id="t'+i+event+'-wind-current" autocomplete="off" checked>' +
                '</label>' +
                '<label class="btn btn-outline-secondary t'+i+event+'-wind-old">' +
                '<input type="radio" name="options" id="t'+i+event+'-wind-old" autocomplete="off">' +
                '</label>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(parent).append(content);
        }
    },

    makeplotWeather: function(path, id) {
        Plotly.d3.csv(path, function(data){ processWeatherData(data, id) } );
    },

    hideExcept: function(id){
        for(var i=1; i<=8; i++){
            if(i != id)
                hideDiv(i);
        }
    },

    showDiv: function(id){
        $(".t"+id).css({
            'position':'inherit',
            'left':'0'
        });
    },

    hideDiv: function(id){
        $(".t"+id).css({
            'position':'absolute',
            'left':'-2000px',
            'top':'-2000px'
        });
    },

    processWindData: function(allRows, id) {
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
    },

    processWeatherData: function(allRows, id) {
        var x = [], y1 = [], y2= [];
        for (var i=0; i<allRows.length; i++) {
            row = allRows[i];
            x.push( row['TIMESTAMP'] );
            y1.push( row['Kmh_Max3Sec'] );
            y2.push( row['Pressure'] );
        }
        makePlotlyWeather(x , y1, y2, id);
    },

    makePlotlyWeather: function( x, y1, y2, id ){
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
    },

    makePlotlyWind: function( x, y1, y2, y3, y4, y5, y6, id){
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
    }
};