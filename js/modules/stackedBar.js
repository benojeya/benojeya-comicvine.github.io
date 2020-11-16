export const name = 'stackedBar';

export function stackedBar(data) {
    let stackedBar_div = document.createDocumentFragment();

    let margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

    svg.append("g")
        .selectAll("g")
        .data(data)
            .enter()
            .append("g")

                .attr("transform", function(d) { return "translate(" + x(d.Range) + ",0)"; })
                .selectAll("circle")
                .data(function(d) {return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("circle")
                .attr("class", "genDot")
                .attr("r", 7)
                .attr("cx", function(d) {
                    return xSubgroup(d.key) + 18;
                })
                .attr("cy", function(d) {
                    return y(d.value);
                })
                .style("opacity", 1)
                .style("fill", function(d) {
                    return color(d.key)
                })
    svg.append("g")
        .selectAll("g")
        .data(data)
            .enter()
            .append("g")

                .attr("transform", function(d) { return "translate(" + x(d.Range) + ",0)"; })

                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")

                .attr("x", function(d) { return xSubgroup(d.key) + 17; })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", 2)
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", function(d) { return color(d.key); })
  

    return stackedBar_div;
}