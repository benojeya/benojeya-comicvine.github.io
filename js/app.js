import { wordle } from './modules/wordle.js';
import { funnel } from './modules/funnel.js';
import { hBar } from './modules/hBar-funnel.js';
import { stackedBar } from './modules/stackedBar.js'
import { brushing } from './modules/brushing.js';

var curPage = 1,
    wordle_genderedNames,
    wordle_maleNames,
    wordle_femaleNames;

function init () {
    d3.csv('assets/data/gendered_names.csv').then(function (data) {
        let allGenders = data.map(function(d) {
            return {
                text: d.gen_name,
                size: d.count,
                gender: d.gender,
                char: d.char_list,
                count: d.count
            };
        });
        let male = data.filter(function (d) { 
                return d.gender == 1; 
            }).map(function(d) {
                return {
                    text: d.gen_name,
                    size: d.count,
                    gender: d.gender,
                    char: d.char_list,
                    count: d.count
                };
        });

        let female = data.filter(function (d) { 
                return d.gender == 2; 
            }).map(function(d) {
                return {
                    text: d.gen_name,
                    size: d.count,
                    gender: d.gender,
                    char: d.char_list,
                    count: d.count
                };
        });
        wordle_genderedNames = wordle(allGenders, 550, 550);
        wordle_maleNames = wordle(male, 400, 550);
        wordle_femaleNames = wordle(female, 400, 550);
    
        document.getElementById("wordle_genderedNames").appendChild(wordle_genderedNames.div);
        document.getElementById("wordle_maleNames").appendChild(wordle_maleNames.div);
        document.getElementById("wordle_femaleNames").appendChild(wordle_femaleNames.div);
        // wordle_genderedNames.cloud
        //     .attr("transform", function(d, i) {
        //         return "translate(" + [d.x*(i+1)*500, d.y ] + ")";
        //     })
        // wordle_maleNames.cloud
        //     .attr("transform", function(d, i) {
        //         return "translate(" + [-2000, d.y ] + ")";
        //     })
        // wordle_femaleNames.cloud
        //     .attr("transform", function(d, i) {
        //         return "translate(" + [2000, d.y ] + ")";
        //     })
        let funnel_genderedNames = funnel(data);
        document.getElementById("funnel_genderedNames").appendChild(funnel_genderedNames);
    });
    // window.onwheel =  throttle(function(e) {
    //     scroll.call(this, [e]);
    // }, 500);
    window.onscroll = throttle(function(e){
        scrolling.call(this, [e])
    }, 100);
}

function throttle(callback, limit) {
    var wait = false;               
    return function (...args) {           
        if (!wait) {              
            callback.apply(this, args); 
            wait = true;    
            setTimeout(function () {
                wait = false;          
            }, limit);
        }
    }
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

function scrolling(e) {
    let page3 = document.getElementById("page3"),
        page5 = document.getElementById("page5"),
        page8 = document.getElementById("page8"),
        page12 = document.getElementById("page12"),
        pos1 = findPos(page3) - 100,
        pos2 = findPos(page12),
        pos3 = findPos(page8)[0],
        pos4 = findPos(page5)[0],
        top = window.pageYOffset,
        bottom = window.pageYOffset + window.innerHeight;
        
    if(top >= pos4 + page5.offsetHeight) {
        d3.select("#titleInsert").text("Do you want to understand the powers?");
        d3.select("#textInsert").text(" ");
        d3.select("#textInsert_names").text("Click on a circle and I‘ll tell ya what it means!");
    } else {
        d3.select("#titleInsert").text("DO you want the names?");
        d3.select("#textInsert").text(" ");
        d3.select("#textInsert_names").text("Click on a circle and I‘ll list gender-titled characters!");
    }
    if(top >= pos1 && bottom <= pos2) {
        d3.select("#stick2").style("transform", "translate(0, 0)")
        
    } else {
        d3.select("#stick2").style("transform", "translate(-120%, 0)")
    }
}

// function scrollPage(pg, ms, t) {
//    // window.setTimeout (function () {   
//         window.scrollTo({
//             top: findPos(document.getElementById("page" + pg)),
//             left: 0,
//             behavior: 'smooth'
//         })
//         d3.select("#stick2").style("transform", "translate("+ t + ", 0)")
//     //}, ms);
// }

// function scroll (args) {
//     let wDelta = args[0].deltaY < 0 ? "down" : "up",
//         wordler = false,
//         prevPage = curPage;
//     if(wDelta == "up" && curPage < 15) {
//         if(curPage == 2) wordler = true; 
//         curPage++;
//     } else if(wDelta == "down" && curPage > 1) {
//         curPage--;
//     }
//     console.log(curPage)

//     if(curPage == 4) {
//         wordle_genderedNames.cloud.transition()
//             .duration(1000)
//             .attr("transform", function(d, i) {
//                 return "translate(" + [d.x*(i+5)*500, d.y ] + ")";
//             })
//         scrollPage(curPage, 500, "0");
//         wordle_maleNames.cloud.transition()
//             .duration(1000)
//             .attr("transform", function(d, i) {
//                 return "translate(" + [d.x, d.y ] + ")";
//             })
//         wordle_femaleNames.cloud.transition()
//             .duration(1000)
//             .attr("transform", function(d, i) {
//                 return "translate(" + [d.x, d.y ] + ")";
//             });
        
//     } else if(curPage == 3) {
//         wordle_genderedNames.cloud.transition()
//             .duration(1000)
//             .attr("transform", function(d, i) {
//                 return "translate(" + [d.x, d.y ] + ")";
//             })
//         wordle_maleNames.cloud
//             .attr("transform", function(d, i) {
//                 return "translate(" + [-2000, d.y ] + ")";
//             })
//         wordle_femaleNames.cloud
//             .attr("transform", function(d, i) {
//                 return "translate(" + [2000, d.y ] + ")";
//             })
//         if (wordler) scrollPage(curPage, 0, "0");
//         else scrollPage(curPage, 100, "0");
//     } else if (curPage == 2) {
//         wordle_genderedNames.cloud.transition()
//             .duration(3000)
//             .attr("transform", function(d, i) {
//                 return "translate(" + [d.x*(i+5)*500, d.y ] + ")";
//             })
//             scrollPage(curPage, 0, "-120%")
//     } else if(curPage == 5) {
//         scrollPage(curPage, 0, "0");
        
//     } else if(curPage == 6 || curPage == 7) {
//         d3.select("#stick2").style("transform", "translate(0, 0)")
//         if(prevPage == 8) {
//             window.scrollTo({
//                 top: document.documentElement.scrollTop - window.innerHeight,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         } else if(prevPage == 7) {
//             window.scrollTo({
//                 top: document.documentElement.scrollTop - window.innerHeight/2,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         } else {
//             window.scrollTo({
//                 top: document.documentElement.scrollTop + window.innerHeight/2,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         }
//     }  else if(curPage == 8 || curPage == 9 || curPage == 10 || curPage == 11) {
//         d3.select("#stick2").style("transform", "translate(0, 0)")
//         if(prevPage == 7) {
//             window.scrollTo({
//                 top: findPos(document.getElementById("page8")),
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         } else if(prevPage == 8 || prevPage == 9 || prevPage == 10) {
//             window.scrollTo({
//                 top: document.documentElement.scrollTop + window.innerHeight - 0.2*window.innerHeight,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         } else {
//             window.scrollTo({
//                 top: document.documentElement.scrollTop + window.innerHeight/1.5,
//                 left: 0,
//                 behavior: 'smooth'
//             })
//         }
//     } else if(curPage == 12) {
//         scrollPage(curPage, 0, "-120%")
//     } else {
//         scrollPage(curPage, 0, "-120%")
//     }
// }
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}
window.onload = init;

