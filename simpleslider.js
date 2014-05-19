function makeSlider(options){

	var data = options.data;
	var width = options.width ? options.width : 300;
	var location = options.location;
	var continuous = (typeof options.continuous == 'undefined') ? true : options.continuous;
	var color = options.color ? options.color : "white"

	// TODO: add error handling
	function arrayType(array) {

		for (var i = 0; i < array.length; i++) {
			if (typeof array[i] !== 'number') {
				return 'string';
			};
		};
		return 'number';
		
	};

	if (arrayType(data) == 'number') {

		var min = data[0];
		var max = data[1];
		var range = max - min;
		var increments = data[2];
		var dataset = [];
		for (var i = 0; i <= increments; i++) {
			var steps = range / increments;
			dataset.push(min + i * steps);
		};
		var labels = options.labels ? options.labels : dataset;

	} else {

		var labels = data;
		continuous = false;
		var increments = labels.length - 1;

	};

	var drag = d3.behavior.drag()
        .origin(Object)
        .on("drag", dragMove)
        .on('dragend', dragEnd);

	var svg = d3.select(location)
        .append('svg')
        .attr("height", 50)
        .attr("widht", width);

	var g = svg.selectAll('g')
        .data([{x: 0, y : 20}])
        .enter()
        .append('g')
        .attr("height", 200)
        .attr("widht", width)
        .attr('transform', 'translate(20, 10)');

	var rect = g
        .append('rect')
        .attr('y', 19)
        .attr("height", 2)
        .attr("width", width)
        .attr('fill', 'rgb(30,30,30)');

	var circle = g.append("circle")
	    .attr("r", 7)
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .attr("fill", color)
	    .attr("stroke", "black")
	    .attr("stroke-width", 2)
	    .call(drag);

	var text = svg.selectAll("text")
		.data(labels)
		.enter()
		.append("text")

	var textLabels = text
		 .attr("class", "sliderText")
	     .attr("x", function(d,i) { return 20 + i * (width/(labels.length - 1)); })
	     .attr("y", function(d) { return 17; })
	     .text( function (d) { return d })
	     .attr("font-family", "helvetica")
	     .attr("font-size", "0.8em")
	     .style("text-anchor", "middle");


	function dragMove(d) {
	    d3.select(this)
	        .attr("cx", function(d){
	        	steps = continuous ? 1 : width / increments;
	        	d.x = steps * (Math.round(Math.max(0, Math.min(width, d3.event.x))/steps));
	        	$(location + " .value").html(findValue(d.x))
	        	return d.x;
	        });       
	}

	function dragEnd() {
	    d3.select(this)
	}

	var findValue = function(x){
		if (arrayType(data) == "number") {
			return Math.ceil((min + range * (x/width)) * 100) / 100
		} else {
			return labels[increments * x/width]
		}
	}

	var somestuff = function(){
		return findValue(circle.attr('cx'))
	}

	return { value:somestuff };

}