/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */
if(typeof Abe==="undefined"){
	throw "need slide.js";
}

Abe.CircleAnimate = function(width, height){
    this.base(width, height)
    this._maxR = 25;
    this._curR = 0;
    this._step = 3;
	this._rows=Math.floor(height/this._maxR/2)+1;
	this._cols=Math.floor(width/this._maxR/2)+1;

}
Abe.CircleAnimate.prototype = {
    startAnimate: function(){
        this._curR = 0;
        this.callBase('startAnimate');
    },
    /**
     *
     * @param {Object} sender
     * {
     * 	context:,
     * 	midContext:,
     * 	midCanvas:,
     * 	maskContext:,
     *  preImage:,
     *  curImage:,
     *  strength:Boolean
     * }
     */
    renderNextFrame: function(sender){
		if(this._hasNextFrame===false)
			return;
        this._curR += this._step;
        if (this._curR >=this._maxR+5) 
            this._curR = this._maxR+5;
            
        this._fill(sender.midContext,sender.background);
        this._drawImage(sender.midContext,sender.curImage,sender.strength);
		
        for (var i = 0; i < this._rows; i++) {
            for (var j = 0; j < this._cols; j++) {
                sender.maskContext.beginPath()
                sender.maskContext.arc( this._maxR + 2 *  this._maxR * j,  this._maxR + 2 *  this._maxR * i,  this._curR, 0, Math.PI * 2, false);
                sender.maskContext.closePath();
                sender.maskContext.fill();
            }
        }
        sender.midContext.globalCompositeOperation='destination-in'

		sender.midContext.drawImage(sender.maskCanvas,0,0);
        
        this._drawImage(sender.context,sender.preImage,sender.strength);	

		sender.context.drawImage(sender.midCanvas,0,0);
		if (this._curR === this._maxR+5) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.CircleAnimate,Abe.SlideAnimate);

