// LAB 6 

// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of cereal
    updateChart(category);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        year: +row['Year'],
        gender: row['Gender'],
        age: +row['Age'],
        race: row['Race'],
        victims: +row['Total Victims'],
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = { t: 60, r: 20, b: 80, l: 60 };

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Variable for the spacing of bar charts
var barBand;
var barWidth;

// scales
var shootingScale = d3.scaleLinear()
    .domain([0, 12]).range([chartHeight, 0]);; // defines y axis
var xBandScale = d3.scaleTime()
.domain([1982- 1, 2022 +1])
.range([0, chartWidth])

// d3.scaleBand().range([0, chartWidth]); // defines x axis

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', `translate(${padding.l}, ${padding.t})`);

var data;

d3.csv('data.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    data = dataset;

    // Compute the spacing for bar bands based on number of cereals
    barBand = chartWidth / data.length;
    barWidth = 0.7 * barBand;

    // **** Your JavaScript code goes here ****

    // Add axes to chart
    addAxes();
    // Update the chart for All cereals to initialize
    updateChart('All');
});

function addAxes() {
    // Add axes here
    chartG.append('text')
        // Title
        .attr('class', 'label')
        .attr('transform', 'translate(150,0)')
        .text('Who is a Mass Shooter?');
    chartG.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisLeft(shootingScale));
    chartG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr('opacity', 0)
        .call(d3.axisBottom(xBandScale));

}

function updateChart(manufacturer) {
    //  Create a filtered array of cereals based on the manufacturer
    var cereals;
    if (manufacturer === 'All')
        cereals = data.filter(d => d.manufacturer !== manufacturer);
    else cereals = data.filter(d => d.manufacturer === manufacturer);

    // **** Draw and Update your chart here ****
    var type = chartG.selectAll('.type')
        .data(cereals);

    var typeEnter = type.enter()
        .append('g')
        .attr('class', 'type')
        .attr('transform', 'translate(55,' + chartHeight + ')');

    typeEnter.merge(type)
        .attr('transform', function(d, i) {
            return 'translate(' + [i * (barWidth + 5) + 5, 0] + ')';
        });

    typeEnter.append('rect')
        .data(cereals)
        .attr("x", function(d, i) { return xBandScale(d.year) })
        .attr("y", function(d, i) { return shootingScale(d.victims) })
        .attr("width", barWidth)
        .attr("height", function(d, i) { return chartHeight - shootingScale(d.victims); })
        .style("fill", d3.color("steelblue"));

    typeEnter.append('text')
        .attr('transform', 'translate(' + [barWidth / 2, chartHeight + 6] + ') rotate(-45)')
        .text(function(d) {
            return d.year;
        })
        .style('font', '10px sans-serif')
        .style('text-anchor', 'end');

    // No exit line needed 
}

// Remember code outside of the data callback function will run before the data loads
