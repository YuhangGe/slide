/**
 * @author Abraham
 */
if(!Abe){
	throw 'Slide.js needed!'; 
}
Abe.FZAnimate=function(width,height){
	this.base(width,height);
	this._curAngle=0;
	this._step=10;
	this._len=100;
	this._rows=Math.floor(height/this._len);
	this._cols=Math.floor(width/this._len);

}
Abe.FZAnimate.prototype={
	getSlideSpeed: function(){
        return 300;
    },
	 startAnimate: function(){
      	this._curAngle=0;
        this.callBase( 'startAnimate');
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
        this._curAngle += this._step;
        if (this._curR >=180) 
            this._curR = 180;
		
		var show=null;
		var len=null;
		if(this._curAngle<=90){
			show=sender.preImage;
			len=-this._len*Math.cos(this._curAngle/180*Math.PI)/2;
		}else{
			show=sender.curImage;
			len=this._len*Math.cos(this._curAngle/180*Math.PI)/2;
		}
		if(sender.strength)
			sender.midContext.drawImage(show,0,0,this._width,this._height);
		else
			sender.midContext.drawImage(show,0,0);
				
		//sender.context.clearRect(this._width,this._height);
		
		
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 1; j++) {
                sender.context.drawImage(sender.midCanvas,j*this._len,i*this._len,this._len,this._len,j*this._len+len,i*this._len,this._len-2*len,this._len);
            }
        }
        //sender.midContext.globalCompositeOperation='destination-in'

		//sender.midContext.drawImage(sender.maskCanvas,0,0);
        	
		//if(sender.strength)
			//sender.context.drawImage(sender.preImage,0,0,this._width,this._height);
		//else
			//sender.context.drawImage(sender.preImage,0,0);
		//sender.context.drawImage(sender.midCanvas,0,0);
		if (this._curAngle === 180) {
            this._hasNextFrame = false;
        }
    }
}
$.inherit(Abe.FZAnimate,Abe.SlideAnimate);
