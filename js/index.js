var canvas = null;
var s=null;
var bg=new Image();
function do_slide(){
	
	var s_width=350;
	var s_height=500;
	canvas = $.$('canvas');
	canvas.width=600;
	canvas.height=500;
	//s= new Abe.Slide(canvas);
	s= new Abe.Slide(canvas,
		{
			'bgImage':bg
		});
	//s.addSlideAnimate('TestAnimate');

	var i=[ {title: 'Chrysanthemum',
		src: 'images/1.jpg',
		url: 'http://www.nju.edu.cn'
	}, {
		title: 'Hydrangeas',
		src: 'images/2.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Lighthouse',
		src: 'images/3.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Penguins',
		src: 'images/4.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Tulips',
		src: 'images/6.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Koala',
		src: 'images/7.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Desert',
		src: 'images/8.jpg',
		url: 'http://www.nju.edu.cn'
	},
	{
		title: 'Desert',
		src: 'images/10.jpg',
		url: 'http://www.nju.edu.cn'
	}];
	s.loadImages(i);
}
window.onload= function() {


	bg.src='images/bg.jpg';
	bg.onload=do_slide();

}
