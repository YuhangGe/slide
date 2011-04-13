/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */

Abe.GradientAnimate= function(width,height) {
	this.base(width, height);
	this._dir=0;//方向，左、右、上、下，左上，右上、左下、右下
	this._start=0;
	this._stop=0;
	this._step=0;
	this._cross=Math.sqrt(this._width*this._width+this._height*this._height);
	this._tan=this._height/this._width;
	this._cos=this._width/this._cross;
	this._sin=this._height/this._cross;


	this._tail=20;
}
Abe.GradientAnimate.prototype={
	getSlideSpeed: function() {
		return 10;
	},
	startAnimate: function() {
		this._dir=Math.floor(Math.random()*8);
		this._step=3;
		this._start=0;
		switch(this._dir) {
			case 0:
			case 1:
				this._stop=this._width+this._tail;
				break;
			case 2:
			case 3:
				this._stop=this._height+this._tail;
				break;
			case 4:
			case 5:
			case 6:
			case 7:
				this._stop=Math.floor(this._cross)+this._tail;
				break;
		}
		this.callBase('startAnimate');
	},
	renderNextFrame: function(sender) {
		if(this._hasNextFrame===false)
			return;

		this._start+=this._step;

	
			this._drawImage(sender.midContext,sender.preImage,sender.strength);
			this._drawImage(sender.context,sender.curImage,sender.strength);
	

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
		sender.midContext.globalCompositeOperation='destination-in';
		sender.midContext.drawImage(sender.maskCanvas,0,0);
		sender.context.drawImage(sender.midCanvas,0,0);
		if(this._start>=this._stop)
			this._hasNextFrame=false;

	},
	_left: function(sender) {
		this._fillRect(sender.maskContext,
		[0,0,this._width-this._start,this._height],1);
		for(var i=1;i<=this._tail;i++) {
			this._fillRect(sender.maskContext,
			[this._width-this._start+i-1,0,1,this._height],1-i/this._tail);
		}
	},
	_right: function(sender) {
		this._fillRect(sender.maskContext,
		[this._start,0,this._width-this._start,this._height],1);
		for(var i=1;i<=this._tail;i++) {
			this._fillRect(sender.maskContext,
			[this._start-i-1,0,1,this._height],1-i/this._tail);
		}

	},
	_top: function(sender) {
		this._fillRect(sender.maskContext,
		[0,this._start,this._width,this._height-this._start],1);
		for(var i=1;i<=this._tail;i++) {
			this._fillRect(sender.maskContext,
			[0,this._start-i-1,this._width,1],1-i/this._tail);
		}
	},
	_bottom: function(sender) {
		this._fillRect(sender.maskContext,
		[0,0,this._width,this._height-this._start],1);
		for(var i=1;i<=this._tail;i++) {
			this._fillRect(sender.maskContext,
			[0,this._height-this._start+i-1,this._width,1],1-i/this._tail);
		}
	},
	_topLeft: function(sender) {
		this._fillPath(sender.maskContext,
		[
		[this._start/this._cos,0],
		[0,this._start/this._sin],
		[0,this._height],
		[this._width,this._height],
		[this._width,0]
		],1);
		for(var i=1;i<=this._tail;i++) {
			var to=this._start-i;
			var from=to+1;
			this._fillPath(sender.maskContext,
			[
			[from/this._cos,0],
			[0,from/this._sin],
			[0,to/this._sin],
			[to/this._cos,0]
			],1-i/this._tail
			);
		}
		//$.dprint('ok');
	},
	_bottomLeft: function(sender) {
		this._fillPath(sender.maskContext,
		[
		[0,this._height-this._start/this._cos],
		[0,0],
		[this._width,0],
		[this._width,this._height],
		[this._start/this._sin,this._height],

		],1);
		for(var i=1;i<=this._tail;i++) {
			var to=this._start-i;
			var from=to+1;
			this._fillPath(sender.maskContext,
			[
			[0,this._height-from/this._cos],
			[0,this._height-to/this._cos],
			[to/this._cos,this._height],
			[from/this._sin,this._height]
			],1-i/this._tail
			);
		}
	},
	_topRight: function(sender) {
		this._fillPath(sender.maskContext,
		[
		[this._width-this._start/this._sin,0],
		[0,0],
		[0,this._height],
		[this._width,this._height],
		[this._width,this._start/this._cos]

		],1);
		for(var i=1;i<=this._tail;i++) {
			var to=this._start-i;
			var from=to+1;
			this._fillPath(sender.maskContext,
			[
			[this._width,from/this._cos],
			[this._width,to/this._cos],
			[this._width-to/this._sin,0],
			[this._width-from/this._sin,0]
			],1-i/this._tail
			);
		}
	},
	_bottomRight: function(sender) {
		this._fillPath(sender.maskContext,
		[
		[this._width-this._start/this._cos,this._height],
		[this._width,this._height-this._start/this._sin],
		[this._width,0],
		[0,0],
		[0,this._height]
		],1
		);

		for(var i=1;i<=this._tail;i++) {
			1-i/this._tail;
			var to=this._start-i;
			var from=to+1;
			this._fillPath(sender.maskContext,
			[
			[this._width-from/this._cos,this._height],
			[this._width-to/this._cos,this._height],
			[this._width,this._height-to/this._sin],
			[this._width,this._height-from/this._sin]
			],1-i/this._tail
			);
		}
	},
	_fillRect: function(ctx,points,alpha) {
		ctx.globalAlpha=alpha;
		ctx.fillRect(points[0],points[1],points[2],points[3]);
	},
	_fillPath: function(ctx,points,alpha) {
		ctx.globalAlpha=alpha;
		ctx.beginPath();
		ctx.moveTo(points[0][0],points[0][1]);
		for(var i=1;i<points.length;i++)
			ctx.lineTo(points[i][0],points[i][1]);
		ctx.closePath();
		ctx.fill();
	}
}
$.inherit(Abe.GradientAnimate, Abe.SlideAnimate);