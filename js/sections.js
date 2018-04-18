var swirlnetSections = {

    plots : [],
    d3: Plotly.d3,
    maxRange: 150,
    numTowers: 6,
    numCameras: 2,

    init: function (dir, parent, event, loc, includeCameras ){
        this.createNav(parent, event, loc, includeCameras);
        this.createTowers(parent, event, loc);
        for(var x=1; x<= 6 ; x++){
            this.makeplotWind(dir+"t"+x+".csv", "t"+x+event+"-wind");
            this.makeplotWeather(dir+"t"+x+".csv", "t"+x+event+"-pressure");
            var selected=$(".t"+x+event);
            if(loc && loc.lenght<=x) {
                selected.find("h4").html(loc[x - 1].name);
                selected.find("h6").html(loc[x - 1].place);
            }
        }

        var interval = 1000 * 60 * 5;
        setInterval(this.refresh, interval);

        if(includeCameras && includeCameras[0] && includeCameras[0].display) {
            this.createVideo(parent, 7 + event, includeCameras[0].source, includeCameras[0].name);
        }
        else {
            this.createVideoAlternate(parent, 7 + event, '', includeCameras[0].name);
        }

        if(includeCameras && includeCameras[1] && includeCameras[1].display) {
            this.createVideo(parent, 8 + event, includeCameras[1].source, includeCameras[1].name);
        }
        else {
            this.createVideoAlternate(parent, 8 + event, '', includeCameras[1].name);
        }

        this.getNodes(event);
        this.addClickHandlers(event);
        this.initComponents(event);

    },

    setMaxRange: function(x){
        this.maxRange = x;
    },

    createNav: function (parent, id, loc, includeCameras) {
        var headings=[];
        var cameras=[];
        for (var j=0; j<this.numTowers ; j++){
            headings.push({
                name: "Tower"+(j+1)
            });
        }
        for (j=0; j<this.numCameras ; j++){
            cameras.push({
                name: "Camera"+(j+1)
            });
        }

        if(loc && loc.length>=this.numTowers){
            headings= loc;
        }

        if(includeCameras && includeCameras.length>=this.numCameras){
            cameras= includeCameras;
        }

        var nav =  '<div class="card cts-card no-border">'+
            '<div id="selector" class="card-body">'+
            '<button type="button" class="btn btn-light active " id="move-1'+id+'">'+headings[0].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-2'+id+'">'+headings[1].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-3'+id+'">'+headings[2].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-4'+id+'">'+headings[3].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-5'+id+'">'+headings[4].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-6'+id+'">'+headings[5].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-7'+id+'">'+cameras[0].name+'</button>'+
            '<button type="button" class="btn btn-light" id="move-8'+id+'">'+cameras[1].name+'</button>'+
            '</div>'+
            '</div>';
        $(parent).append(nav);
    },

    createVideo: function (parent, id, source, name) {
        var vid = '<div class="card cts-card t'+id+'" >' +
            '<div class="card-body">' +
            '<h4 class="card-title">'+name+'</h4>' +
            '<h6 class="card-subtitle mb-2 text-muted">Timelapse Video</h6>' +
            '<video id="video'+id+'" class="video-js  vjs-default-skin vjs-4-3"  preload="auto"  height="auto" width="auto"' +
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
        var container = document.getElementById("video"+id);

        var myVideo = videojs(container, { controls: true });
    },

    createVideoAlternate: function (parent, id, source, name) {
        var vid = '<div class="cts-chart card cts-card t'+id+'" >' +
            '<div class="card-body">' +
            '<h4 class="card-title">'+name+'</h4>' +
            '<h6 class="card-subtitle mb-2 text-muted">Timelapse Video</h6>' +
            'No video available at this time'+
            '</div>' +
            '</div>';
        $(parent).append(vid);
    },

    createTowers: function (parent, event, loc) {
        var headings=[];
        for (var j=0; j<this.numTowers ; j++){
            headings.push({
                name: "Tower"+(j+1),
                location: ""
            });
        }

        if(loc && loc.length>=this.numTowers){
            headings= loc;
        }

        for (var i = 1; i < this.numTowers+1; i++) {
            var content = '<div class="card cts-card t'+i+event+'">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+headings[i-1].name+'</h4>' +
                '<h6 class="card-subtitle mb-2 text-muted">'+headings[i-1].place+'</h6>' +
                '<div id="carousel-'+i+event+'" class="carousel slide" data-ride="carousel" data-interval="false">' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active text-center">' +
                '<div id="t'+i+event+'-wind" class="cts-chart"></div>' +
                '</div>' +
                '<div class="carousel-item text-center">' +
                '<div id="t'+i+event+'-pressure" class="cts-chart"></div>' +
                '</div>' +
                '</div>' +
                /*'<a class="carousel-control-prev" href="#carousel-'+i+event+'" role="button" data-slide="prev">' +
                '<i class="fa fa-chevron-circle-left" data-toggle="tooltip" data-placement="left" title="Click to view previous chart"></i>' +
                '</a>' +
                '<a class="carousel-control-next" href="#carousel-'+i+event+'" role="button" data-slide="next" >' +
                '<i class="fa fa-chevron-circle-right" data-toggle="tooltip" data-placement="left" title="Click to view next chart"></i>' +
                '</a>' +*/
                '<ol class="carousel-indicators">' +
                '<li data-toggle="tooltip" data-placement="top" title="click to view wind chart" data-target="#carousel-'+i+event+'" data-slide-to="0" class="active">Wind</li>' +
                '<li data-toggle="tooltip" data-placement="top" title="click to view pressure chart" data-target="#carousel-'+i+event+'" data-slide-to="1">Pressure</li>' +
                '</ol>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(parent).append(content);
        }
    },

    makeplotWeather: function(path, id) {
        Plotly.d3.csv(path, (function (self) {
            return function (data) {
                self.processWeatherData(data, id, self)
            };
        })(this));
    },

    makeplotWind: function makeplotWind(path, id) {
        Plotly.d3.csv(path, (function (self) {
            return function (data) {
                self.processWindData(data, id, self);
            };
        })(this));
    },

    hideExcept: function(id, event){
        for(var i=1; i<=8; i++){
            if(i != id)
                this.hideDiv(i+event);
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

    addClickHandlers: function (event) {
        for (var i=1; i<9 ; i++){
            $( "#move-"+i+ event).click(
                (function (i, self, event) {
                    return function() {
                        self.showDiv(i+event);
                        self.hideExcept(i,event);
                    }
                })(i, this, event));
        }
    },

    makePlotlyWeather: function( x, y1, y2, id , self){
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
                range: [0, self.maxRange]
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

    makePlotlyWind: function( x, y1, y2, y3, y4, y5, y6, id, self){
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
                range:[0, self.maxRange]
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
    },

    processWindData: function(allRows, id, self) {
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
        self.makePlotlyWind(x , y1, y2, y3, y4, y5, y6, id, self);
    },

    processWeatherData: function(allRows, id, self) {
        var x = [], y1 = [], y2= [];
        for (var i=0; i<allRows.length; i++) {
            row = allRows[i];
            x.push( row['TIMESTAMP'] );
            y1.push( row['Kmh_Max3Sec'] );
            y2.push( row['Pressure'] );
        }
        self.makePlotlyWeather(x , y1, y2, id, self);
    },

    resize: function() {
        this.plots.forEach(function (t) {
            Plotly.Plots.resize(t);
        });
    },

    initComponents: function(event){
        for(var i=1; i<=6; i++) {
            $('#carousel-'+i+event).on('slide.bs.carousel',(function (i, self) {
                return function () {
                    
                    //two plots for each tower
                    Plotly.Plots.resize(self.plots[(i-1) * 2]);
                    Plotly.Plots.resize(self.plots[(i-1) * 2 + 1]);

                    if(self.plots.length>12 && self.plots.length<=24) {
                        Plotly.Plots.resize(self.plots[((i - 1) * 2)+12]);
                        Plotly.Plots.resize(self.plots[((i - 1) * 2) + 13]);
                    }
                }
            })(i, this));
        }

        for(var i=2; i<=8; i++){
            
            this.hideDiv(i+event);
        }
    },

    goToSlide: function(number, i, event) {
        $('#carousel-'+i+event).carousel(number);
    },

    getNodes: function(event){
        for (var i=1; i<=6; i++){
            this.plots.push((d3.select('div[id="t'+i+event+'-wind"]')).node());
            this.plots.push((d3.select('div[id="t'+i+event+'-pressure"]')).node());
        }
    },

    refresh: function(dir, event) {
        for(var x=0; x< 6 ; x++){
            var chartNum=x+1;
            this.makeplotWind(dir+"t"+chartNum+".csv", "t"+chartNum+event+"-wind");
            this.makeplotWeather(dir+"t"+chartNum+".csv", "t"+chartNum+event+"-pressure");
        }
    }

};