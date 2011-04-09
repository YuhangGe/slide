/**
 * @author Abraham
 */
var image = new Image();
function init() {
	image.onload = demo;
	image.src = "images/girl.png";
}

function demo() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	canvas.width=image.width;
	canvas.height=image.height;
	// draw the image onto the canvas
	context.drawImage(image, 0, 0);

	// get the image data to manipulate
	var input = context.getImageData(0, 0, canvas.width, canvas.height);

	// get an empty slate to put the data into
	var output = context.createImageData(canvas.width, canvas.height);

	var m1=new ConvMatrix(new Array(
	-1,-1,-1,
	-1,8,-1,
	-1,-1,-1
	),1,127);

	var m2=new ConvMatrix(new Array(
	-1,0,-1,
	0,4,0,
	-1,0,-1
	),1,127);

	var m3=new ConvMatrix(new Array(
	1,2,1,
	0,0,0,
	-1,-2,-1
	),1,127)
	var start=(new Date()).getTime();
	do_matrix(input,output,m2);
	var stop=(new Date()).getTime();

	console.log('time:'+(stop-start));

	// put the image data back after manipulation
	context.putImageData(output, 0, 0);
}

function ConvMatrix(matrix,factor,offset) {

	this.topLeft=this.topMid=this.topRight
	=this.midLeft=this.midRight
	=this.bottomLeft=this.bottomMid=this.bottomRight=0;
	this.pixel=1;
	if(matrix instanceof Array===true && matrix.length===9) {
		this.data=matrix;
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
/*
function do_matrix_2(input,output,m) {
	var w = input.width, h = input.height;
	var inputData = input.data;
	var outputData = output.data;

	var nPixel;
	for (var y = 1; y < h-1; y += 1) {
		for (var x = 1; x < w-1; x += 1) {
			for (var c = 0; c < 3; c += 1) {
				var i = (y*w + x)*4 + c;
				nPixel =Math.round((m.topLeft*inputData[i - w*4 - 4] +m.topMid*inputData[i - w*4]+m.topRight*inputData[i - w*4 + 4]
					+m.midLeft*inputData[i - 4]       + m.pixel*inputData[i]  +m.midRight*inputData[i + 4]
					+m.bottomLeft*inputData[i + w*4 - 4] +m.bottomMid*   inputData[i + w*4] +m.bottomRight* inputData[i + w*4 + 4]
				)/m.factor) +m.offset;
				if(nPixel<0)
					nPixel=0;
				else if(nPixel>255)
					nPixel=255;
				outputData[i]=nPixel;
			}
			outputData[(y*w + x)*4 + 3] = 255; // alpha
		}
	}
}
*/
function do_matrix(input,output,m) {

	var data_src=input.data;
	var data_dst=output.data;
	var height=input.height;
	var width=input.width;
	var stride=width*4;
	var stride2=stride*2;

	var index=0;
	var nPixel;
	
	var tl,tm,tr,bl,bm,br;
	for(var y=1;y<height-1;y++) {

		index+=4;
		for(var x=1;x<width-1;x++) {
			
			tl=index-stride-4;
			tm=tl+4;
			tr=tm+4;
			bl=index+stride-4;
			bm=bl+4;
			br=bm+4;
			nPixel=Math.round(
			(data_src[tl]*m.topLeft+data_src[tm]*m.topMid+data_src[tr]*m.topRight
				+data_src[index-4]*m.midLeft+data_src[index]*m.pixel+data_src[index+4]*m.midRight
				+data_src[bl]*m.bottomLeft+data_src[bm]*m.bottomMid+data_src[br]*m.bottomRight)
			/m.factor)+m.offset;
			if(nPixel<0)
				nPixel=0;
			else if(nPixel>255)
				nPixel=255;

			data_dst[index]=nPixel;

			nPixel=Math.round(
			(data_src[tl+1]*m.topLeft+data_src[tm+1]*m.topMid+data_src[tr+1]*m.topRight
				+data_src[index-3]*m.midLeft+data_src[index+1]*m.pixel+data_src[index+5]*m.midRight
				+data_src[bl+1]*m.bottomLeft+data_src[bm+1]*m.bottomMid+data_src[br+1]*m.bottomRight)
			/m.factor)+m.offset;
			if(nPixel<0)
				nPixel=0;
			else if(nPixel>255)
				nPixel=255;

			data_dst[index+1]=nPixel;

			nPixel=Math.round(
			(data_src[tl+2]*m.topLeft+data_src[tm+2]*m.topMid+data_src[tr+2]*m.topRight
				+data_src[index-2]*m.midLeft+data_src[index+2]*m.pixel+data_src[index+6]*m.midRight
				+data_src[bl+2]*m.bottomLeft+data_src[bm+2]*m.bottomMid+data_src[br+2]*m.bottomRight)
			/m.factor)+m.offset;
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
