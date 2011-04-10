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
 * 可以调用setSize设置，否则将使用canvas的默认宽高作为画面的宽高.
 * @param {Number} height 画面高度,可忽略,同上.
 * @param {Boolean} stren 是否根据width和height强致伸缩图片，如果为false，会把图片绘制在canvas中间
 */
Abe.Slide = function(canvas,width,height,stren) {
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


	if(typeof width==='number' && typeof height==='number') {
		this.setSize(width,height);
	}else{
		this.setSize(this._canvas.width,this._canvas.height);
	}

}
Abe.Slide.prototype = {
	setSpeed: function(speed) {
		if (speed instanceof Number && speed > 0) {
			this._speed = speed;
		}
	},
	setSize: function(width, height) {
		this._width=width;
		this._height=height;
		//debug.print('size: '+width+','+height);
		this._canvas.width = width;
		this._canvas.height = height;
		this._midCanvas.width = width;
		this._midCanvas.height = height;
		this._maskCanvas.width = width;
		this._maskCanvas.height = height;
	},
	//增加默认的幻灯片切换特效,现在只有两种，期待你增加更多
	_addDefaultSlides: function() {
		this._slideArray.push(new Abe.FadeAnimate(this._width,this._height));
		this._slideArray.push(new Abe.CircleAnimate(this._width,this._height));
	},
	/**
	 * @param [string] slide_name 
	 */
	addSlideAnimate: function(slide_name) {
		if(typeof Abe[slide_name]==='function'){
			$.dprint(slide_name);
			this._slideArray.push(new Abe[slide_name](this._width,this._height));
		}
		
	},
	/**
 	*
 	* @param {Array} imgInfo
 	* {
 	* title:'南京大学',
 	* src:'nju.bmp',
 	* direct:'www.nju.edu.cn'
 	* }
 	*/
	loadImages: function(imgInfo) {
		if (!imgInfo instanceof Array) {
			throw 'Bad arguments when loadImages';
		}
		this._images = imgInfo;
		this._loadNext();
	},
	_loadFirstImage: function() {

		this._curImgIndex = 0;
		this._curSlideIndex = 0;
		this._addDefaultSlides();
		
		this._drawImage(this._buffer[0]);
		
	},
	_drawImage:function(image){
		if(this._stren){
			this._context.drawImage(image,0,0,this._width,this._height);
		}else{
			var i_w=image.width;
			var i_h=image.height;
			var x,y,w,h;
			if(this._width/this._height>i_w/i_h){
				var tmp=this._height/i_h;
				var tmp_w=tmp*i_w;
				x=(this._width-tmp_w)/2;
				y=0;
				w=tmp_w;
				h=this._height;
			}else{
				var tmp=this._width/i_w;
				var tmp_h=tmp*i_h;
				y=(this._height-tmp_h)/2;
				x=0;
				w=this._width;
				h=tmp_h;
			}
			this._context.drawImage(image,x,y,w,h);
		}
	},
	_drawNext: function() {
		//$.dprint('draw');
		var cslide = this._slideArray[this._curSlideIndex];
		this._refreshContext();
		if (cslide.hasNextFrame()) {

			cslide.renderNextFrame(this._sender);
			setTimeout($.proxy(this._drawNext,this), cslide.getSlideSpeed());
		} else {
			//this._refreshContext();
			var img=this._buffer[this._curImgIndex];
			this._drawImage(img);
			setTimeout($.proxy(this._switchImage,this), this._speed);
		}

	},
	_refreshContext: function() {
		this._canvas.width = this._canvas.width;
		this._midCanvas.width = this._midCanvas.width;
		this._maskCanvas.width = this._maskCanvas.width;
	},
	_switchImage: function() {
		var len = this._buffer.length;

		this._sender.preImage = this._buffer[this._curImgIndex];

		this._curImgIndex++;
		if (this._curImgIndex >= len)
			this._curImgIndex = 0;
		this._sender.curImage = this._buffer[this._curImgIndex];

		len = this._slideArray.length;

		this._curSlideIndex=Math.floor(Math.random()*len);
		this._slideArray[this._curSlideIndex].startAnimate();
		this._drawNext();
	},
	_loadImageFinish: function() {
		//$.dprint('limgf');
		this._switchImage();
	},
	_loadNext: function() {
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
		} else {
			this._loadImageFinish();
		}
	}
}

