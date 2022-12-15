import chroma from 'chroma-js';

export class ColorFish {
    private x: number;
    private y: number;
    private _w: number;
    private _h: number;
    private _hue: number;
    private theta: number = 10;
    private speed: number;
    private buffer: number = 100;

    constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this._w = w;
        this._h = h;

        this._hue = Math.random() * 360;
        this.speed = Math.random() * 3 + 2;
    }

    set w(newW: number) {
        this._w = newW;
    }
    set h(newH: number) {
        this._h = newH;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // console.log('draw')
        let radius = 10;
        let r = 1;
        let m = 3;

        ctx.save()
        ctx.translate(this.x, this.y + Math.sin(this._hue / 180 * Math.PI) * 5);
        ctx.rotate(-Math.PI / 4);
        for (let i = 0; i < 360; i += 30) {
            let rad = (i + 45) / 180 * Math.PI;
            let x = Math.cos(rad) * radius;
            let y = Math.sin(rad) * radius;

            let h = this._hue + i;
            if (h > 360) h -= 360;
            ctx.fillStyle = chroma.hsv(h, 1.0, 1.0).name();
            ctx.beginPath();
            ctx.ellipse(x - r, y - r, r * 2, r * 2, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.save();
        ctx.translate(radius * 1 / Math.sqrt(2), radius * 1 / Math.sqrt(2));
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                let x = i * (r * 2 + m);
                let y = j * (r * 2 + m);
                let sat = 1 - j / (7 - 1);
                let bri = 1 - i / (7 - 1);
                ctx.fillStyle = chroma.hsv(this._hue, sat, bri).name();

                ctx.beginPath();
                ctx.ellipse(x - r, y - r, r * 2, r * 2, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        ctx.restore();
        ctx.restore();


        this.x += this.speed;
        if (this.x > this._w + this.buffer) {
            this.x = 0 - this.buffer;
        }

        this._hue += this.theta;
        if (this._hue > 360) {
            this._hue = 0;
        }
    }
}