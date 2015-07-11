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



var canvas,context,oBall,oPadd,oBricks;
var aSounds = [];
var iPoint=iTime=iMin=iSec=ilasttime=ilastpoints=0;
var LeftBtn = false;
var RightBtn = false;
var iStart,iGameTimer = null;
var lasttime,lastpoints,time,points;
$(function(){
	canvas = document.getElementById('screen');
	context = canvas.getContext('2d');

    lasttime = document.getElementById('lasttime');
    lastpoints = document.getElementById('lastpoints');
    time = document.getElementById('time');
    points = document.getElementById('points');
    
    initial();
	
    

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
                LeftBtn = false;
                break;
            case 39: // 'Right' key
                RightBtn = false;
                break;
        }
    });
	

    ilasttime = localStorage.getItem('lasttime');
    ilastpoints = localStorage.getItem('lastpoints');

    
    iGameTimer = setInterval(countTimer,1000);
    iStart = setInterval(draw,10);


    var iCanvX1 = $(canvas).offset().left;
    var iCanvX2 = iCanvX1 + canvas.width;
    $('#screen').mousemove(function(e) { // binding mousemove event
        if (e.pageX > iCanvX1 && e.pageX < iCanvX2) {

            oPadd.x = Math.max(e.pageX - iCanvX1 - (oPadd.w/2), 0);
            oPadd.x = Math.min(canvas.width - oPadd.w, oPadd.x);
        }
        })
   
    
    var restart = document.getElementById('restart');
    var stop = document.getElementById('stop');
    //console.log(stop.innerHTML);
    //stop.innerHTML="kaishi";
    stop.onclick = function(){
        
        if (stop.innerHTML=="暂停") {
            stop.innerHTML="开始";

            clearInterval(iGameTimer);
            clearInterval(iStart);
        }else{
            stop.innerHTML="暂停";
            iGameTimer = setInterval(countTimer,1000);
            iStart = setInterval(draw,10);
        };
    };

    restart.onclick = function(){
        initial();
        iTime = 0;
        iPoint = 0;
        
        stop.innerHTML="暂停";
        clearInterval(iGameTimer);
        clearInterval(iStart);
        iGameTimer = setInterval(countTimer,1000);
        iStart = setInterval(draw,10);
        time.innerHTML = "00 + ':' + 00";
        points.innerHTML = "0";
        lasttime.innerHTML = ilasttime;
        lastpoints.innerHTML = ilastpoints;
    }


    
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


function initial(){
    var paddImg = new Image();
    paddImg.src = "images/padd.png";
    paddImg.onload = function(){};

    oBall = new Ball(canvas.width / 2, 500, 0.5, -3, 10); // new ball object
    oPadd = new Padd(canvas.width / 2 - 60, 120, 20, paddImg); // new padd object
    oBricks = new Bricks(70, 25, 10, 13, 2); // new bricks object
    //画砖块设置标志位
    oBricks.objs = new Array(oBricks.r);
    for (var i = 0; i <oBricks.r; i++) {
        oBricks.objs[i] = new Array(oBricks.c);
        for (var j = 0; j < oBricks.c; j++) {
                oBricks.objs[i][j] = 1;
            };
        
    }

    
    aSounds[0] = new Audio("media/snd1.wav");
    aSounds[0].volume = 0.9;
    aSounds[1] = new Audio("media/snd2.wav");
    aSounds[1].volume = 0.9;
    aSounds[2] = new Audio("media/snd3.wav");
    aSounds[2].volume = 0.9;
}
//
function draw(){
	clear();

	//画小球
    context.fillStyle = "#f66";
	context.beginPath();
	context.arc(oBall.x,oBall.y,oBall.r,0,Math.PI*2,true);
	context.closePath();
	
	context.fill();

	//画接盘
    if (RightBtn) {
        oPadd.x += 5;
    }
    else if (LeftBtn) {
        oPadd.x -= 5;
    };
	context.drawImage(oPadd.img,oPadd.x,canvas.height-oPadd.h);


	//画砖块
	for (var i = 0; i <oBricks.r; i++) {
		context.fillStyle = oBricks.colors[i];
		for (var j = 0; j < oBricks.c; j++) {
			if (oBricks.objs[i][j]==1) {
				context.beginPath();
				context.fillRect((j * (oBricks.w + oBricks.p)) + oBricks.p, (i * (oBricks.h + oBricks.p)) + oBricks.p, oBricks.w, oBricks.h);
				context.closePath();
			};
		
	}}



	//当前小球所在行与列
	iRowH = oBricks.h + oBricks.p;
	iBallR = Math.floor(oBall.y / iRowH);
    iBallC = Math.floor(oBall.x / (oBricks.w + oBricks.p)); 


    //碰撞运动
    //球碰到砖块
    if (oBall.y < oBricks.r * iRowH && iBallR >= 0 && iBallC >=0 && oBricks.objs[iBallR][iBallC] == 1) {
    	oBricks.objs[iBallR][iBallC] = 0;
    	oBall.dy = -oBall.dy;
    	iPoint++;

    	aSounds[0].play();
    };

    //球水平方向碰到墙壁
    if (oBall.x + oBall.dx + oBall.r > canvas.width || oBall.x + oBall.dx -oBall.r <0) {
    	oBall.dx = -oBall.dx;
    };

    //球垂直方向碰到墙壁
    if (oBall.y + oBall.dy - oBall.r < 0) {//上方
    	oBall.dy = -oBall.dy;
    }else if (oBall.y + oBall.dy + oBall.r > canvas.height - oPadd.h) {
    	if (oBall.x > oPadd.x && oBall.x < oPadd.x + oPadd.w) {
    		oBall.dx = 10*((oBall.x-(oPadd.x+oPadd.w/2))/oPadd.w);
            oBall.dy = -oBall.dy;

    		aSounds[2].play();
    	}
        else if (oBall.y + oBall.dy +oBall.r >canvas.height) {//游戏结束
            clearInterval(iStart);
            clearInterval(iGameTimer);

            localStorage.setItem('lasttime',iMin + ':' + iSec);
            localStorage.setItem('lastpoints',iPoint);

            aSounds[1].play();

        };
    };
    oBall.x += oBall.dx;
    oBall.y += oBall.dy;


    iMin = Math.floor(iTime/60);
    iSec = iTime%60;
    if (iMin < 10) iMin = "0" + iMin;
    if (iSec < 10) iSec = "0" + iSec;
    // console.log(iTime);
    // console.log(iMin + ':' + iSec);
    time.innerHTML = iMin + ':' + iSec;
    points.innerHTML = iPoint;
    lasttime.innerHTML = ilasttime;
    lastpoints.innerHTML = ilastpoints;
}

function countTimer(){
    iTime++;
}