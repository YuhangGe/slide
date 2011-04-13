/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */

Abe.RectAnimate= function(width,height) {
	this.base(width, height);
	this._dir=0;//方向，左、右、上、下，左上，右上、左下、右下
	this._start=0;
	this._stop=0;
	this._step=0;
	this._ratio=this._height/this._width;
}
Abe.RectAnimate.prototype={
	getSlideSpeed: function() {
		return 80;
	},
	startAnimate: function() {
		this._dir=Math.floor(Math.random()*8);
		this._start=0;
		this._step=10;
		switch(this._dir) {
			case 0:
			case 1:
			case 4:
			case 5:
			case 6:
			case 7:
				this._stop=this._width;
				break;
			default:
				this._stop=this._height;
				break;
		}
		this.callBase('startAnimate');
	},
	renderNextFrame: function(sender) {
		if(this._hasNextFrame===false)
			return;

		this._start+=this._step;
		if(this._start>this._stop)
			this._start=this._stop;

		switch(this._dir) {
			case 0:
				this._left(sender);
				break;
			case 1:
				this._right(sender);
				break;
			case 2:
				this._top(sender);
				break;
			case 3:
				this._bottom(sender);
				break;
			case 4:
				this._topLeft(sender);
				break;
			case 5:
				this._topRight(sender);
				break;
			case 6:
				this._bottomLeft(sender);
				break;
			case 7:
				this._bottomRight(sender);
				break;
		}

		if(this._start===this._stop)
			this._hasNextFrame=false;

	},
	_left: function(sender) {
		sender.context.drawImage(sender.maskCanvas,-this._start,0);
		sender.context.drawImage(sender.midCanvas,this._width-this._start,0);
	},
	_right: function(sender) {
		sender.context.drawImage(sender.maskCanvas,this._start,0);
		sender.context.drawImage(sender.midCanvas,this._start-this._width,0);
	},
	_top: function(sender) {
		sender.context.drawImage(sender.maskCanvas,0,this._start);
		sender.context.drawImage(sender.midCanvas,0,this._start-this._height);
	},
	_bottom: function(sender) {
		sender.context.drawImage(sender.maskCanvas,0,-this._start);
		sender.context.drawImage(sender.midCanvas,0,-this._start+this._height);
	},
	_topLeft: function(sender) {
		sender.context.drawImage(sender.maskCanvas,this._start,this._start*this._ratio);
		sender.context.drawImage(sender.midCanvas,this._start-this._width,(this._start-this._width)*this._ratio);
	},
	_bottomLeft: function(sender) {
		sender.context.drawImage(sender.maskCanvas,this._start,-this._start*this._ratio);
		sender.context.drawImage(sender.midCanvas,this._start-this._width,(this._width-this._start)*this._ratio);
	},
	_topRight: function(sender) {
		sender.context.drawImage(sender.maskCanvas,-this._start,this._start*this._ratio);
		sender.context.drawImage(sender.midCanvas,this._width-this._start,(this._start-this._width)*this._ratio);
	},
	_bottomRight: function(sender) {
		sender.context.drawImage(sender.maskCanvas,-this._start,-this._start*this._ratio);
		sender.context.drawImage(sender.midCanvas,-this._start+this._width,(this._width-this._start)*this._ratio);
	}
}
$.inherit(Abe.RectAnimate, Abe.SlideAnimate);