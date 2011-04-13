/**
 * 幻灯片切换特效的类
 * 水波效果
 * @author:Abraham
 * Email:abraham1@163.com
 */

Abe.WaterAnimate= function(width,height) {
	this.base(width, height);
	this._start=0;
	this._stop=0;
	this._step=0;

	this._pi2=Math.PI*2;
	this._cx=this._width/2;
	this._cy=this._height/2;
	this._cr=Math.floor(Math.sqrt(this._cx*this._cx+this._cy*this._cy));

	this._tail=30;
}
Abe.WaterAnimate.prototype={
	getSlideSpeed: function() {
		return 20;
	},
	startAnimate: function() {

		this._step=4;
		this._start=0;
		this._stop=this._cr+this._tail;

		this.callBase('startAnimate');
	},
	renderNextFrame: function(sender) {
		if(this._hasNextFrame===false)
			return;

		this._start+=this._step;

		this._drawImage(sender.midContext,sender.curImage,sender.strength);
		this._drawImage(sender.context,sender.preImage,sender.strength);

		for(var i=1;i<=this._tail;i++) {
			this._pathCircle(sender.maskContext,
			[this._cx,this._cy,this._start-i],
			i/this._tail);
			sender.maskContext.stroke();
		}

		this._pathCircle(sender.maskContext,
		[this._cx,this._cy,this._start-this._tail],
		1);
		sender.maskContext.fill();

		sender.midContext.globalCompositeOperation='destination-in';
		sender.midContext.drawImage(sender.maskCanvas,0,0);
		sender.context.drawImage(sender.midCanvas,0,0);
		if(this._start>=this._stop)
			this._hasNextFrame=false;

	},
	_pathCircle: function(ctx,points,alpha) {
		if(points[2]<0)
			return;
		ctx.globalAlpha=alpha;
		ctx.beginPath();
		ctx.arc(points[0],points[1],points[2],0,this._pi2,false);
	},
}
$.inherit(Abe.WaterAnimate, Abe.SlideAnimate);