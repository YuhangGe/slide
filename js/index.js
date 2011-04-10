var canvas = null;
 var s=null;



window.onload=function(){


    canvas = $.$('canvas');
    
    s= new Abe.Slide(canvas, 400, 300,true);

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
		src: 'images/5.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Koala',
		src: 'images/6.jpg',
		url: 'http://www.nju.edu.cn'
	},{
		title: 'Desert',
		src: 'images/7.jpg',
		url: 'http://www.nju.edu.cn'
	}];
    s.loadImages(i); 
}
