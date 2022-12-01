import $ = require('jquery');
declare var require: any;
import * as d3 from 'd3';
import chroma from 'chroma-js';

export class GradientPalet {
    private _posList: { x: number, y: number, sat: number, bri: number }[] = [];
    private satN: number = 7;
    private briN: number = 7;
    private radius: number = 20;
    private padding: number = 10;
    private _clickCount: number = 0;
    private _selectedMax: number = 3;

    constructor() {
        for (let i = 0; i < this.satN; i++) {
            for (let j = 0; j < this.briN; j++) {
                let sat = 1 - i / (this.satN - 1);
                let bri = 1 - j / (this.briN - 1);
                this._posList.push({
                    x: i * (this.radius * 2 + this.padding),
                    y: j * (this.radius * 2 + this.padding),
                    sat: sat,
                    bri: bri
                });
            }
        }
        d3.selectAll('svg')
            .append('g')
            .attr('id', 'gradient-palet')
            .selectAll('circle')
            .data(this._posList)
            .enter()
            .append('circle')
            .attr('class', 'sat-circle');
    }

    public draw(hue: number, x: number, y: number) {
        const color2id = (code: string) => code.replace('#', 'HEX');

        d3.select('#gradient-palet')
            .attr('transform-origin', `${x}px ${y}px`)
            .attr('transform', `rotate(-45) translate(${x}, ${y})`)
            .selectAll('circle')
            .data(this._posList)
            .attr('id', (d: any) => color2id(chroma.hsv(hue, d.sat, d.bri).hex()))
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)
            .attr('r', this.radius)
            .style('fill', (d: any) => chroma.hsv(hue, d.sat, d.bri).hex())
            .on('click', (e: Event, d: any) => {
                let color: string = chroma.hsv(hue, d.sat, d.bri).hex();
                console.log(d.sat, d.bri)

                if (this._clickCount < this._selectedMax) {
                    $(`#color${this._clickCount}`)
                        .css({
                            'background': color,
                            'color': d.sat < 0.4 && d.bri > 0.3 ? '#222' : '#EEE'
                        })
                        .text(color);
                }
                this._clickCount++;

                if (this._clickCount >= this._selectedMax) {
                    this.resetSelectedColor();
                }
            });
    }

    public resetSelectedColor() {
        this._clickCount = 0;
        
    }
}