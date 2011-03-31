/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */
if(typeof Abe==="undefined"){
	throw "need Slide.js";
}
/**
 * 幻灯片转换动画父类
 */
Abe.SlideAnimate = function(width, height){
    this._width = width;
    this._height = height;
    this._hasNextFrame = true;
}
Abe.SlideAnimate.prototype = {
	/**
	 * 返回每一帧动画的间隔时间
	 */
    getSlideSpeed: function(){
        return 80;
    },
    /**
     * 初始化，开始动画
     */
    startAnimate: function(){
        this._hasNextFrame = true;
    },
    /**
     * @return[boolean]
     * 返回是否还有下一帧，即转换动画是否完成
     */
    hasNextFrame: function(){
        return this._hasNextFrame;
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
        throw "This method must be overrided!";
    }
}
Abe.CircleAnimate = function(width, height){
    this.base(width, height)
    this._maxR = 30;
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
		if(sender.strength)
			sender.midContext.drawImage(sender.curImage,0,0,this._width,this._height);
		else
			sender.midContext.drawImage(sender.curImage,0,0);
		
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
        	
		if(sender.strength)
			sender.context.drawImage(sender.preImage,0,0,this._width,this._height);
		else
			sender.context.drawImage(sender.preImage,0,0);
		sender.context.drawImage(sender.midCanvas,0,0);
		if (this._curR === this._maxR+5) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.CircleAnimate,Abe.SlideAnimate);



Abe.FadeAnimate=function(width,height){
	this.base(width, height);
	this._opacity=0.0;
	this._step=0.045;
}
Abe.FadeAnimate.prototype={
    startAnimate: function(){
        this._opacity = 0.0;
        this.callBase('startAnimate');
    },
    renderNextFrame: function(sender){
		if(this._hasNextFrame===false)
			return;
        this._opacity += this._step;
        if (this._opacity >= 1) 
            this._opacity = 1;
		
		sender.midContext.globalAlpha=this._opacity
		if(sender.strength)
			sender.midContext.drawImage(sender.curImage,0,0,this._width,this._height);
		else
			sender.midContext.drawImage(sender.curImage,0,0);
		
        sender.context.globalAlpha=1-this._opacity;
		if(sender.strength)
			sender.context.drawImage(sender.preImage,0,0,this._width,this._height);
		else
			sender.context.drawImage(sender.preImage,0,0);
		sender.context.globalAlpha=1;
		sender.context.drawImage(sender.midCanvas,0,0);
		if (this._opacity === 1) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.FadeAnimate, Abe.SlideAnimate);