// d3.csv('assets/data/gendered_names.csv').then(function (data) {
//     // Wordle Generation for gendered names
//     let allGenders = data.map(function(d) {
//         return {
//             text: d.gen_name,
//             size: d.count,
//             gender: d.gender
//         };
//     });

//     let male = data.filter(function (d) { 
//             return d.gender == 1; 
//         }).map(function(d) {
//             return {
//                 text: d.gen_name,
//                 size: d.count,
//                 gender: d.gender
//             };
//     });

//     let female = data.filter(function (d) { 
//             return d.gender == 2; 
//         }).map(function(d) {
//             return {
//                 text: d.gen_name,
//                 size: d.count,
//                 gender: d.gender
//             };
//     });

//     let genderedNames_div = document.getElementById("wordle_genderedNames");

//     let wordle_genderedNames = wordle(allGenders, genderedNames_div.clientWidth, genderedNames_div.offsetHeight);



//     let wordle_maleNames = wordle(male, 500, 500);
//     let wordle_femaleNames = wordle(female, 500, 500);

//     genderedNames_div.appendChild(wordle_genderedNames);
//     document.getElementById("wordle_maleNames").appendChild(wordle_maleNames);
//     document.getElementById("wordle_femaleNames").appendChild(wordle_femaleNames);

//     // funnel chart for gendered names
//     let funnel_genderedNames = funnel(data);
//     document.getElementById("funnel_genderedNames").appendChild(funnel_genderedNames);
// });

let brushing_genderedPowers_dc,
    brushing_genderedPowers_marvel;
d3.csv('assets/data/gendered_powers.csv').then(function (data) {
    // bar chart for gendered powers
    let hBar_genderedPowers = hBar(data);
    document.getElementById("hBar_genderedPowers").appendChild(hBar_genderedPowers);
});

d3.csv('assets/data/gendered_year_range_marvel.csv').then(function (data) {
    // stacked bar chart for year of appearance
    d3.csv('assets/data/gendered_year_marvel.csv').then(function (sdata) {
        let hBar_genderedPowers_range_marvel = stackedBar(data, function (s, e) {
            brushing_genderedPowers_marvel.brushend({
                rangeStart: s,
                rangeEnd: e
            })
        });
        document.getElementById("hBar_genderedPowers_range_marvel").appendChild(hBar_genderedPowers_range_marvel);

    
        brushing_genderedPowers_marvel = brushing(sdata);
        document.getElementById("brushing_genderedPowers_marvel").appendChild(brushing_genderedPowers_marvel.div);
    });
});
d3.csv('assets/data/gendered_year_range_dc.csv').then(function (data) {
    // stacked bar chart for year of appearance
    d3.csv('assets/data/gendered_year_dc.csv').then(function (sdata) {
        let hBar_genderedPowers_range_dc = stackedBar(data, function (s, e) {
            brushing_genderedPowers_dc.brushend({
                rangeStart: s,
                rangeEnd: e
            })
        });
        document.getElementById("hBar_genderedPowers_range_dc").appendChild(hBar_genderedPowers_range_dc);

        brushing_genderedPowers_dc = brushing(sdata);
        document.getElementById("brushing_genderedPowers_dc").appendChild(brushing_genderedPowers_dc.div);
        
    });
});