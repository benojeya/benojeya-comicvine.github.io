import { wordle } from './modules/wordle.js';
import { funnel } from './modules/funnel.js';
//import { hBar } from './modules/hBar.js';
import { hBar } from './modules/hBar-funnel.js';
import { stackedBar } from './modules/stackedBar.js'


d3.csv('assets/data/gendered_names.csv').then(function (data) {
    // Wordle Generation for gendered names
    let allGenders = data.map(function(d) {
        return {
            text: d.gen_name,
            size: d.count,
            gender: d.gender
        };
    });

    let male = data.filter(function (d) { 
            return d.gender == 1; 
        }).map(function(d) {
            return {
                text: d.gen_name,
                size: d.count,
                gender: d.gender
            };
    });

    let female = data.filter(function (d) { 
            return d.gender == 2; 
        }).map(function(d) {
            return {
                text: d.gen_name,
                size: d.count,
                gender: d.gender
            };
    });

    let wordle_genderedNames = wordle(allGenders, 1200, 500);
    let wordle_maleNames = wordle(male, 500, 500);
    let wordle_femaleNames = wordle(female, 500, 500);

    document.getElementById("wordle_genderedNames").appendChild(wordle_genderedNames);
    document.getElementById("wordle_maleNames").appendChild(wordle_maleNames);
    document.getElementById("wordle_femaleNames").appendChild(wordle_femaleNames);

    // funnel chart for gendered names
    let funnel_genderedNames = funnel(data);
    document.getElementById("funnel_genderedNames").appendChild(funnel_genderedNames);
});

d3.csv('assets/data/gendered_powers.csv').then(function (data) {
    // bar chart for gendered powers
    let hBar_genderedPowers = hBar(data);
    document.getElementById("hBar_genderedPowers").appendChild(hBar_genderedPowers);
});

d3.csv('assets/data/gendered_year_range_marvel.csv').then(function (data) {
    // stacked bar chart for year of appearance
    let stackedBar_time = stackedBar(data);
    document.getElementById("stackedBar_time").appendChild(stackedBar_time);
});

