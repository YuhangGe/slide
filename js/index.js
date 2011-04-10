var canvas = null;
 var s=null;



window.onload=function(){


    canvas = $.$('canvas');
    
    s= new Abe.Slide(canvas, 400, 300,true);

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
    s.loadImages(i); 
}
