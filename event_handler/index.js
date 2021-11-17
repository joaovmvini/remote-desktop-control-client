const { keyboard, Key, mouse, left, right, up, down, screen } = require("@nut-tree/nut-js");

module.exports = class EventHandler {
    constructor(io) {
        this.io = io;
        this.mouseState = null;
        this.mouseVariationX = 0;
        this.mouseVariationY = 0;
    }

    async sendScreenDimensions() {
        const [w, h] = await Promise.all([screen.width(), screen.height()]);
        this.io.emit('SCREEN_DIMENSIONS', { width: w, height: h });
    }

    mouse_move_events() {
        mouse.getPosition().then(point => {
            if (this.mouseState) {
                this.mouseVariationX = Math.abs(this.mouseState.x - point.x);
                this.mouseVariationY = Math.abs(this.mouseState.y - point.y);

                if (this.mouseVariationX >= 0 || this.mouseVariationY >= 0) {
                    this.io.emit('MOUSE_MOVE', point);
                }
            }
            this.mouseState = point;
        });

        return setTimeout(() => this.mouse_move_events(), 10);
    }

    async start() {
        await this.sendScreenDimensions();
        this.mouse_move_events();
    }
}

