/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */

Abe.FlashAnimate=function(width,height){
	this.base(width, height);
	this._start=0;
	this._length=0;
	this._step=2;
}
Abe.FlashAnimate.prototype={
	getSlideSpeed:function(){
		return 5;
	},
    startAnimate: function(){
        this._length=1.5;
        this._start=0;
        this.callBase('startAnimate');
    },
    renderNextFrame: function(sender){
		if(this._hasNextFrame===false)
			return;
        this._start += this._step;
        if (this._start >= 100) 
            this._start = 100;

		var w=this._width*(1+(1-this._start/100)*this._length);
		var h=this._height*(1+(1-this._start/100)*this._length);
		var x=(this._width-w)/2;
		var y=(this._height-h)/2;
		this._drawImage(sender.midContext,sender.curImage,sender.strength);
		sender.context.globalAlpha=(this._start/100);
		sender.context.drawImage(sender.midCanvas,x,y,w,h);
		if (this._start === 100) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.FlashAnimate, Abe.SlideAnimate);