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
        width_names = 900 - margin.left - margin.right,
        height_names = 1000 - margin.top - margin.bottom;

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
            label: "",
            wrap: 10,
            padding: 10 
        },
        x: x(-.13),
        y: y('girl'),
        dx: dx(-0.2),
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
            .selectAll(".annotation-note-label")
            .attr("y", "30")


    const circleAnnotations_man = [{
        note: {
            title: "Men, not boys (30% vs just 6% for female)",
            label: ""
        },
        x: x(.31),
        y: y('woman'),
        dx: dx(-.16),
        dy: 20
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
            if (d.gen_name === "lady") return '#F012BE'
            else if (d.gender == 1) return '#1357BE';
            else return '#F012BE';
        })
        .classed("is-active", function(d) {
            return d.gen_name === 'lady'
        })
        .on('mouseover', function(e, d) {
            var section = d3.select(this);
            // section.style("opacity", 0.6)
            d3.select('#tooltip')
                .style("left", (e.pageX + 5) + "px")
                .style("top", (e.pageY - 28) + "px")
                .html("<p class='difference'>" + Math.abs(d.gen_per * 100).toFixed(1) + "%</p>");
            d3.select('#tooltip').classed('hidden', false);
        })
        .on("click", function(e, d) {
            d3.select("#textInsert").text("");
            d3.select("#textInsert_names").text(d.char_list);
            d3.select("#titleInsert").text(d.gen_name);
            d3.selectAll(".genDot")
                .style("fill", function(d) {
                    if(d.gender == 2) return '#F012BE';
                    else return '#1357BE';
                })
                .classed('is-active', false)
                .attr('r', radius)
    
            d3.select(this)
                .classed('is-active', true)
                .transition()
                .attr('r', radius * 1.35)
        })
        .on('mouseout', function() {
            var section = d3.select(this);
            section.style("opacity", '1')
            d3.select('#tooltip').classed('hidden', true);
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
                return '#B90805'
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
    
    d3.select( "#descendingFemale" ).on("click", function() {
        femaleOrder();
        console.log("moi")
        d3.select("#descendingFemale").classed("activeFemale", true);
        d3.select("#descendingMale").classed("activeMale", false);
        window.setTimeout (function () {
            d3.select("#man_anno").style("display", "block");
            d3.select("#girl_anno").style("display", "block");
        }, 500);
    });
    
    d3.select( "#descendingMale" ).on("click", function() {
        maleOrder();
        d3.select("#descendingFemale").classed("activeFemale", false);
        d3.select("#descendingMale").classed("activeMale", true);
        d3.select("#man_anno").style("display", "none");
        d3.select("#girl_anno").style("display", "none");
    });

    function maleOrder(){

        data.sort(function(a,b) {
             return d3.descending(a.gen_per,b.gen_per);
           });
 
       y.domain(data.map(function(d) { return d.gen_cat; }));
 
 
       d3.selectAll('.genDot') // move the circles
           .transition().duration(500)
           .attr("cx", function(d) { return x(d.gen_per); })
           .attr("cy", function(d) { return y(d.gen_cat); });
 
 
       d3.selectAll('.dodo')
           .transition().duration(500)
           .attr("y", function(d) {
             if (d.gen_per <=0){return y(d.gen_cat)+4}
             else {return y(d.gen_cat)+4}
            });
 
       d3.selectAll(".between")
         .transition().duration(500)
         .attr("x1", function(d){return x(d.gen_per)})
         .attr("y1", function(d){return y(d.gen_cat)})
         .attr("x2", function(d){return x(d.per_fake)})
         .attr("y2", function(d){return y(d.gen_cat)})
 
 
     }; //end maleOrder();
 
 
     function femaleOrder(){
 
       data.sort(function(a,b) {
             return d3.ascending(a.gen_per,b.gen_per);
           });
 
 
       y.domain(data.map(function(d) { return d.gen_cat; }));
 
      d3.selectAll('.genDot') // move the circles
         .transition().duration(500)
         .attr("cx", function(d) { return x(d.gen_per); })
         .attr("cy", function(d) { return y(d.gen_cat); });
 
       d3.selectAll('.dodo')
           .transition().duration(500)
           .attr("y", function(d) {
             if (d.gen_per <=0){return y(d.gen_cat)+4}
             else {return y(d.gen_cat)+4}
            });
 
       d3.selectAll(".between")
         .data(data)
         .transition().duration(500)
         .attr("x1", function(d){return x(d.gen_per)})
         .attr("y1", function(d){return y(d.gen_cat)})
         .attr("x2", function(d){return x(d.per_fake)})
         .attr("y2", function(d){return y(d.gen_cat)})
 
     }; //end femaleOrder();
    return funnel_div;
}