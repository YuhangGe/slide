/**
 * 幻灯片播放器
 * @author: abraham
 * @email: abraham1@163.com
 * 依赖jquery.js、js-oo.js文件
 */

var Abe = {};//定义命名空间，所有动画插件的声明都需要在此命名空间之下
/**
 *
 * @param {Object} canvas
 * @param {Json Object} params 可选，配置json，包括如下选项:
 * {
 * 	width:{Number}, 画布宽度,可忽略,如果忽略，在调用loadImages前可以调用setSize设置，否则将使用canvas的默认宽高作为画面的宽高.
 * 	height:{Number}, 画面高度,可忽略,同上.width和height必须同时指定
 *  strength: {Boolean}, 是否根据width和height强致伸缩图片，如果为false，会把图片绘制在canvas中间,默认为true
 *	bgColor:{String},背景颜色字符串，如果忽略，则不填充背景
 * 	bgImage:{Image},背景图片，强制拉升填充，如果不设置则不填充。如果同时设置bgColor和bgImage，忽略bgImage
 * 	speed:{number},每张图片切换后的停留时间，默认为3000毫秒，即3秒
 * 	autoSlide:{boolean},调用loadImages函数加载图片完成后是否自动开始动画，默认为true.如果为false，可以通过loadImages的onloaded回调函数参数，以及slideNext方法手动控制播放
 * 	cursor:{string},鼠标指针样式，默认为pointer,即手形
 * 	openUrl:{boolean},单击后是否打开网页，默认为true，要求loadImages传入的参数有url.
 * 	openNew:{boolean},是否在新窗口中打开网页，默认为true;
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

		if(typeof params['width']==='number' && typeof params['height']==='number')
			this.setSize(params['width'],params['height']);
		else
			this.setSize(this._canvas.width,this._canvas.height);

		if(typeof params['bgColor']==='string')
			this._bgColor=params['bgColor'];

		if(typeof params['bgImage']!=='undefined')
			this._bgImage=params['bgImage'];

		if(typeof params['speed']==='number')
			if(params['speed']>0)
				this._speed=params['speed'];

		if(typeof params['autoSlide']==='boolean')
			this._autoSlide=params['autoSlide'];

		if(typeof params['cursor']==='string')
			this._canvas.style.cursor=params['cursor'];

		if(typeof params['openUrl']==='boolean')
			this._openUrl=params['openUrl'];

		if(typeof params['openNew']==='boolean')
			this._openNew=params['openNew'];

		// var to={
		// 			show:true,
		// 			bgColor:'black',
		// 			color:'blue',
		// 			alpha:1,
		// 			font:'20px 婼',
		// 			bgHeight:30,
		// 			bgAlpha:0.7
		// 		};
		// 		if(typeof params['title']!=='undefined') {
		// 			var top=params['title'];
		// 
		// 			if(typeof top['show']==='boolean')
		// 				this._showTitle=top['show'];
		// 			if(typeof top['bgHeight']==='number')
		// 				to['bgHeight']=top['bgHeight'];
		// 			if(typeof top['font']!=='undefined')
		// 				to['font']=top['font'];
		// 			if(typeof top['bgColor']!=='undefined')
		// 				to['bgColor']=top['bgColor'];
		// 			if(typeof top['color']!=='undefined')
		// 				to['color']=top['color'];
		// 			if(typeof top['alpha']==='number')
		// 				to['alpha']=top['alpha'];
		// 			if(typeof top['bgAlpha']==='number')
		// 				to['bgAlpha']=top['bgAlpha'];
		// 		}
		// 		this._titleOptions=to;

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

		this._images = null;
		this._loadedIndex = 0;
		this._buffer = new Array();
		this._curImgIndex = 0;

		this._speed=3000;

		this._slideArray = new Array();
		this._curSlideIndex = 0;

		this._autoSlide=true;//是否自动切换
		this._doSliding=false;//当前是否正在切换，如果是，不允许调用slideNext方法手动切换

		//当前正在等待的切换，如果当前是在自动切换的模式（this._autoSlide=true)，
		//而用户又调用了手动切换的方法slideNext，那么需要先清除这个等待的切换
		this._slideTimeOut=null;

		this._imgLoaded=false;
		this._imgOnLoaded=null;
		this._showTitle=true;
		this._canvas.style.cursor="pointer";//设置鼠标指针为手形
		this._openUrl=true;//单击后是否打开网页
		this._openNew=true;//是否在新窗口中打开
		jQuery(this._canvas).bind('click',jQuery.proxy(this._doOpenUrl,this));
	},
	_doOpenUrl: function() {
		var url=this._images[this._curImgIndex].url;
		if(url) {
			if(this._openNew)
				window.open(url);
			else
				window.location.href=url;
		}
	},
	setSize: function(width, height) {
		this._width=width;
		this._height=height;
		this._canvas.width = width;
		this._canvas.height = height;
		this._midCanvas.width = width;
		this._midCanvas.height = height;
		this._maskCanvas.width = width;
		this._maskCanvas.height = height;
	},
	//增加默认的幻灯片切换特效,现在只有两种，期待你增加更多
	_addDefaultSlides: function() {
		this.addSlideAnimate(['PushAnimate','FadeAnimate','CircleAnimate','ClockAnimate','GradientAnimate','WaterAnimate']);
		//this.addSlideAnimate(['GradientAnimate']);
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
 	* url:'www.nju.edu.cn'
 	* }
 	* @param {function} onloaded 当图片加载完成后的回调函数
 	*/
	loadImages: function(imgInfo,onloaded) {
		if (!imgInfo instanceof Array) {
			throw 'Bad arguments when loadImages';
		}
		if(this._imgLoaded===true) {
			throw 'Already loaded images.\nThis function can only be called once.';
		}
		this._images = imgInfo;
		if(typeof onloaded==='function')
			this._imgOnLoaded=onloaded;

		this._loadNext();
	},
	/**
 	* 手动切换图片
 	* @param {number} index 可选参数，切换到的图片的索引值，如果忽略，切换到下一张
 	*/
	slideNext: function(index) {
		if(this._doSliding===true) {//如果当前正在执行切换动画，忽略
			//$.dprint('current is sliding , could not operate manual slide');
			return;
		}

		//否则手动切换
		clearTimeout(this._slideTimeOut);
		//$.dprint('slide to '+index);
		var len = this._buffer.length;
		//如果没有传入index参数或都参数不合法，切换到下一张
		if(typeof index!=='number' || index>=len || index===this._curImgIndex)
			this._switchNext();
		else
			this._switchImage(index);

	},
	_loadFirstImage: function() {

		this._curImgIndex = 0;
		this._curSlideIndex = 0;
		this._addDefaultSlides();

		this._drawImage(this._buffer[0]);

	},
	_fillBackground: function() {
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

			setTimeout(jQuery.proxy(this._drawNext,this), cslide.getSlideSpeed());
		} else {

			var img=this._buffer[this._curImgIndex];
			this._drawImage(img);
			// if(this._showTitle) {
			// 	this._drawTitle(this._context,this._images[this._curImgIndex].title);
			// }
			this._doSliding=false;
			if(this._autoSlide===true)
				this._slideTimeOut=setTimeout(jQuery.proxy(this._switchNext,this), this._speed);

		}

	},
	// _drawTitle: function(ctx,text) {
	// 	ctx.font=this._titleOptions.font;
	// 	ctx.fillStyle=this._titleOptions.bgColor;
	// 	ctx.globalAlpha=this._titleOptions.bgAlpha;
	// 	ctx.fillRect(0,0,this._width,this._titleOptions.bgHeight);
	// 	ctx.fillStyle=this._titleOptions.color;
	// 	ctx.globalAlpha=this._titleOptions.alpha;
	// 	var w=ctx.measureText(text).width;
	// 	//ctx.textAlign='center';
	// 	ctx.fillText(text,(this._width-w)/2,this._titleOptions.bgHeight/2,this._width);
	// },
	_refreshContext: function() {
		this._canvas.width = this._canvas.width;
		this._midCanvas.width = this._midCanvas.width;
		this._maskCanvas.width = this._maskCanvas.width;
	},
	_switchNext: function() {
		var len = this._buffer.length;
		var index=this._curImgIndex;
		index++;
		if(index>=len)
			index=0;
		this._switchImage(index);
	},
	_switchImage: function(index) {
		this._sender.preImage = this._buffer[this._curImgIndex];
		this._curImgIndex=index;
		this._sender.curImage = this._buffer[this._curImgIndex];

		this._curSlideIndex=Math.floor(Math.random()*this._slideArray.length);
		this._doSliding=true;
		this._slideArray[this._curSlideIndex].startAnimate();
		this._drawNext();
	},
	_loadImageFinish: function() {
		//$.dprint('limgf');
		this._imgLoaded=true;
		if(this._imgOnLoaded!==null)
			this._imgOnLoaded();
		if(this._autoSlide===true)
			this._switchNext();
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
			img.onload = jQuery.proxy(this._loadNext,this);
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
	fillBackground: function() {
		return true;
	},
	/**
 	* 返回每一帧动画的间隔时间
 	*/
	getSlideSpeed: function() {
		return this._speed;
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
 	* 	background:,
 	* 	context:,
 	* 	midContext:,
 	* 	midCanvas:,
 	* 	maskContext:,
 	* 	maskCanvas
 	*  	preImage:,
 	*  	curImage:,
 	*  	strength:Boolean
 	* }
 	*/
	renderNextFrame: function(sender) {
		throw "This method must be overrided!";
	},
	_fill: function(ctx,bg) {
		if(bg===null)
			return;
		if(typeof bg === 'string') {
			ctx.fillStyle=bg;
			ctx.fillRect(0,0,this._width,this._height);
		} else {
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
