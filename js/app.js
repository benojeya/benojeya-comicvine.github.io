import { wordle } from './modules/wordle.js';

// wordle of gendered names
d3.csv('assets/data/gendered_names.csv').then(function (data) {
    let wordle_genderedNames = wordle(data);
    document.getElementById("wordle_genderedNames").appendChild(wordle_genderedNames);
});