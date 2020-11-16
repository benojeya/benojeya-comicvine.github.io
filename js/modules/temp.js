export const name = 'brushing';

export function brushing(data) {
    
    let brushed_div = document.createDocumentFragment(),
        bars,
        circles;

    let margin = {top: 10, right: 30, bottom: 35, left: 50},
        width = 1400 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

    let margin2 = {top: 0, right: 30, bottom: 10, left: 50},
        width2 = 1400 - margin2.left - margin2.right,
        height2 = 120 - margin2.top - margin2.bottom;
    var subgroups = data.columns.slice(1);
    var groups = d3.map(data, function(d){return d.Year});
    var x2 = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])    
    
    var xSubgroup2 = d3.scaleBand()
        .domain(subgroups)
        .range([0, x2.bandwidth()])
        .padding([0.05])
    
    var y2 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Male ;} )])
        .range([ height2, 0 ]); 
   
    let brush = d3.brushX()
        .extent([[15, 0], [width2 + 10, height2]])
        .on("end", brushend);

    let svg = d3.select(brushed_div)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let svg2 = d3.select(brushed_div)
        .append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
        .call(brush);

    
    
    svg2.append("g")
        .attr("transform", "translate(15," + height + ")")
        .call(d3.axisBottom(x2))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 10)
        .attr("dy", ".7em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
    

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['blue','fuchsia']);
    
    
    svg2.append("g")
        .selectAll("g")
        .data(data)
            .enter()
            .append("g")

                .attr("transform", function(d) { return "translate(" + x2(d.Year) + ",0)"; })

                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")

                .attr("x", function(d) { return xSubgroup2(d.key) + 17; })
                .attr("y", function(d) { return y2(d.value); })
                .attr("width", 2)
                .attr("height", function(d) { return height2 - y2(d.value); })
                .attr("fill", function(d) { return color(d.key); })

    updateChart([], data);
    function brushend(e) {
        var selected = [],
            start,
            end,
            brushExtent = e.selection;
        selected  = x2.domain()
            .filter(function(d) {
                if ((brushExtent[0] <= x2(d)) && (x2(d) <= brushExtent[1])) {
                    if(!start)  start = d;
                    end = (parseInt(d) - 1).toString();
                }
            });
        let startI = groups.indexOf(start),
            endI = groups.indexOf(end),
            nData = data.slice(startI, endI)
            updateChart(data, nData);
    }

    function updateChart (dau, uData) {
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])
    
        var y = d3.scaleLinear()
            .domain([0, d3.max(uData, function(d) { return +d.Male ;} )])
            .range([ height, 0 ]);
        svg.append("g")
            .attr("transform", "translate(15," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 10)
            .attr("dy", ".7em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");
        svg.append("g")
            .call(d3.axisLeft(y));
        // circles = svg.append("g")
        //     .selectAll("g")
        //     .data(uData)
        //     .enter()
        //         .append("g")

        //             .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
        //             .selectAll("circle")
        //             .data(function(d) {return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        //             .enter().append("circle")
        // circles.exit().remove()
        // circles.attr("class", "genDot")
        //             .attr("r", 5)
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

        console.log(uData)
        let baris = svg.append("g")
        baris.selectAll(".bars")
            .data(uData)
            .enter()
            .append("rect").attr("class", "barss")
            .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
            .attr("fill", "red")
            .attr("x", function(d) { 17; })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", 2)
            .attr("height", 10)
g()
            
            // .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
            //         .selectAll("rect.barsSmall")
            //         .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                   
            //         //bars.exit().remove()
            //         .enter().append("rect")

            //         .attr("x", function(d) { return xSubgroup(d.key) + 17; })
            //         .attr("y", function(d) { return y(d.value); })
            //         .attr("width", 2)
            //         .attr("height", function(d) { return height - y(d.value); })
            //         .attr("fill", function(d) { return color(d.key); })

            // let t = d3.selectAll("rect.barsSmall")
            //         t.remove()
            //         t.transition()
            //         .attr("x", function(d) {
            //             return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
            //         })
            //         .attr("height",0)
            //         .attr("width",0)
            //         .attr("y", function(d) { return height; })
            //         .duration(500);

    }

    function g() {
        bars = d3.selectAll(".bars").data(data)
        console.log(bars)
            bars.exit().remove()
    }
                
    return brushed_div;
}



