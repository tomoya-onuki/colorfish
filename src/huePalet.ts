import chroma from 'chroma-js';
import * as d3 from 'd3';
import $ = require('jquery');
import { GradientPalet } from './gradientPalet';
declare var require: any;

export class HuePalet {
    private _posList: { x: number, y: number, color: string, hue: number }[] = [];
    private cx: number;
    private cy: number;
    // private satPalet: SaturationPalet;
    private gradientPalet: GradientPalet;
    private satX: number;
    private satY: number;

    private initHue = 240;

    constructor(cx: number, cy: number) {
        let sat = 1.0;
        let bri = 1.0;
        const hueStep: number = 30;
        const radius = 100;
        this.cx = cx + radius + 20;
        this.cy = cy;
        this.satX = this.cx + radius;
        this.satY = this.cy;


        for (let i = 0; i < 360; i += hueStep) {
            let hue = this.initHue + i;
            if (hue > 360) hue -= 360;
            let rad = i / 180 * Math.PI;
            let x = this.cx + Math.cos(rad) * radius;
            let y = this.cy + Math.sin(rad) * radius;
            this._posList.push({
                x: x,
                y: y,
                color: chroma.hsv(hue, sat, bri).hex(),
                hue: hue
            });
        }

        d3.selectAll('svg')
            .append('g')
            .attr('id', 'hue-palet')
            .attr('transform-origin', `${this.cx}px ${this.cy}px`);

        this.gradientPalet = new GradientPalet();
    }

    public draw() {
        const color2id = (code: string) => code.replace('#', 'HEX');
        const radius = 20;

        d3.select('#hue-palet')
            .selectAll('circle')
            .data(this._posList)
            .enter()
            .append('circle')
            .attr('id', (d: any) => color2id(d.color))
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)
            .attr('r', radius)
            .style('fill', (d: any) => d.color)
            .on('click', (e: Event, d: any) => {
                d3.select('#hue-palet').attr('transform', `rotate(${this.initHue - d.hue})`)
                this.gradientPalet.draw(d.hue, this.satX, this.satY);
            })

        this.gradientPalet.draw(this.initHue, this.satX, this.satY);
    }

    public resetSelectedColor() {
        this.gradientPalet.resetSelectedColor();
    }

    public changeColorMode(mode: string) {
        this.gradientPalet.changeColorMode(mode);
    }
} 