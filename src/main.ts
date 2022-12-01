import $ = require('jquery');
declare var require: any;
import * as d3 from 'd3';
import { HuePalet } from './huePalet';

$(function () {
    new Main().init();
});


export class Main {
    constructor() {
    }

    public init() {
        const width = Number($('#svg').width());
        const height = Number($('#svg').height());
        d3.select('#svg')
            .append("svg")
            .attr('width', width)
            .attr('height', height);


        let huePalet: HuePalet = new HuePalet(0, height / 2);
        huePalet.draw();
    }
}