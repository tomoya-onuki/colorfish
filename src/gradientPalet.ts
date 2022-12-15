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
    private colorMode: string = 'hex';

    constructor() {
        for (let i = 0; i < this.briN; i++) {
            for (let j = 0; j < this.satN; j++) {
                let bri = 1 - i / (this.briN - 1);
                let sat = 1 - j / (this.satN - 1);
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

    public changeColorMode(mode: string) {
        this.colorMode = mode;
        let hsb = chroma(String($('#color0').attr('name'))).hsv();
        $('#color0').text(this.colorText(hsb[0], hsb[1], hsb[2]));
        hsb = chroma(String($('#color1').attr('name'))).hsv();
        $('#color1').text(this.colorText(hsb[0], hsb[1], hsb[2]));
        hsb = chroma(String($('#color2').attr('name'))).hsv();
        $('#color2').text(this.colorText(hsb[0], hsb[1], hsb[2]));
    }

    private colorText(h: number, s: number, b: number): string {
        let color = chroma.hsv(h, s, b);

        if (this.colorMode === 'hex') {
            return color.hex();
        } else if (this.colorMode === 'rgb') {
            let rgb = color.rgb();
            return `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        } else if (this.colorMode === 'hsv') {
            s = Math.round(s * 100) / 100;
            b = Math.round(b * 100) / 100;
            return `(${h}, ${s}, ${b})`;
        }
        return '';
    }

    public draw(hue: number, x: number, y: number) {
        const color2id = (code: string) => code.replace('#', 'HEX');

        var tooltip = d3.select("body").append("div").attr("class", "tooltip");

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

                if (this._clickCount < this._selectedMax) {
                    $(`#color${this._clickCount}`)
                        .css({
                            'background': color,
                            'color': d.bri > 0.5 ? '#222' : '#EEE'
                        })
                        .text(this.colorText(hue, d.sat, d.bri))
                        .attr('name', color);
                }
                this._clickCount++;

                if (this._clickCount === 2) {
                    hue += 180;
                    d3.select('#hue-palet').attr('transform', `rotate(${240 - hue})`);
                    d3.select('#gradient-palet')
                        .selectAll('circle')
                        .data(this._posList)
                        .style('fill', (d: any) => chroma.hsv(hue, d.sat, d.bri).hex());
                }
                else if (this._clickCount >= this._selectedMax) {
                    this.resetSelectedColor();
                }
            })
            .on('mouseover', (e: any, d: any) => {
                tooltip
                    .text(this.colorText(hue, d.sat, d.bri))
                    .style("top", (e.pageY - 20) + "px")
                    .style("left", (e.pageX + 10) + "px")
                    .style("visibility", "visible");
            })
            .on('mouseout', () => {
                tooltip.style("visibility", "hidden");
            });
    }

    public resetSelectedColor() {
        this._clickCount = 0;

    }
}