export const name = 'wordle';

export function wordle(data, w, h) {
	let _wordle = {
        div: document.createDocumentFragment(),
        cloud: null
    };
	// set the dimensions and margins of the graph
	var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

	// append the svg object 
    var svg = d3.select(_wordle.div).append("svg")
        .attr("class", "wordle")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        

    // var tooltip = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("position", "absolute")
    //     .style("z-index", "10")
    //     .style("display", "none")
    //     .attr("data-tt", "false")	

	var layout = d3.layout.cloud()
		.size([width, height])
		.words(data)
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
            .attr("transform", function(d, i) {
                return "translate(" + [d.x, d.y] + ")";
                //return "translate(" + [d.x*(i+1)*500, d.y ] + ")";
            })
            .text(function(d) {
                return d.text;
            })
            .style("fill", function(d) {
                if(d.gender == 2) return '#F012BE';
                else return '#1357BE';
            })
            // .on("mouseover", toolTipStyle)					
            // .on("mouseout", function(d) {		
            //     tooltip.transition()		
            //         .duration(500)		
            //         .style("opacity", 0);	
            // })
            // .on('mousemove', toolTipStyle)
            .on('click', function (e, d) {
                d3.select("#textInsert").text("");
                d3.select("#textInsert_names").text(d.char);
                d3.select("#titleInsert").text(d.text);
                // d3.selectAll(".genDot")
                //     .style("fill", function(d) {
                //         if(d.gender == 2) return '#F012BE';
                //         else return '#1357BE';
                //     })
                //     .classed('is-active', false)
                //     .attr('r', radius)
        
                // d3.select(this)
                //     .classed('is-active', true)
                //     .transition()
                //     .attr('r', radius * 1.35)
            })
        _wordle.cloud = svg.selectAll("g text")
            .data(words)
    }
    function getDivWidth (div) {
        var width = d3.select(div)
          .style('width')
          .slice(0, -2)
        return Math.round(Number(width))
    }
    // function toolTipStyle(e, d) {
    //     if(tooltip.attr("data-tt", "false")) {
    //         tooltip.style("display", "block");
    //         let x = e.pageX > 650 ? e.pageX - getDivWidth (".tooltip") - 30: e.pageX + 20;	
    //         tooltip	.html(`
    //                 <h5>${d.text} (${d.count})</h5>
    //                 <p>${d.char}</p>
    //             `)	
    //             .style("left", x + "px")		
    //             .style("top", (e.pageY + 10) + "px")
    //             .attr("data-tt", "true");
    //     } else {
    //         tooltip.style("display", "hidden")
    //             .attr("data-tt", "false");
    //     }
    // }
	return _wordle;
}