var canvas = null;
var s=null;
var bg=new Image();
function do_slide() {

	s= new Abe.Slide('slide_context');
	// s= new Abe.Slide('slide_context',
	// 	{
	// 		strength:true,
	// 		autoSlide:true,
	// 		openNew:false
	// 	});
	// //s.addSlideAnimate('TestAnimate');
	//
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
		title: 'n	',
		src: 'images/4.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Tulips',
		src: 'images/6.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Lovely',
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
	s.loadImages(i, function() {
		$.dprint('image loaded finished!');
		$('#testBtn').attr('disabled',false);
	});
}

function slideTo() {
	s.slideNext(6);
}

window.onload= function() {

	bg.src='images/bg.jpg';
	bg.onload=do_slide();

}
