/**
 * 幻灯片播放器
 * @author: abraham
 * @email: abraham1@163.com
 * 依赖jquery.js、js-oo.js文件
 */
var Abe = {};
/**
 *
 * @param {Object} canvas
 * @param {Json Object} params 可选，配置json，包括如下选项:
 * {
 * 	width:{Number}, 画布宽度,可忽略,如果忽略，在调用loadImages前可以调用setSize设置，否则将使用canvas的默认宽高作为画面的宽高.
 * 	height:{Number}, 画面高度,可忽略,同上.
 *  strength: {Boolean}, 是否根据width和height强致伸缩图片，如果为false，会把图片绘制在canvas中间
 *	bgColor:{String},背景颜色字符串，如果忽略，则不填充背景
 * 	bgImage:{Image},背景图片，强制拉升填充，如果不设置则不填充。如果同时设置bgColor和bgImage，忽略bgImage
 * }
 * */

Abe.Slide = function(canvas,params) {
	if (typeof canvas === 'string')
		this._canvas = document.getElementById(canvas);
	else
		this._canvas = canvas;

	//进行初始化
	this._init();

	//解析参数
	if(params) {
		if(typeof params['strength']==='boolean')
			this._stren=params['strength'];
		else
			this._stren=false;
		if(typeof params['width']==='number' && typeof params['height']==='number') {
			this.setSize(params['width'],params['height']);
		} else {
			this.setSize(this._canvas.width,this._canvas.height);
		}
		if(typeof params['bgColor']==='string')
			this._bgColor=params['bgColor'];
		if(typeof params['bgImage']!=='undefined')
			this._bgImage=params['bgImage'];
	}
	
	//构造传递给animate组件的参数
	this._sender = {
		background:(this._bgColor===null?this._bgImage:this._bgColor),
		strength:this._stren,
		context: this._context,
		midContext: this._midContext,
		midCanvas:this._midCanvas,
		maskContext: this._maskContext,
		maskCanvas:this._maskCanvas,
		preImage: null,
		curImage: null
	};

}
Abe.Slide.prototype = {
	_init: function() {
		this._context = canvas.getContext('2d');
		this._width=0;
		this._height=0;
		this._bgColor=null;
		this._bgImage=null;
		this._midCanvas = document.createElement('canvas');
		this._midContext = this._midCanvas.getContext('2d');

		this._maskCanvas = document.createElement('canvas');
		this._maskContext = this._maskCanvas.getContext('2d');
		this._maskContext.fillStyle = 'rgb(0,0,0)';

		this._speed = 3000;//间隔时间, 毫秒
		this._images = null;
		this._loadedIndex = 0;
		this._buffer = new Array();
		this._curImgIndex = 0;

		this._slideArray = new Array();
		this._curSlideIndex = 0;
	},
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
		//this.addSlideAnimate(['PushAnimate','FadeAnimate','CircleAnimate','ClockAnimate','GradientAnimate','WaterAnimate']);
		this.addSlideAnimate(['WaterAnimate']);
	},
	/**
 	* @param [string | Array] slide_name
 	*/
	addSlideAnimate: function(slide_name) {
		if(slide_name instanceof Array===true) {
			for(var i=0;i<slide_name.length;i++) {
				if(typeof Abe[slide_name[i]]==='function') {
					//$.dprint(slide_name);
					this._slideArray.push(new Abe[slide_name[i]](this._width,this._height));
				}
			}
		} else {
			if(typeof Abe[slide_name]==='function') {
				//$.dprint(slide_name);
				this._slideArray.push(new Abe[slide_name](this._width,this._height));
			}
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
	_fillBackground:function(){
		if(this._bgColor!=null) {
			this._context.fillStyle=this._bgColor;
			this._context.fillRect(0,0,this._width,this._height);
		} else if(this._bgImage!=null) {
			this._context.drawImage(this._bgImage,0,0,this._width,this._height);
		}
	},
	_drawImage: function(image) {
		//首先填充背景
		this._fillBackground();

		//绘制图片
		if(this._stren) {
			this._context.drawImage(image,0,0,this._width,this._height);
		} else {
			var i_w=image.width;
			var i_h=image.height;
			var x,y,w,h;
			if(this._width/this._height>i_w/i_h) {
				var tmp=this._height/i_h;
				var tmp_w=tmp*i_w;
				x=(this._width-tmp_w)/2;
				y=0;
				w=tmp_w;
				h=this._height;
			} else {
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
		this._refreshContext();		//刷新画布
		if (cslide.hasNextFrame()) {
			//如果动画插件需要填充背景，则先填充
			if(cslide.fillBackground()===true)
				this._fillBackground();
			//然后调用动画插件绘制下一帧
			cslide.renderNextFrame(this._sender);

			setTimeout($.proxy(this._drawNext,this), cslide.getSlideSpeed());
		} else {

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

/**
 * 幻灯片转换动画父类
 */
Abe.SlideAnimate = function(width, height) {
	this._width = width;
	this._height = height;
	this._hasNextFrame = true;
	this._speed=80;
}
Abe.SlideAnimate.prototype = {
	/**
	 * 在渲染每一帧前是否填充背景，默认返回true，Slide类通过这个函数控制是否在调用动画插件的renderNextFrame
	 * 前先调用自身的_fillBackground函数
	 */
	fillBackground:function(){
		return this._speed;
	},
	/**
 	* 返回每一帧动画的间隔时间
 	*/
	getSlideSpeed: function() {
		return 80;
	},
	/**
 	* 初始化，开始动画
 	*/
	startAnimate: function() {
		this._hasNextFrame = true;
	},
	/**
 	* @return[boolean]
 	* 返回是否还有下一帧，即转换动画是否完成
 	*/
	hasNextFrame: function() {
		return this._hasNextFrame;
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
		throw "This method must be overrided!";
	},
	_fill:function(ctx,bg){
		if(bg===null)
			return;
		if(typeof bg === 'string'){
			ctx.fillStyle=bg;
			ctx.fillRect(0,0,this._width,this._height);
		}else{
			ctx.drawImage(bg,0,0,this._width,this._height);
		}
	},
	/**
 	* 父类中的辅助函数，用来将图片绘制在画布中央
 	*/
	_drawImage: function(ctx,image,strength) {
		if(strength) {
			ctx.drawImage(image,0,0,this._width,this._height);
		} else {
			var i_w=image.width;
			var i_h=image.height;
			var x,y,w,h;
			if(this._width/this._height>i_w/i_h) {
				var tmp=this._height/i_h;
				var tmp_w=tmp*i_w;
				x=(this._width-tmp_w)/2;
				y=0;
				w=tmp_w;
				h=this._height;
			} else {
				var tmp=this._width/i_w;
				var tmp_h=tmp*i_h;
				y=(this._height-tmp_h)/2;
				x=0;
				w=this._width;
				h=tmp_h;
			}
			ctx.drawImage(image,x,y,w,h);
		}
	}
}
