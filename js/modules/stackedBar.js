export const name = 'stackedBar';

export function stackedBar(data, appFn) {
    let stackedBar_div = document.createDocumentFragment();

    let margin = {top: 10, right: 30, bottom: 40, left: 50},
        width = 1100 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

    let svg = d3.select(stackedBar_div)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var subgroups = data.columns.slice(1);
    var groups = d3.map(data, function(d){return d.Range});
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Male ;} )])
        .range([ height, 0 ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("g")
      .call(d3.axisLeft(y));
    
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['blue','fuchsia']);

    // svg.append("g")
    //     .selectAll("g")
    //     .data(data)
    //         .enter()
    //         .append("g")

    //             .attr("transform", function(d) { return "translate(" + x(d.Range) + ",0)"; })
    //             .selectAll("circle")
    //             .data(function(d) {return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    //             .enter().append("circle")
    //             .attr("class", "genDot")
    //             .attr("r", 7)
    //             .attr("cx", function(d) {
    //                 return xSubgroup(d.key) + 18;
    //             })
    //             .attr("cy", function(d) {
    //                 return y(d.value);
    //             })
    //             .style("opacity", 1)
    //             .style("fill", function(d) {
    //                 return color(d.key)
    //             })
    // this.start = "";
    // this.end = "";
    // let $this = this;
    svg.append("g")
        .selectAll("g")
        .data(data)
            .enter()
            .append("g")

                .attr("transform", function(d) { return "translate(" + x(d.Range) + ",0)"; })
                .on("click", function (e, d) {
                    let r = d.Range.split(" ");
                    // $this.start = parseInt(r[0])
                    // $this.end = parseInt(r[2])
                    appFn(parseInt(r[0]), parseInt(r[2]))
                })

                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")

                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", function(d) { return color(d.key); })
                .on('mouseover', function(e, d) {
                    d3.select('#tooltip')
                        .style("left", (e.pageX + 5) + "px")
                        .style("top", (e.pageY - 28) + "px")
                        .html("<p class='diff_bold'>" + d.key +  ": </p><p class='difference'>" + d.value +  " </p>");
                    d3.select('#tooltip').classed('hidden', false);
                })
                .on('mouseout', function() {
                    d3.select('#tooltip').classed('hidden', true);
                });
  
    svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("text-transform", "uppercase")
        .style("font-family", "body")
        .text("Date Range");
    svg.append("text")             
        .attr("transform",
                "translate(-40 ," + 
                                 (height/2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .style("text-transform", "uppercase")
        .style("font-family", "body")
        .text("No. of characters created");
    // return {
    //     div: stackedBar_div,
    //     bars: bars
    // };
    let filtered = []
    // function updateKeys(d) {
    //     var newKeys = [];
    //     keys.forEach(function(d) {
    //       if (filtered.indexOf(d) == -1 ) {
    //         newKeys.push(d);
    //       }
    //     })
    //     x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
    //     y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]);
    //     svg.select(".y")
    //         .transition()
    //         .call(d3.axisLeft(y).ticks(null, "s"))
    //         .duration(500);
     
    //     var bars = svg.selectAll(".bar").selectAll("rect")
    //       .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
        
    //     bars.filter(function(d) {
    //             return filtered.indexOf(d.key) > -1;
    //         })
    //         .transition()
    //         .attr("x", function(d) {
    //             return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;  
    //         })
    //         .attr("height",0)
    //         .attr("width",0)     
    //         .attr("y", function(d) { return height; })
    //         .duration(500);
   
    //     bars.filter(function(d) {
    //         return filtered.indexOf(d.key) == -1;
    //       })
    //         .transition()
    //         .attr("x", function(d) { return x1(d.key); })
    //         .attr("y", function(d) { return y(d.value); })
    //         .attr("height", function(d) { return height - y(d.value); })
    //         .attr("width", x1.bandwidth())
    //         .attr("fill", function(d) { return z(d.key); })
    //         .duration(500);
 
    //     legend.selectAll("rect")
    //         .transition()
    //         .attr("fill",function(d) {
    //             if (filtered.length) {
    //             if (filtered.indexOf(d) == -1) {
    //                 return z(d); 
    //             }
    //             else {
    //                 return "white"; 
    //             }
    //             }
    //             else {
    //             return z(d); 
    //             }
    //         })
    //         .duration(100);     
    // } 
    return {
        div: stackedBar_div
    }
}