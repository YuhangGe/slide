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
Abe.Slide = function(parent,params) {

	if (typeof parent === 'string')
		this._parent = jQuery('#'+parent);
	else
		this._parent = jQuery(parent);
	if(this._parent.length===0)
		throw 'could not found parent!';

	if(this._parent.css('position')==='static')
		this._parent.css('position','relative');//设置为relative，因为子元素使用绝对定位
	//进行初始化
	this._init();

	//解析参数
	if(params ) {
		if(typeof params['strength']==='boolean')
			this._stren=params['strength'];

		if(typeof params['width']==='number' && typeof params['height']==='number')
			this.setSize(params['width'],params['height']);

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

	this._ctrl=new Abe.SlideControl(this._ctrl_canvas,'#000000');

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
		this._canvas=document.createElement('canvas');
		this._ctrl_canvas=document.createElement('canvas');
		//$.dprint($(this._canvas));
		jQuery(this._canvas).css({position:'absolute',top:'0px',left:'0px',border:'1px solid blue;',background:'black'}).appendTo(this._parent);
		jQuery(this._ctrl_canvas).css({position:'absolute',bottom:'0px',left:'0px'}).appendTo(this._parent);

		this._context = this._canvas.getContext('2d');
		this._ctrl_ctx=this._ctrl_canvas.getContext('2d');
		this._ctrlHeight=30;
		this._width=0;
		this._height=0;
		this._bgColor=null;
		this._bgImage=null;
		this._midCanvas = document.createElement('canvas');
		this._midContext = this._midCanvas.getContext('2d');

		this._maskCanvas = document.createElement('canvas');
		this._maskContext = this._maskCanvas.getContext('2d');

		this.setSize(this._parent.width(),this._parent.height());

		this._images = null;
		this._loadedIndex = 0;
		this._buffer = new Array();
		this._curImgIndex = 0;

		this._speed=3000;
		this._stren=true;
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
		$.dprint(width+","+height);
		this._width=width;
		this._height=height;
		this._parent.width(width);
		this._parent.height(height);
		this._canvas.width = width;
		this._canvas.height = height;
		this._ctrl_canvas.width=width;
		this._ctrl_canvas.height=this._ctrlHeight;
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
		$.dprint('try slide to '+index);
		if(this._doSliding===true) {//如果当前正在执行切换动画，忽略
			//$.dprint('current is sliding , could not operate manual slide');
			return false;
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

		return true;
	},
	_loadFirstImage: function() {

		this._curImgIndex = 0;
		this._curSlideIndex = 0;
		this._addDefaultSlides();

		this._drawImage(this._buffer[0]);
		this._ctrl.setCurrent(0);

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

		this._ctrl.setCurrent(index);
	},
	_loadImageFinish: function() {
		//$.dprint('limgf');
		this._ctrl.setMax(this._images.length-1);
		this._ctrl.addListener(jQuery.proxy( function(index) {
			$.dprint(this);
			return this.slideNext(index);
		},this));
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

Abe.SlideControl= function(canvas,background) {
	this._canvas=canvas;
	this._bg=background;
	this._start=0;
	this._end=0;
	this._ctx=this._canvas.getContext('2d');
	this._n=5;//显示5个索引
	this._hn=Math.floor((this._n-1)/2);
	this._btns=new Array();
	this._cur=0;
	this._mse_idx=-1;//当前鼠标移动到的索引，-1表示没有
	this._mse_in=false;

	this._init();
	this._drawBackground();

}
Abe.SlideControl.prototype={
	_Rect: function (left,top,width,height) {
		this.Left=left;
		this.Top=top;
		this.Width=width;
		this.Height=height;
		this.Right=left+width;
		this.Bottom=top+height;
		this.isPointInRect= function(x,y) {
			return (x>=this.Left && x<=this.Right)
			&& (y>=this.Top && y<=this.Bottom);
		}
	},
	_init: function() {
		this._width=this._canvas.width;
		this._height=this._canvas.height;
		this._handler=null;
		for(var i=0;i<this._n;i++) {
			this._btns.push(
			new this._Rect(
			this._width-(i+1)*10-i*20-30,
			(this._height-20)/2,
			20,
			20
			)
			);
		}
	},
	_repaint: function() {
		this._canvas.width=this._width;
		this._drawBackground();
		this._drawBtn();
	},
	_drawBackground: function() {
		this._ctx.fillStyle=this._bg;
		var start=this._width/10;
		for(var i=start;i<this._width;i++) {
			this._ctx.globalAlpha=(i-start)/this._width;
			this._ctx.fillRect(i,0,1,this._height);
		}
		this._ctx.strokeStyle='#ff0000';
		this._ctx.globalAlpha=1;
		for(var i=0;i<this._n;i++) {
			var b=this._btns[i];
			this._ctx.strokeRect(b.Left,b.Top,b.Width,b.Height);
		}
	},
	_drawBtn: function() {
		this._ctx.fillStyle='#ffffff';

		for(var i=0;i<this._n;i++) {
			var b=this._btns[this._n-i-1];
			var tmp=this._start+i;
			if(tmp!==this._mse_idx ) {
				this._ctx.font="20px sys";
			} else {
				this._ctx.font="bolder 20px sys ";
			}
			this._ctx.fillText(tmp+1,b.Left+5,b.Bottom-3);
			if(tmp===this._cur) {
				this._ctx.fillRect(b.Left+1,b.Bottom-1,b.Width-2,1);
			}

		}

	},
	setCurrent: function(index) {
		if(index<0 || index> this._end)
			return;
		this._setIndex(index);
	},
	_setIndex: function(index) {

		if(index<=this._hn) {

			this._start=0;
		} else if(index>=this._end-this._hn) {
			this._start=this._end-this._n+1;
		} else {
			this._start=index-this._hn;
		}
		this._cur=index;
		//$.dprint("cur:"+this._cur);
		this._repaint();
	},
	_dealMouseMove: function(e) {
		var x=e.layerX;
		var y=e.layerY;
		var index=-1;
		for(var i=0;i<this._n;i++) {
			var b=this._btns[i];
			if(b.isPointInRect(x,y)===true) {
				index=this._n-i-1;
				break;
			}
		}
		if(index!==-1) {
			if(this._mse_in===false) {
				//$.dprint(index);
				this._canvas.style.cursor="pointer";
				this._mse_idx=this._start+index;
				this._repaint();
				this._mse_in=true;

			}

		} else {
			if(this._mse_in===true) {
				this._canvas.style.cursor="default";
				this._mse_idx=-1;
				this._repaint();
				this._mse_in=false;
			}
		}
	},
	_dealClick: function(e) {
		if(this._handler===null)
			return;
		var index=-1;
		for(var i=0;i<this._n;i++) {
			if(this._btns[i].isPointInRect(e.layerX,e.layerY)===true) {
				index=this._n-i-1;
				break;
			}
		}
		if(index!==-1) {
			if(this._handler[this._start+index]===true){
				this._setIndex(this._start+index);
			}else{
				$.dprint('sliding wroing!');
			}
				
		}
	},
	setMax: function(max) {
		this._end=max;
		//$.dprint('max:'+max);
		this._cur=0;
		jQuery(this._canvas).bind('mousemove',jQuery.proxy(this._dealMouseMove,this));

		jQuery(this._canvas).bind('click',jQuery.proxy(this._dealClick,this));
	},
	addListener: function(handler) {
		if(typeof handler ==='function')
			this._handler=handler;
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
			ctx.drawImage(image,