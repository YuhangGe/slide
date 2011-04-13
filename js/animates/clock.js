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
	this._speed=40;
	this._angle=0;
	this._start=Math.PI*1.5;
	this._step=6;
	this._pi2=Math.PI*2;
	this._cx=this._width/2;
	this._cy=this._height/2;
	this._cr=Math.sqrt(this._cx*this._cx+this._cy*this._cy);
	this._tail=10;
	this._one=Math.PI/180;
}
Abe.ClockAnimate.prototype = {
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
			
		this._drawImage(sender.context,sender.curImage,sender.strength);
		
		
		this._angle+=this._step;
		if(this._angle>=360){
			this._hasNextFrame=false;
			return;
		}
		
	
		this._fill(sender.midContext,sender.background);
		this._drawImage(sender.midContext,sender.preImage,sender.strength);
		sender.maskContext.fillStyle="#0000ff";
		var from,to;
		
			from=this._start;
			if(this._anti_clock===false)
				to=this._start+this._angle*this._one;
			else
				to=this._start-this._angle*this._one;
				
			this._fillArc(sender.maskContext,from,to,1,!this._anti_clock);

			for(var i=1;i<=this._tail;i++){
	 			
				if(this._angle>=i){
					from=to;
					if(this._anti_clock===false)
						to-=this._one;
					else
						to+=this._one;
					this._fillArc(sender.maskContext,from,to,1-i/this._tail,!this._anti_clock);
				}		 	
			} 
			
	

		
		
		sender.midContext.globalCompositeOperation='destination-in'
		sender.midContext.drawImage(sender.maskCanvas,0,0);


		sender.context.drawImage(sender.midCanvas,0,0);

	},
	_fillArc:function(ctx,from,to,alpha,anticlock){;
		ctx.globalAlpha=alpha;
		ctx.beginPath()
		ctx.moveTo(this._cx,this._cy);
		ctx.arc(this._cx,this._cy,this._cr ,from,to , anticlock);
		ctx.closePath();
		ctx.fill();
		//$.dprint("from:"+from+" to "+to);
	}
}
$.inherit(Abe.ClockAnimate,Abe.SlideAnimate);
