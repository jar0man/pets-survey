function draw_pie_chart(){
    var svg = d3.select("#pie_chart")
       // .append("svg")
       // .attr('class','scaling-svg')
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");


    var width = 500,
        height = 250,
        radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d){ return d.data.label; };

    var color = d3.scale.ordinal()
        .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    function randomData (){
        var labels = color.domain();
        return labels.map(function(label){
            return { label: label, value: Math.random() }
        });
    }

    change(randomData());

    d3.select(".randomize")
        .on("click", function(){
            change(randomData());
        });


    function change(data) {

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");

        slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
                return d.data.label;
            });
        
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text.exit()
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });
        
        polyline.exit()
            .remove();
    };
}
var color = d3.scale.ordinal()
        .domain(["dog", "cat", "bird", "turtle", "duck", "fish", "mouse", "snake", "koala"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
var data = []

// Example from Nick
function pieChart() {
    var _chart = {};

    var _width = 500, _height = 500,
            _data = [],
            _colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],//d3.scale.category20(),
            _svg,
            _bodyG,
            _pieG,
            _radius = 200,
            _innerRadius = 100;

    _chart.render = function () {
        if (!_svg) {
            /* _svg = d3.select("body").append("svg") 
                     .attr("height", _height) 
                     .attr("width", _width);                     */
               _svg = d3.select("#pie_chart");      
         }

        renderBody(_svg);
    };

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body");

        renderPie();
    }

    function renderPie() {
        var pie = d3.layout.pie() // <-A
                .sort(function (d) {
                    return d.id;
                })
                .value(function (d) {
                    return d.value;
                });

        var arc = d3.svg.arc()
                .outerRadius(_radius)
                .innerRadius(_innerRadius);

        if (!_pieG)
            _pieG = _bodyG.append("g")
                    .attr("class", "pie")
                    .attr("transform", "translate(" 
                        + _radius 
                        + "," 
                        + _radius + ")");

        renderSlices(pie, arc);

        renderLabels(pie, arc);
    }

    function renderSlices(pie, arc) {
        var color = d3.scale.ordinal()
    .domain(["dog", "cat", "bird", "turtle", "duck", "fish", "mouse", "snake", "koala"])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
        var slices = _pieG.selectAll("path.arc")
                .data(pie(_data)); // <-B

        slices.enter()
                .append("path")
                .attr("class", "arc")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("data-toggle","tooltip")
                .attr("title",function(d){return d.value;})
                .on("click",function(d) {$('[data-toggle="tooltip"]').tooltip(); })
                ;

        slices.transition()
                .attrTween("d", function (d) {
                    var currentArc = this.__current__; // <-C

                    if (!currentArc)
                        currentArc = {startAngle: 0, 
                                        endAngle: 0};

                    var interpolate = d3.interpolate(
                                        currentArc, d);
                                        
                    this.__current__ = interpolate(1);//<-D
                    
                    return function (t) {
                        return arc(interpolate(t));
                    };
                });
    }

    function renderLabels(pie, arc) {
        var labels = _pieG.selectAll("text.label")
                .data(pie(_data)); // <-E

        labels.enter()
                .append("text")
                .attr("class", "label");

        labels.transition()
                .attr("transform", function (d) {
                    return "translate(" 
                        + arc.centroid(d) + ")"; // <-F
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.data.id;
                });
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.radius = function (r) {
        if (!arguments.length) return _radius;
        _radius = r;
        return _chart;
    };

    _chart.innerRadius = function (r) {
        if (!arguments.length) return _innerRadius;
        _innerRadius = r;
        return _chart;
    };

    _chart.data = function (d) {
        if (!arguments.length) return _data;
        _data = d;
        return _chart;
    };

    return _chart;
}

function randomData() {
    return Math.random() * 9 + 1;
}

function update() {
    for (var j = 0; j < data.length; ++j)
        data[j].value = randomData();

    chart.render();
}

       
function loadSummaryData(){
    var url = "https://api.handsonbigdata.com/survey-summary?question=favourite pet&group=total";
    
    var labels = color.domain();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE & this.status == 200 ) {
            
            var api_response = JSON.parse(this.responseText);
            var response_body =JSON.parse( api_response.body);
            console.log(response_body.summary);
            var data_summary = response_body.summary;
            for (element in data_summary) {
                console.log(element);
                console.log(data_summary[element]);
                data.push({id: element, value: data_summary[element]});
            }
            /*data = data_summary.foreach(function (row){
                return {id: Object.key(row), value: row};
                });*/
            console.log('logdata'+data[1].id);    
            
            //data_summary = response_body.summary
            //data = data_summary
            draw_pie();
        }
    };
    xhttp.open("GET", url , true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //xhttp.send('{"question":"favourite pet","group":"total"}');
    xhttp.send(null);
    // call to the api
    
}

function draw_pie() {
    //loadSummaryData();
    var chart = pieChart()
            .radius(200)
            .innerRadius(100)
            .data(data);

    chart.render();
}

