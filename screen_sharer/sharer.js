const fs = require('fs');
const screenshot = require('desktop-screenshot');

var remoteSocket = null;

const outputPath = __dirname + '/output/output.jpg';

module.exports = class ScreenSharer {
    constructor(io, fps) {
        this.io = io;
        this.fps = fps || 10;
    }
    
    start() {
        remoteSocket = this.io;
        
        screenshot(outputPath, function(error, complete) {
            if (! error) {
                var base64 = fs.readFileSync(outputPath, { encoding: 'base64' });
                fs.unlink(outputPath, function(err) {});
                remoteSocket.emit('SCREEN_IMAGE', { data: 'data:image/jpg;base64,' + base64});
            }
        });

        return setTimeout(() => this.start(), 1000 / this.fps);
    }


}
