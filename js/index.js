function Ball(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
}
function Padd(x, w, h, img) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.img = img;
}
function Bricks(w, h, r, c, p) {
    this.w = w;
    this.h = h;
    this.r = r; // rows
    this.c = c; // cols
    this.p = p; // padd
    this.objs;
    this.colors=["#FF3333","#33FF33","#FFFF00","#888888","#FF00FF","#0000FF"];
}




$(function(){
	var canvas = document.getElementById('screen');
	var context = canvas.getContext('2d');

	//画接盘
	var paddImg = new Image();
	paddImg.src = "./images/padd.png";
	paddImg.onload = function(){};

	oBall = new Ball(canvas.width / 2, 870, 0.5, -5, 10); // new ball object
    oPadd = new Padd(canvas.width / 2, 120, 20, paddImg); // new padd object
    oBricks = new Bricks(70, 25, 10, 13, 2); // new bricks object
	//画砖块设置标志位
	oBricks.objs = new Array(oBricks.r);
	for (var i = 0; i <oBricks.r; i++) {
		oBricks.objs[i] = new Array(oBricks.c);
		for (var j = 0; j < oBricks.c; j++) {
				oBricks.objs[i][j] = 1;
			};
		
	}}

	//画小球





	aSounds[0] = new Audio('media/snd1.wav');
    aSounds[0].volume = 0.9;
    aSounds[1] = new Audio('media/snd2.wav');
    aSounds[1].volume = 0.9;
    aSounds[2] = new Audio('media/snd3.wav');
    aSounds[2].volume = 0.9;


    var LeftBtn = false;
    var RightBtn = false;

    $(window).keydown(function(event){
    	switch(event.keyCode){
    		case 37:
    		LeftBtn = true;
    		break;
    		case 39:
    		RightBtn = true;
    		break;
    	}
    });

    $(window).keyup(function(event){
    	switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = false;
                break;
            case 39: // 'Right' key
                bRightBut = false;
                break;
        }
    });
	
})



/*function randomcolor(){
	var colors=["#FF3333","#33FF33","#FFFF00","#888888","#FF00FF","#0000FF"];
	var icolor=colors[Math.floor(Math.random()*colors.length)];
	return icolor;
}*/

//清屏
function clear(){
	context.clearRect(0,0,canvas.width,canvas.height);

	context.fillStyle="#111";
	context.fillRect(0,0,canvas.width,canvas.height);
}
//
function draw(){
	clear();

	//画小球
	context.beginPath();
	context.arc(oBall.x,oBall.y,oBall.r,0,Math.PI*2,true);
	context.closePath();
	context.fillStyle = "#f66";
	context.fill();

	//画接盘
	context.drawImage(oPadd.img,oPadd.x,canvas.height-oPadd.h);


	//画砖块
	for (var i = 0; i <oBricks.r; i++) {
		context.fillStyle = oBricks.colors[i];
		for (var j = 0; j < oBricks.c; j++) {
			if (oBricks[i][j]==1) {
				context.beginPath();
				context.fillRect((j * (oBricks.w + oBricks.p)) + oBricks.p, (i * (oBricks.h + oBricks.p)) + oBricks.p, oBricks.w, oBricks.h);
				context.closePath();
			};
		
	}}


	if (LeftBtn) {
		oPadd.x-=5;
	}else if (RightBtn) {
		oPadd.x+=5;
	};


	//当前小球所在行与列
	iRowH = oBricks.h + oBricks.p;
	iBallR = Math.floor(oBall.y / iRowH);
    iBallC = Math.floor(oBall.x / (oBricks.w + oBricks.p)); 


    //碰撞运动
    //球碰到砖块
    if (oBall.y < oBricks.r * iRowH && iRow >= 0 && iCol >=0 && oBricks.objs[iRow][iCol] == 1) {
    	oBricks.objs[iRow][iCol] = 0;
    	oBall.dy = -oBall.dy;
    	iPoint++;

    	aSounds[0].play();
    };

    //球水平方向碰到墙壁
    if (oBall.x + oBall.dx + oBall.r > canvas.width || oBall.x + oBall.dx -oBall.r) {
    	oBall.dx = -oBall.dx;
    };

    //球垂直方向碰到墙壁
    if (oBall.y + oBall.dy - oBall.r < 0) {//上方
    	oBall.dy = -oBall.dy;
    }else if (oBall.y + oBall.dy + oBall.r >canvas.height - oPadd.h) {
    	if (oBall.x > oPadd.x && oBall.x < oPadd.x + oPadd.w) {
    		oBall.dy = -oBall.dy;

    		aSounds[2].play();
    	};
    };;
}