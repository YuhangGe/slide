var canvas = null;
 var s=null;


window.onload=function(){

	var s_width=300;
	var s_height=400;
	
    canvas = $.$('canvas');
    canvas.width=500;
    canvas.height=400;
    s= new Abe.Slide(canvas,null,null);//(, s_width,s_height,true);
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
