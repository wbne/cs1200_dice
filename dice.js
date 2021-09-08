/*
 * This initializes the entire program and instantiates the histogram.
 * The two histograms are the summation and difference of two rolled dice.
 * In this the function calls a graph and statistical tests to be run.
 */
function roll() {
	//variable n is either 10 or the value of the textbox.
	var n = 10 | document.getElementById("numRolls").value

	//array of tabulated dice sums
	var category = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

	//array of tabulated dice differences
	var diff = [0, 0, 0, 0, 0, 0]

	//This rolls the dice N many times
	for(i = 0; i < n; i++) {
		var q = Math.round(5 * Math.random())
		var w = Math.round(5 * Math.random())
		var diffed = Math.abs(q-w)

		//the values correspond to the index and is noted
		category[q + w] += 1
		diff[diffed] += 1
	}
	
	//graph function creates a graph of the histograms
	graph(category, false)
	graph(diff, true)

	//sampleVariance function computes the variances
	sampleVariance(category, n, false)
	sampleVariance(diff, n, true)
}

/*
 * Creates a bar graph using d3.js library
 * @param category: the array of integer values
 * @param add: whether the graph should be added or overwrite
 */
function graph(category, add) {
	tempArray = []
	for(i = 0; i < category.length; i++) {
		tempArray.push([i, category[i]])
	}
	width = 400
	height = 400
	var xAxis = ""
	
	if(add) {
		d3.select("#graphArea")
			.append('defs')
			.append('style')
			.attr('type', 'text/css')
			.text("@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300');")
		xAxis = "Difference Value"
	}
	else {
		d3.select("#graphArea").html("")
			.append('defs')
			.append('style')
			.attr('type', 'text/css')
			.text("@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300');")
		xAxis = "Added Value"
	}

	svg = d3.select("#graphArea")
		.append("svg")
		.classed("graph", true)
		.attr("width", width + 100)
		.attr("height", height + 150)
		.style("font-family", '"Open Sans", sans-serif')
		.append("g")
		.attr("transform","translate(" + 50 + "," + 50 + ")");
	
	var dat = tempArray.map(function(d) {
		return {
			index: d[0],
			value: d[1]
		};
	});

	var x = d3.scaleBand()
		.range([ 0, width ])
		.domain(dat.map(function(d) { return d.index; }))
		.padding(0.2);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.style("font-family", '"Open Sans", sans-serif')
		.style("text-anchor", "end");
	svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height + 40)
		.text(xAxis)

	var y = d3.scaleLinear()
		.domain([0, d3.max(dat, function(d) {return +d.value})])
		.range([ height, 0]);
	svg.append("g")
		.call(d3.axisLeft(y));
	svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", 150)
		.attr("y", -10)
		.text("Number of Occurances")

	svg.selectAll("mybar")
		.data(dat)
		.enter()
		.append("rect")
		.attr("x", function(d) { return x(d.index); })
		.attr("y", function(d) { return y(d.value); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.value); })
		.attr("fill", "#77dd77")
}

/*
 * Calculates the variance from the mean.
 * @param array: The array of integer values
 * @param number: The sample size
 * @param add: Whether to add or overwrite the text
 */
function sampleVariance(array, number, add) {
	var decimal = 1000
	var mean = 0
	var sum = 0
	for(i = 0; i < array.length; i++) {
		mean += array[i] * i
		sum += array[i] * Math.pow(i, 2)
	}
	mean /= number
	sum /= number
	var variance = sum - Math.pow(mean, 2)
	variance = Math.round(variance * decimal) / decimal
	var textNode = document.getElementById("variance")
	if(add) {
		var text = textNode.textContent += " Difference Variance: " + variance
		textNode.textContent = text
		return
	}
	document.getElementById("variance").textContent = "Summation Variance: " + variance	
}

/*
 * Problem 4a. Construct two tables - each with the size 6x6.
 * One table with be sum(i, j) and the other will be diff(i, j)
 */
function constructTable(adding) {
	
}

/*
 * This adds an event that executes the roll() function when a button is clicked.
 * The button is picked by its HTML element ID "numButton"
 */
document.getElementById("numButton").addEventListener("click", roll)
