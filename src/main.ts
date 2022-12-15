import $ = require('jquery');
declare var require: any;
import * as d3 from 'd3';
import { HuePalet } from './huePalet';
import { BackgroundCanvas } from './backgroundCanvas';

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


        const huePalet: HuePalet = new HuePalet(0, height / 2);
        huePalet.draw();

        const bgCvs: BackgroundCanvas = new BackgroundCanvas();
        bgCvs.render(24);

        const changeColorMode = (elem: JQuery<HTMLElement>) => {
            huePalet.changeColorMode(String(elem.val()));
        };
        $('#hex').on('input', function () {
            changeColorMode($(this));
        });
        $('#rgb').on('input', function () {
            changeColorMode($(this));
        });
        $('#hsv').on('input', function () {
            changeColorMode($(this));
        });
    }
}