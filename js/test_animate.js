/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */
if(typeof Abe==="undefined"){
	throw "need slide.js";
}
 
Abe.TestAnimate = function(width, height){
    this.base(width, height)
	this._tn=0;

}
Abe.TestAnimate.prototype = {
	getSlideSpeed: function(){
        return 500;
    },
    startAnimate: function(){
       	this._tn=0;
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
        this._tn++;
        if(this._tn>3){
        	this._hasNextFrame=false;
        	$.dprint('t a fini');
        }
    }
}
$.inherit(Abe.TestAnimate,Abe.SlideAnimate);
