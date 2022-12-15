import $ = require('jquery');
declare var require: any;
import { ColorFish } from "./colorFish";

export class BackgroundCanvas {
    private fishN = 30;
    private colorFisList: ColorFish[] = [];
    private cvs: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private w: number = 0;
    private h: number = 0;

    private bubbleList: {
        x: number, y: number, speed: number, r: number
    }[] = [];

    constructor() {
        this.cvs = <HTMLCanvasElement>$('#bg-cvs')[0];
        this.ctx = <CanvasRenderingContext2D>this.cvs.getContext('2d');

        this.w = Number($('#bg-cvs').width()) * devicePixelRatio;
        this.h = Number($('#bg-cvs').height()) * devicePixelRatio;
        this.cvs.width = this.w;
        this.cvs.height = this.h;
        this.cvs.style.width = this.w / devicePixelRatio + 'px';
        this.cvs.style.height = this.h / devicePixelRatio + 'px';

        for (let i = 0; i < this.fishN; i++) {
            this.colorFisList.push(new ColorFish(this.w, this.h));
        }

        for (let i = 0; i < 100; i++) {
            this.bubbleList.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                speed: Math.random() * 5 + 0.5,
                r: Math.random() * 5 + 1
            });
        }
    }

    public resize(w: number, h:number) {
        this.w = w * devicePixelRatio;
        this.h = h * devicePixelRatio;
        this.cvs.width = this.w;
        this.cvs.height = this.h;
        this.cvs.style.width = this.w / devicePixelRatio + 'px';
        this.cvs.style.height = this.h / devicePixelRatio + 'px';

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.colorFisList.forEach(fish => {
            fish.draw(this.ctx);
            fish.w = w;
            fish.h = h;
        })
    }

    public render(fps: number) {
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.colorFisList.forEach(fish => {
                fish.draw(this.ctx);
            })
            this.drawBubble();
        }, fps);
    }

    private drawBubble() {
        this.bubbleList.forEach(b => {
            this.ctx.fillStyle = 'rgba(213, 234, 255, 0.5)';
            this.ctx.strokeStyle = 'rgba(213, 234, 255, 1.0)';
            this.ctx.beginPath();
            this.ctx.ellipse(b.x + b.r, b.y + b.r, b.r * 2, b.r * 2, 0, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            b.y -= b.speed;
            if (b.y < 0) {
                b.y = this.h;
                b.x = Math.random() * this.w;
            }
        });
    }
}