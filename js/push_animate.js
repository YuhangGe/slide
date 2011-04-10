/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */
if(typeof Abe==="undefined"){
	throw "need slide.js";
}
 
Abe.PushAnimate = function(width, height){
    this.base(width, height)
	this._dir=0;//方向，左、右、上、下，左上，右上、左下、右下

}
Abe.PushAnimate.prototype = {
	getSlideSpeed: function(){
        return 30;
    },
    startAnimate: function(){
       	this._dir=0;//Math.floor(Math.random()*8);
       	switch(this._dir){
       		case 0:
       			this._start=this._width;
       			break;
       	}
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
     * 	maskCanvas:,
     *  preImage:,
     *  curImage:,
     *  strength:Boolean
     * }
     */
    renderNextFrame: function(sender){
		if(this._hasNextFrame===false)
			return;

	    switch(this._dir){
	    	case 0:
	    		this._renderLeft(sender);
	    		break;
	    }
    },
    _renderLeft:function(sender){
    	if(this._start<0){
    		this._start=0;
    	}
    	this._drawImage(sender.maskContext,sender.preImage,sender.strength);
    	this._drawImage(sender.midContext,sender.curImage,sender.strength);
    	sender.context.drawImage(sender.maskCanvas,this._start-this._width,0);
    	sender.context.drawImage(sender.midCanvas,this._start,0);
    	this._start-=10;
    	if(this._start===0){
    		this._hasNextFrame=false;
    	}
    }
}
$.inherit(Abe.PushAnimate,Abe.SlideAnimate);
