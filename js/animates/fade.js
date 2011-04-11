/**
 * 幻灯片切换特效的类
 * @author:Abraham
 * Email:abraham1@163.com
 */

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
		this._drawImage(sender.midContext,sender.curImage,sender.strength);

		
        sender.context.globalAlpha=1-this._opacity;
		this._drawImage(sender.context,sender.preImage,sender.strength);
		
		sender.context.globalAlpha=1;
		sender.context.drawImage(sender.midCanvas,0,0);
		if (this._opacity === 1) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.FadeAnimate, Abe.SlideAnimate);