export const name = 'brushing';

export function brushing(data) {
    
    let brushed_div = document.createDocumentFragment(),
     chart = d3.select(brushed_div)
     .append("svg");
    //set up data
var bothData = [
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_13_17",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "3.3",
      "watch_time_minutes": "2.8"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_13_17",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "12.8",
      "watch_time_minutes": "13.5"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_18_24",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "7.1",
      "watch_time_minutes": "6.6"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_18_24",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "37.1",
      "watch_time_minutes": "35.8"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_25_34",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "2.7",
      "watch_time_minutes": "3.9"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_25_34",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "23.5",
      "watch_time_minutes": "24.7"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_35_44",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "1.0",
      "watch_time_minutes": "0.8"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_35_44",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "6.4",
      "watch_time_minutes": "5.0"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_45_54",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "0.7",
      "watch_time_minutes": "1.3"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_45_54",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "3.3",
      "watch_time_minutes": "3.4"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_55_64",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "0.1",
      "watch_time_minutes": "0.1"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_55_64",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "0.8",
      "watch_time_minutes": "0.7"
    },
    {
      "viewer_gender": "FEMALE",
      "viewer_age": "AGE_65_",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "0.2",
      "watch_time_minutes": "0.2"
    },
    {
      "viewer_gender": "MALE",
      "viewer_age": "AGE_65_",
      "channel_display_name": "syncopika",
      "channel_id": "T2NUI3KLGK6sDILFbzUZZg",
      "views": "1.1",
      "watch_time_minutes": "1.3"
    }
  ];
  
  var maleData = [];
  var femaleData = [];
  
  for(var i = 0; i < bothData.length; i++){
      if(bothData[i]["viewer_gender"] === "MALE"){
          maleData.push(bothData[i]);
      }else{
          femaleData.push(bothData[i]);
      }
  }
  
  //functions for toggling between data
  function change(value){
  
      if(value === 'male'){
          update(maleData);
      }else if(value === 'female'){
          update(femaleData);
      }else{
          update(bothData);
      }
  }
  
  function update(data){
      //set domain for the x axis
      xChart.domain(data.map(function(d){ return d.viewer_age; }) );
      //set domain for y axis
      yChart.domain( [0, d3.max(data, function(d){ return +d.watch_time_minutes; })] );
      
      //get the width of each bar 
      var barWidth = width / data.length;
      
      //select all bars on the graph, take them out, and exit the previous data set. 
      //then you can add/enter the new data set
      var bars = chart.selectAll(".bar")
                      .remove()
                      .exit()
                      .data(data)		
      //now actually give each rectangle the corresponding data
      bars.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d, i){ return i * barWidth + 1 })
          .attr("y", function(d){ return yChart( d.watch_time_minutes); })
          .attr("height", function(d){ return height - yChart(d.watch_time_minutes); })
          .attr("width", barWidth - 1)
          .attr("fill", function(d){ 
              if(d.viewer_gender === "FEMALE"){
                  return "rgb(251,180,174)";
              }else{
                  return "rgb(179,205,227)";
              }
          });
      //left axis
      chart.select('.y')
            .call(yAxis)
      //bottom axis
      chart.select('.xAxis')
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d){
                  return "rotate(-65)";
              });
              
  }//end update
  
  //set up chart
  var margin = {top: 20, right: 20, bottom: 95, left: 50};
  var width = 800;
  var height = 500;
  
  chart.attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var xChart = d3.scaleBand()
                  .range([0, width]);
                  
  var yChart = d3.scaleLinear()
                  .range([height, 0]);
  
  var xAxis = d3.axisBottom(xChart);
  var yAxis = d3.axisLeft(yChart);
  
  //set up axes
  //left axis
      chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            
      //bottom axis
      chart.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d){
                  return "rotate(-65)";
              });
  
  //add labels
  chart
      .append("text")
      .attr("transform", "translate(-35," +  (height+margin.bottom)/2 + ") rotate(-90)")
      .text("% of total watch time");
          
  chart
      .append("text")
      .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 5) + ")")
      .text("age group");
  
  //use bothData to begin with
  update(bothData);

  setTimeout(function(){ change("male") }, 3000);
  setTimeout(function(){ change("female") }, 6000);
    return brushed_div;
}