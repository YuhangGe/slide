/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */
if(typeof Abe==="undefined") {
	throw "need slide.js";
}

Abe.ClockAnimate = function(width, height) {
	this.base(width, height)
	this._angle=0;
	this._start=Math.PI*1.5;
	this._step=6;
	this._pi2=Math.PI*2;
	this._cx=this._width/2;
	this._cy=this._height/2;
	this._cr=Math.sqrt(this._cx*this._cx+this._cy*this._cy);
}
Abe.ClockAnimate.prototype = {
	getSlideSpeed: function() {
		return 20;
	},
	startAnimate: function() {
		this._angle=this._step;
		this._anti_clock=(Math.floor(Math.random()*2)==0)?true:false;//是否逆时针旋转
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
	renderNextFrame: function(sender) {
		if(this._hasNextFrame===false)
			return;
		if(this._angle>360)
			this._angle=360;

		this._drawImage(sender.midContext,sender.curImage,sender.strength);
		sender.midContext.globalCompositeOperation='destination-in'

		var from,to;
		if(this._anti_clock===true) {
			from=this._start;
			to=this._start+(this._angle/360*this._pi2);
		} else {
			from=this._start-this._angle/360*this._pi2;
			to=this._start;
		}

		sender.midContext.beginPath()
		sender.midContext.moveTo(this._cx,this._cy);
		sender.midContext.arc(this._cx,this._cy,this._cr ,from,to , false);
		sender.midContext.closePath();
		sender.midContext.fill();

		this._drawImage(sender.context,sender.preImage,sender.strength);

		sender.context.drawImage(sender.midCanvas,0,0);

		this._angle+=this._step;
		if(this._angle===360) {
			this._hasNextFrame=false;
		}
	}
}
$.inherit(Abe.ClockAnimate,Abe.SlideAnimate);
