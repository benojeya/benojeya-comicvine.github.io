export const name = 'funnel';


export function funnel(data) {
    // Functions for offsetting annotations
    function dy(t) {
        return y(t) - y(0);
    }
    
    function dx(t) {
        return x(t) - x(0);
    }

    let radius = 8,
        margin = {top: 70, right: 60, bottom: 50, left: 50},
        width_names = 1000 - margin.left - margin.right,
        height_names = 700 - margin.top - margin.bottom;

    let y = d3.scaleBand()
            .range([10, height_names], 1);

    let x = d3.scaleLinear()
            .range([width_names, 0]);

    let funnel_div = document.createDocumentFragment();

    var svg = d3.select(funnel_div).append("svg")
        .attr("width", width_names + margin.left + margin.right)
        .attr("height", height_names + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.gen_per = +d.gen_per / 100.0;
        d.count = +d.count;
        d.per_fake = +d.per_fake / 100.0;
    });

    data.sort(function(a,b) {
        return d3.ascending(a.gen_per,b.gen_per);
      });


      x.domain([d3.max(data, function(d) { return d.gen_per; }), -0.3]);
      y.domain(data.map(function(d) { return d.gen_cat; }));

    //ANNOTATIONS 
    const circleAnnotations_girl = [{
        note: {
            title: "Girls, not women",
            label: "'Girl' is the third-most common gendered name for a female character. 'Boy' only shows up sixth for males."
        },
        x: x(-.13),
        y: y('girl'),
        dx: dx(-.07),
        dy: 0,
        subject: {
            radius: 2,
            radiusPadding: 40
        }
    }]
    const makeCircleAnnotations_girl = d3.annotation()
        .editMode(false)
        .type(d3.annotationCalloutCircle)
        .annotations(circleAnnotations_girl)
    svg.append("g")
        .attr("id", "girl_anno")
        .attr("class", "tk-atlas annotation-group")
        .attr("font-size", 12)
        .call(makeCircleAnnotations_girl)


    const circleAnnotations_man = [{
        note: {
            title: "Men, not boys",
            label: "A full 30% of male characters with gendered names get 'man' in their name. That number is only 6% for 'woman'."
        },
        x: x(.31),
        y: y('woman'),
        dx: dx(-.02),
        dy: 50
    }]
    const makeCircleAnnotations_man = d3.annotation()
        .editMode(false)
        .type(d3.annotationCallout)
        .annotations(circleAnnotations_man)
    svg.append("g")
        .attr("id", "man_anno")
        .attr("class", "tk-atlas annotation-group")
        .attr("font-size", 12)
        .call(makeCircleAnnotations_man)

    // END ANNOTATIONS

    svg.append("g")
        .attr("class", "tk-atlas x axis")
        .attr("id", "xAxis")
        .attr("transform", "translate(0, -50)")
        .call(d3.axisTop(x)
        .tickFormat( function(d){ return d3.format("0.0%")(Math.abs(d)); } )
        .ticks(5));

    var linesBetween = svg.selectAll("lines.between")
        .data(data)
        .enter()
        .append("line");

    linesBetween.attr("class", "between")
        .attr("x1", function(d){return x(d.gen_per)})
        .attr("y1", function(d){return y(d.gen_cat)})
        .attr("x2", function(d){return x(d.per_fake)})
        .attr("y2", function(d){return y(d.gen_cat)})

    var genDots = svg.selectAll(".genDot")
        .data(data);

    genDots.enter().append("circle")
        .attr("class", "genDot")
        .attr("r", function(d) {
            return d.gen_name === 'lady' ? radius * 1.35 : radius
        })
        .attr("cx", function(d) {
            return x(d.gen_per);
        })
        .attr("cy", function(d) {
            return y(d.gen_cat);
        })
        .style("opacity", 1)
        .style("fill", function(d) {
            return "red"
            // if (d.gen_name === "lady") {
            //     //return colors.female
            // } else if (d.gender == 1) {
            //     //return colors.male
            // } else {
            //     //return colors.female
            // }
        })
        // .classed("is-active", function(d) {
        //     return d.gen_name === 'lady'
        // })
        .on('mouseover', function(d) {
            // var section = d3.select(this);
            // // section.style("opacity", 0.6)
            // d3.select('#tooltip')
            //     .style("left", (d3.event.pageX + 5) + "px")
            //     .style("top", (d3.event.pageY - 28) + "px")
            //     .html("<p class='difference'>" + Math.abs(d.gen_per * 100).toFixed(1) + "%</p>");
            // d3.select('#tooltip').classed('hidden', false);
        })
        .on("click", function(d) {
            // $("#textInsert").html("");
            // $("#textInsert_names").html(d.char_list);
            // $("#titleInsert").html(d.gen_name);
            // d3.selectAll(".genDot")
            //     .style("fill", function(d) {
            //         if (d.gender == 1) {
            //             return colors.male
            //         } else {
            //             return colors.female
            //         }
            //     })
            //     .classed('is-active', false)
            //     .attr('r', radius)
    
            // d3.select(this)
            //     .classed('is-active', true)
            //     .transition()
            //     .attr('r', radius * 1.35)
        })
        .on('mouseout', function() {
            // var section = d3.select(this);
            // section.style("opacity", '1')
            // d3.select('#tooltip').classed('hidden', true);
        });
    // Text for gender names
    var texts = svg.selectAll(".dodo")
        .data(data);

    texts.enter().append("text")
        .attr("class", "bar__label dodo tk-atlas")
        .attr("font-size", 10)
        .attr("x", function(d) {
            if (d.gen_per <= 0) {
                return x(d.gen_per) - 15
            } else {
                return x(d.gen_per) + 15
            }
        })
        .attr("y", function(d) {
            return y(d.gen_cat) + 4
        })
        .attr('text-anchor', function(d) {
            if (d.gen_per <= 0) {
                return 'end'
            } else {
                return 'start'
            }
        })
        .style("fill", function(d) {
            if (d.dim == 1) {
                //return colors.accent
                return 'green'
            }
            // else {return "black"}
        })
        .text(function(d) {
            return d.gen_name;
        });

    var lineEnd = 0;

    // Line at 0
    svg.append("line")
        .attr("x1", function() {
            return x(lineEnd)
        })
        .attr("y1", -40)
        .attr("x2", function() {
            return x(lineEnd)
        })
        .attr("y2", height_names + 50)
        .style("stroke-width", 0.3)
        .style("stroke", "black")
        .style("fill", "none");
    

    return funnel_div;
}