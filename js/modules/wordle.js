export const name = 'wordle';



export function wordle(data) {
	let wordle_div = document.createDocumentFragment();
    //var fill = d3.scale.category20();
	// set the dimensions and margins of the graph
	var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		},
		width = 1200 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// append the svg object 
	var svg = d3.select(wordle_div).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var layout = d3.layout.cloud()
		.size([width, height])
		.words(data.map(function(d) {
			return {
                text: d.gen_name,
                size: d.count,
                gender: d.gender
			};
        }))
        .rotate(function(d) { return 0; })
        .font("Impact") 
        .text(function(d) { return d.text; })
		.padding(1)
		.fontSize(function(d) { return d.size; })
		.on("end", draw);

	layout.start();

    function draw(words) {
        svg.append("g")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) {
                return d.size + "px";
            })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")";
            })
            .text(function(d) {
                return d.text;
            })
            .style("fill", function(d, i) {
                if(d.gender == 2) return '#FF69B4';
                else return '#1357BE';
            });
    }
	return wordle_div;
}