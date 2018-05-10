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
                '<div id="t'+i+event+'-wind-hover" style="position:absolute;z-index:1000" class="hover-info"></div>'+
                '</div>' +
                '<div class="carousel-item text-center">' +
                '<div id="t'+i+event+'-pressure" class="cts-chart"></div>' +
                '<div id="t'+i+event+'-pressure-hover" style="position:absolute;z-index:1000" class="hover-info"></div>'+
                '</div>' +
                '</div>' +
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
                color: "crimson"
            }
        },{
            x: x,
            y: y4,
            name: '10 Minute Mean',
            line: {
                color: "#c9b3ac"
            }
        },{
            x: x,
            y: y5,
            name: 'Direction',
            yaxis: 'y2',
            type: 'scatter',
            mode: "markers",
            color: "#5b2337",
            marker: { size: 2.5, color: "#5b2337" }
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
        Plotly.newPlot(id, traces1, layout);

        /*var plot= document.getElementById(id);
        var hoverInfo = document.getElementById(id+"-hover");
        plot.on('plotly_hover', function(data){
            debugger;
            var infoText = data.points.map(function(d){
                return ('<ul><li>'+d.data.name+'</li><li>'+d.x+'</li><li>'+
                    d.y.toPrecision(3)+'</li><li class="bg-Arrow'+Math.round(data.points[2].y)+'  "  >'+'</li></ul>');
            });

            hoverInfo.innerHTML = infoText.join('');

            hoverInfo.style.left = +data.points[0].xaxis.l2p(data.points[0].x)+
                data.points[0].xaxis._offset -60+ 'px';

            hoverInfo.style.top = +data.points[0].yaxis.l2p(data.points[0].y)+
                data.points[0].yaxis._offset -100+'px';

            hoverInfo.style.padding = "20px";
            hoverInfo.className= "hover-info extra-stuff";

        })
        .on('plotly_unhover', function(data){
            hoverInfo.innerHTML = '';
            hoverInfo.style.padding = "0px";
            hoverInfo.className= "hover-info";
        });*/
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
        self.makePlotlyWind(x, y1, y2, y3, y4, y5, y6, id, self);
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
    },

    showDirection: function (degrees, event) {

        var canvas = document.getElementById('direction' + event);
        var ctx = canvas.getContext('2d');
        var img = new Image();

        var ang = degrees; //angle

        img.onload = function () { //on image load do the following stuff
            canvas.width = 200; //Any width
            canvas.height = 500; //Any height
            var cache = this; //cache the local copy of image element for future reference
            var iw = cache.width;
            var ih = cache.height;

            ctx.save(); //saves the state of canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
            ctx.translate(canvas.width / 2, canvas.height / 2); //let's translate
            ctx.rotate(Math.PI / 180 * (ang)); //increment the angle and rotate the image
            ctx.translate(-(canvas.width / 2), -(canvas.height / 2)); //let's translate
            ctx.drawImage(img, canvas.width / 2 - iw / 2, canvas.height / 2 - ih / 2, iw, ih); //draw the image ;)
            ctx.restore(); //restore the state of canvas

        };

        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEX///+AgIB7e3u2trbq6up9fX3CwsJ4eHj8/Pza2tqpqanf39+kpKSCgoL6+vqsrKzU1NTv7++zs7OKioqfn5/j4+OZmZmSkpLOzs709PTGxsbt7e2UlJSbm5uuBYtBAAAFZ0lEQVR4nO3d61bqMBAF4LYQQ1UQb0fgeN7/NU9rCnJp08xkJpmwZv+2lW/NTqtSYlUxZv8QlpbzRbBm2QTFvuV+oegs66A0i9wvFB0VqlB+VKhC+VGhCuVHhSqUHxWqUH5UqEL5UaEK5UeFKpQfFapQflSoQvlRoQrlR4UqlB8VqlB+VKhC+VGhCuVHhSqUHxWqUH5UqEL5UaEK5UeFKpQfFapQflSoQvlRoQrlR4UqlB8VqlB+VKhC+VGhCuVHhSqUHxWqUH5UqEL5UaEK5UeFKkyado84iFW4XWGOmkxrvhFETuHBviCOmkxbGwyRUXho6uYRfthUWtO9DvMFJvIJO2BdWzJi614InMgmPFh3IFFRu4oOxO9X2JFcwp8J0hFbY44vxbzDiEzCh+Z0qH2GHTqW1py9FvMOKiqP8MGeHRt/RT1VdCB+QabIIrwA9kWNuy9eAYFEDuFZRYejo66oZ2vwRASsRQbh1QT7xNw02hsfjEgvXNwCY9biTUWPxL+BJyAXjgL7ouLW4khFgURq4eJ6Df4SMcCn8Qk6YlhRiYUTE+yDWYseYPAUaYUeIKaoT2sPsCcuUwsnK3okAoFTa/BEXAcQKYVvvgn2gRV1FhhGJBTOAntieFFnKjoQ54tKJ/SuwdN5golBwBAimfDNvwZ/iYHA+YoOxPVnGmFARV3CfpkKBs4TiYQvocCwtRhY0YH47iXSCF/CKjqca7ao3hv9CNE7RRIhCDhPnPxZdJJYe4gUQkBFXfxFnfhtwktcP3EKwcCZm8YWfj5fUeOFj7CKutP92UwLqy14hh3RTE0xWviMAX74L6db+CmnibFCDiByihNrMVKIquiHr6IDEbUWR4lxQtwE54HIKTZj/2kzRrj5QAEDfEhiXY8QI4Qrvgn+EBFnN/VtUSOEvMCJP5TOxJibKaKFK1xFIX+qwdw0arMlEm7+sQORa/GaiBQiJxhe0YGI+C7XRJwwERD1U3j3jS6IKCGuoqh3SlHEiylihEgg9o0L+Pe6ICKESYGI34d/vt0uQrj/k6yiAxG1Fk9EsHD/nRgYe7mBCje4CUa+kY8pqtmhhMiKxj7BB/jz6W/sASHcfyWvqAuqqHYHFm6+MAuCAIi9L+6Awv03CkjzkCnupnEACbMCkcRuLYYLX/NVdCBC3sw4xh5eA1/pYo8CIp8xGQ/o/ZpjzMs67OueURUlfQq6qj5R98XQr8M0hBiInCJfKB/yFkmkruhAxJSJJ/QVdfnE3Po5QveQ/nWEFJWnooKInEDkTYM2XGvwmOxT5LhNiCLyVtQl6xWVu6IDMd8U7VsKYEd8z0RsEgGzEdMBM63FVBV1WaZfiykn2Cd5UVMDk19R01bUZZlyLeYAdsR0RU1fUZdkazEXMNlazFNRlyQ3jZzAJGsx974g7ESbfeMT5qLmB1bVX84p5q6oC2NRJUywD1tRpQCr6pVninKATEWVsQaPYSBKmmAfcqI0IPlatA+5QbchJTYCgaS3fplAwilKrKgLEVEukKioUivqQjBFyRPsg3q66QJ4yE2YSySxEQ+scA/hlQTspohfi/Ir6oIuailAdFHLqKgL7onfgoCox9Ltbv60kgKeYlMYsP94CGyTlOKAwM8wlVZRl034Z2DKBAKKWmJFXQI/LnnzGfCCsglZi7ZgYNAnCkueYJ/5DTwKB86uxaZ4YFWtfMTRTV+Ky/QeCWZsy5cSs5nciuVOgP0Ux3ZmGtnupeCMTHFsy56Cs7rZt8us72mCVb/vk72a4J0Bu1xcUaf36Ss5Z0X1bSdZcFanfSzvFNjl0d7jVfQiP/vJBm12XmwWzdzew8VnYYN25C85O+D/jIrOf2xBY/8c5tJQAAAAAElFTkSuQmCC';
    }

};