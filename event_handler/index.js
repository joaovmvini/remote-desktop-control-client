const robot = require('robotjs');

module.exports = class EventHandler {
    constructor(io) {
        this.io = io;
        this.mouseState = null;
        this.mouseVariationX = 0;
        this.mouseVariationY = 0;
    }

    async sendScreenDimensions() {
        const screenSize = robot.getScreenSize();
        this.io.emit('SCREEN_DIMENSIONS', screenSize);
    }

    mouse_move_events() {
        var point = robot.getMousePos();
        
        if (this.mouseState) {
            this.mouseVariationX = Math.abs(this.mouseState.x - point.x);
            this.mouseVariationY = Math.abs(this.mouseState.y - point.y);

            if (this.mouseVariationX >= 0 || this.mouseVariationY >= 0) {
                this.io.emit('MOUSE_MOVE', point);
            }
        }
        this.mouseState = point;

        return setTimeout(() => this.mouse_move_events(), 10);
    }

    fireKeyDown(key) {
        robot.keyTap(key);
    }

    sendMouseClick(button) {
        robot.mouseClick(button);
    }

    moveMyMouse(coords) {
        robot.moveMouse(coords.x, coords.y);
    }

    async start() {
        await this.sendScreenDimensions();
        this.mouse_move_events();
    }
}

