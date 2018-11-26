window.onload=function(){
	window.p1=document.getElementById("paddle1");
	window.p2=document.getElementById("paddle2");
	window.p1vel=0;
	window.p2vel=0;
	window.down={87:false,83:false,38:false,40:false};
	window.ballv=[];
	window.ball=document.getElementById("ball");
	p1move();
	p2move();
	ballInit();
	doBallStuff();
}
window.onkeydown=function(e){
	// w=87
	// s=83
	// up=38
	// down=40
	window.down[e.keyCode]=true;
	if (e.keyCode==87){
		window.p1vel=-1;
	} else if (e.keyCode==83){
		window.p1vel=1;
	} else if (e.keyCode==38){
		window.p2vel=-1;
	} else if (e.keyCode==40){
		window.p2vel=1;
	}
}
window.onkeyup=function(e){
	window.down[e.keyCode]=false;
	if (e.keyCode==87){
		window.p1vel=(window.down[83]?1:0);
	} else if (e.keyCode==83){
		window.p1vel=(window.down[87]?-1:0);
	} else if (e.keyCode==38){
		window.p2vel=(window.down[40]?1:0);
	} else if (e.keyCode==40){
		window.p2vel=(window.down[38]?-1:0);
	}
}
function p1move(){
	var top=parseInt(p1.style.top)+window.p1vel*3;
	var rect=p1.getBoundingClientRect();
	top=Math.max(top,0);
	top=Math.min(window.innerHeight-rect.height,top);
	p1.style.top=top+"px";
	requestAnimationFrame(p1move);
}
function p2move(){
	var top=parseInt(p2.style.top)+window.p2vel*3;
	var rect=p2.getBoundingClientRect();
	top=Math.max(top,0);
	top=Math.min(window.innerHeight-rect.height,top);
	p2.style.top=top+"px";
	requestAnimationFrame(p2move);
}
function ballInit(){
	window.ball.style.left=window.innerWidth/2+"px";
	window.ball.style.top=window.innerHeight/2+"px";
	var genv=function(){return (Math.random()>0.5?-1:1)*Math.ceil(Math.random()*3+2);}
	window.ballv=[genv(),genv()];
}
function doBallStuff(){
	var ballRect=window.ball.getBoundingClientRect();
	var p1Rect=window.p1.getBoundingClientRect();
	var p2Rect=window.p2.getBoundingClientRect();
	if (!(p1Rect.right<ballRect.left||p1Rect.left>ballRect.right||p1Rect.bottom<ballRect.top||p1Rect.top>ballRect.bottom)){ballv[0]*=-1;}
	if (!(p2Rect.right<ballRect.left||p2Rect.left>ballRect.right||p2Rect.bottom<ballRect.top||p2Rect.top>ballRect.bottom)){ballv[0]*=-1;}
	var left=parseFloat(window.ball.style.left)+window.ballv[0];
	var leftpre=left;
	left=Math.min(window.innerWidth-ballRect.width,left);
	left=Math.max(left,0);
	if (leftpre!=left){
		ballInit();
	} else {
		window.ball.style.left=left+"px";
		var top=parseFloat(window.ball.style.top)+window.ballv[1];
		var toppre=top;
		top=Math.min(window.innerHeight-ballRect.height,top);
		top=Math.max(top,0);
		if (toppre!=top){ballv[1]*=-1}
		window.ball.style.top=top+"px";
	}
	requestAnimationFrame(doBallStuff);
}