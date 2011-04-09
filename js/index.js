var c_s1 = null;
var ctx_s1 = null;
var c_s2 = null;
var ctx_s2 = null;
var c_d = null;
var ctx_d = null;

var WIDTH=300;
var HEIGHT=200;
var PIXEL_LEN=4;

var img_s1=null;
var img_s2=null;
var img_d=null;
var data_s1;
var data_s2;
var data_d;

function do_test() {
	img_s1=ctx_s1.getImageData(0,0,WIDTH,HEIGHT);
	img_s2=ctx_s2.getImageData(0,0,WIDTH,HEIGHT);
	img_d=ctx_s1.createImageData(WIDTH,HEIGHT);
	data_s1=img_s1.data;
	data_s2=img_s2.data;
	data_d=img_d.data;

	//$.dprint(img_d.width+","+img_d.height+","+data_d.length);
	//test_loop();
	var m2=new ConvMatrix(new Array(
		-1,0,-1,
		0,4,0,
		-1,0,-1
	),1,127);
	var m=new ConvMatrix(new Array(
		-1,0,-1,
		0,4,0,
		-1,0,-1
	),1,127);
	do_matrix(data_s1,data_d,m2);
	ctx_d.putImageData(img_d,0,0);
}

var CA=0;
function test_loop() {
	var alpha=CA/255;

	var y_off,index;
	for(var y=0;y<img_d.height;y++) {

		y_off=y*img_d.width*PIXEL_LEN;

		for(var x=0;x<img_d.width;x++) {
			for(var i=0;i<PIXEL_LEN;i++) {
				index=y_off+x*PIXEL_LEN+i;
				data_d[index]=Math.round(data_s2[index]*alpha+data_s1[index]*(1-alpha));
			}

		}
	}

	//$.dprint(index);
	ctx_d.putImageData(img_d,0,0);
	//$.dprint('loop');
	CA+=5;
	if(CA<255) {
		setTimeout(test_loop,10);
	} else if(CA>255) {
		CA=255;
		test_loop();
	} else {
		CA=0;
	}
}

function ConvMatrix(matrix,factor,offset) {

	this.topLeft=this.topMid=this.topRight
	=this.midLeft=this.midRight
	=this.bottomLeft=this.bottomMid=this.bottomRight=0;
	this.pixel=1;
	if(matrix instanceof Array===true && matrix.length===9) {
		this.topLeft=matrix[0];
		this.topMid=matrix[1];
		this.topRight=matrix[2];
		this.midLeft=matrix[3];
		this.pixel=matrix[4];
		this.midRight=matrix[5];
		this.bottomLeft=matrix[6];
		this.bottomMid=matrix[7];
		this.bottomRight=matrix[8];
	}
	if(typeof factor !== 'undefined')
		this.factor=factor;
	else
		this.factor=1;
	if(typeof offset !=='undefined')
		this.offset=offset;
	else
		this.offset=0;
}

ConvMatrix.prototype.setAll= function(value) {
	this.topLeft=this.topMid=this.topRight=this.midLeft=this.pixel
	=this.midRight=this.bottomLeft=this.bottomMid=this.bottomRight=value;
}
function do_matrix(data_src,data_dst,m) {

	var height=img_d.height;
	var width=img_d.width;
	var stride=width*PIXEL_LEN;
	var stride2=stride*2;

	var index=stride;
	var nPixel;
	for(var y=1;y<height-1;y++) {
		
		index+=4;
		for(var x=1;x<width-1;x++) {

			nPixel=Math.round(
			(data_src[index-stride-4]*m.topLeft+data_src[index-stride]*m.topMid+data_src[index-stride+4]*m.topRight
				+data_src[index-4]*m.midLeft+data_src[index]*m.pixel+data_src[index+4]*m.midRight
				+data_src[index+stride-4]*m.bottomLeft+data_src[index+stride]*m.bottomMid+data_src[index+stride+4]*m.bottomRight)
			/m.factor+m.offset);
			if(nPixel<0)
				nPixel=0;
			else if(nPixel>255)
				nPixel=255;

			data_dst[index]=nPixel;

			nPixel=Math.round(
			(data_src[index-stride-3]*m.topLeft+data_src[index-stride+1]*m.topMid+data_src[index-stride+5]*m.topRight
				+data_src[index-3]*m.midLeft+data_src[index+1]*m.pixel+data_src[index+5]*m.midRight
				+data_src[index+stride-3]*m.bottomLeft+data_src[index+stride+1]*m.bottomMid+data_src[index+stride+5]*m.bottomRight)
			/m.factor+m.offset);
			if(nPixel<0)
				nPixel=0;
			else if(nPixel>255)
				nPixel=255;

			data_dst[index+1]=nPixel;

			nPixel=Math.round(
			(data_src[index-stride-2]*m.topLeft+data_src[index-stride+2]*m.topMid+data_src[index-stride+6]*m.topRight
				+data_src[index-2]*m.midLeft+data_src[index+2]*m.pixel+data_src[index+6]*m.midRight
				+data_src[index+stride-2]*m.bottomLeft+data_src[index+stride+2]*m.bottomMid+data_src[index+stride+6]*m.bottomRight)
			/m.factor+m.offset);
			if(nPixel<0)
				nPixel=0;
			else if(nPixel>255)
				nPixel=255;

			data_dst[index+2]=nPixel;
			
			data_dst[index+3]=255;
			
			index+=4;
		}
		index+=4;
		
	}

}

$( function() {

	c_s1 = $.$('canvas_src_1');
	c_s1.width=WIDTH;
	c_s1.height=HEIGHT;
	ctx_s1=c_s1.getContext('2d');

	c_s2 = $.$('canvas_src_2');
	c_s2.width=WIDTH;
	c_s2.height=HEIGHT;
	ctx_s2=c_s2.getContext('2d');

	c_d = $.$('canvas_dest');
	c_d.width=WIDTH;
	c_d.height=HEIGHT;
	ctx_d=c_d.getContext('2d');

	var i=new Image();
	i.src='images/Chrysanthemum.jpg';
	i.onload= function() {
		ctx_s1.drawImage(i,0,0,WIDTH,HEIGHT);
		$('#btn_test').attr('disabled',false);
	}
	var i2=new Image();
	i2.src='images/Hydrangeas.jpg';
	i2.onload= function() {
		ctx_s2.drawImage(i2,0,0,WIDTH,HEIGHT);
	}
	/*   s= new Abe.Slide(canvas, 400, 300,true);

 	var i=[ {title: 'Chrysanthemum',
 	src: 'images/Chrysanthemum.jpg',
 	url: 'http://www.nju.edu.cn'
 	}, {
 	title: 'Hydrangeas',
 	src: 'images/Hydrangeas.jpg',
 	url: 'http://www.nju.edu.cn'
 	},{
 	title: 'Lighthouse',
 	src: 'images/Lighthouse.jpg',
 	url: 'http://www.nju.edu.cn'
 	},{
 	title: 'Penguins',
 	src: 'images/Penguins.jpg',
 	url: 'http://www.nju.edu.cn'
 	},{
 	title: 'Tulips',
 	src: 'images/Tulips.jpg',
 	url: 'http://www.nju.edu.cn'
 	},{
 	title: 'Koala',
 	src: 'images/Koala.jpg',
 	url: 'http://www.nju.edu.cn'
 	},{
 	title: 'Desert',
 	src: 'images/Desert.jpg',
 	url: 'http://www.nju.edu.cn'
 	}];
 	s.loadImages(i); */
});
