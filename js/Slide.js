/**
 * 幻灯片播放器
 * @author: abraham
 * @email: abraham1@163.com
 * 需要AbeUtility.js文件
 */
var Abe = {};
/**
 * 
 * @param {Object} canvas
 * @param {Number} width 画布宽度,可忽略,如果忽略，在调用loadImages前
 * 可以调用setSize设置，否则将使用第一张图片的宽高作为画面的宽高.
 * @param {Number} height 画面高度,可忽略,同上.
 * @param {Boolean} stren 是否根据width和height强致伸缩图片
 */
Abe.Slide = function(canvas,width,height,stren){
    if (typeof canvas === 'string') 
        this._canvas = get$(canvas);
    else 
        this._canvas = canvas;
		
	if(typeof stren==='boolean')
		this._stren=stren;
	else 
		this._stren=false;
	
	//debug.print(stren+','+this._stren);
    this._context = canvas.getContext('2d');
    this._width=0;
	this._height=0;
    this._midCanvas = document.createElement('canvas');
    this._midContext = this._midCanvas.getContext('2d');
    
    this._maskCanvas = document.createElement('canvas');
    this._maskContext = this._maskCanvas.getContext('2d');
    this._maskContext.fillStyle = 'rgb(0,0,0)';
    
    this._sender = {
		strength:this._stren,
        context: this._context,
        midContext: this._midContext,
		midCanvas:this._midCanvas,
        maskContext: this._maskContext,
		maskCanvas:this._maskCanvas,
        preImage: null,
        curImage: null
    };
    
    this._speed = 3000;//间隔时间, 毫秒
    this._images = null;
    this._loadedIndex = 0;
    this._buffer = new Array();
    this._curImgIndex = 0;
    
    this._slideArray = new Array();
    this._curSlideIndex = 0;
    
	this._sizeSetted=false;
	
	if(typeof width==='number' && typeof height==='number'){
		this.setSize(width,height);
	}
    //this._addDefaultSlides();
}
Abe.Slide.prototype = {
    setSpeed: function(speed){
        if (speed instanceof Number && speed > 0) {
            this._speed = speed;
        }
    },
    setSize: function(width, height){
		this._width=width;
		this._height=height;
		this._sizeSetted=true;
		//debug.print('size: '+width+','+height);
        this._canvas.width = width;
        this._canvas.height = height;
        this._midCanvas.width = width;
        this._midCanvas.height = height;
        this._maskCanvas.width = width;
        this._maskCanvas.height = height;
    },
	//增加默认的幻灯片切换特效,现在只有两种，期待你增加更多
    _addDefaultSlides: function(){
        var s = new Abe.CircleAnimate(this._width,this._height);
        
		this._slideArray.push(new Abe.FadeAnimate(this._width,this._height));
        this._slideArray.push(s);
		//this._slideArray.push(new Abe.FZAnimate(this._width,this._height));
    },
    addSlideAnimate: function(slide){
        this._slideArray.push(slide);
    },
    /**
     *
     * @param {Array} imgInfo
     * {
     * 	title:'南京大学',
     *  src:'nju.bmp',
     *  direct:'www.nju.edu.cn'
     * }
     */
    loadImages: function(imgInfo){
        if (!imgInfo instanceof Array) {
            throw 'Bad arguments when loadImages';
        }
        this._images = imgInfo;
        this._loadNext();
    },
    _loadFirstImage: function(){
		if(!this._sizeSetted)
        	this.setSize(this._buffer[0].width,this._buffer[0].height);
        this._context.drawImage(this._buffer[0], 0, 0);
        this._curImgIndex = 0;
        this._curSlideIndex = 0;
		this._addDefaultSlides();
    },
    _drawNext: function(){
        var cslide = this._slideArray[this._curSlideIndex];
        this._refreshContext();
        if (cslide.hasNextFrame()) {
			
           cslide.renderNextFrame(this._sender);
		   setTimeout($.proxy(this._drawNext,this), cslide.getSlideSpeed());
        }
        else {
			//this._refreshContext();
			var img=this._buffer[this._curImgIndex];
			if(this._stren){
				//debug.print('draw strength');
				this._context.drawImage(img,0,0,this._width,this._height);
			}else
            	this._context.drawImage(img,0,0);
            setTimeout($.proxy(this._switchImage,this), this._speed);
        }

    },
    _refreshContext: function(){
        this._canvas.width = this._canvas.width;
        this._midCanvas.width = this._midCanvas.width;
        this._maskCanvas.width = this._maskCanvas.width;
    },
    _switchImage: function(){
        var len = this._buffer.length;
        
        this._sender.preImage = this._buffer[this._curImgIndex];
        
        this._curImgIndex++;
        if (this._curImgIndex >= len) 
            this._curImgIndex = 0;
        this._sender.curImage = this._buffer[this._curImgIndex];
        
        len = this._slideArray.length;
        //this._curSlideIndex++;
        //if (this._curSlideIndex >= len) 
            //this._curSlideIndex = 0;
        this._curSlideIndex=Math.floor(Math.random()*len);
        this._slideArray[this._curSlideIndex].startAnimate();
        this._drawNext();
    },
    _loadImageFinish: function(){
        this._switchImage();
    },
    _loadNext: function(){
        var len = this._images.length;
        if (this._loadedIndex === 1) {
            this._loadFirstImage();
        }
        if (this._loadedIndex < len) {
            var info = this._images[this._loadedIndex];
            var img = new Image();
            this._loadedIndex++;
            this._buffer.push(img);
            img.src = info.src.toString();
            img.onload = $.proxy(this._loadNext,this);
        }
        else {
            this._loadImageFinish();
        }
    }
}
