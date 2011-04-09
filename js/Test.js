var c_s1 = null;
var ctx_s1 = null;
var c_s2 = null;
var ctx_s2 = null;
var c_d = null;
var ctx_d = null;

var WIDTH=300;
var HEIGHT=200;

var img_s1=null;
var img_s2=null;
var img_d=null;
var data_s1;
var data_s2;
var data_d;

var CA=0;
function do_test() {
	img_s1=ctx_s1.getImageData(0,0,WIDTH,HEIGHT);
	img_s2=ctx_s2.getImageData(0,0,WIDTH,HEIGHT);
	img_d=ctx_s2.getImageData(0,0,WIDTH,HEIGHT);//ctx_s2.createImageData(WIDTH,HEIGHT);
	data_s1=img_s1.data;
	data_s2=img_s2.data;
	data_d=img_d.data;
	 
	test_loop();
}
function test_loop(){
	var alpha=CA/255;
	for(var i=0;i<data_d.length;i+=4){
 		for(var j=0;j<3;j++){
 				data_d[i+j]=Math.round(data_s2[i+j]*alpha+data_s1[i+j]*(1-alpha));
 		}
	}
	ctx_d.putImageData(img_d,0,0);
	//$.dprint('loop');
	CA+=5;
	if(CA<255){
		setTimeout(test_loop,10);
	}else if(CA>255){
		CA=255;
		test_loop();
	}else{
		CA=0;
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
	i2.onload=function(){
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
