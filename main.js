window.onload=function(){
	game={
		// Held keys
		down:{87:false, 83:false, 38:false, 40:false},
		// Paddles
		p1:document.getElementById("paddle1"),
		p2:document.getElementById("paddle2"),
		// Movement speeds of each paddle (1=down, -1=up, 0=stop)
		p1vel:0,
		p2vel:0,
		speed:5, // Pixels per frame (p1.style.top+=p1vel*speed;)
		// The ball
		ball:document.getElementById("ball"),
		ballv:[0,0], // Velocities
		mag:0,
		bounce:true,
		// Points
		winscore:10,
		points:[0, 0],
		finished:false
	}
	game.p1.style.top=window.innerHeight/8*3+"px"; // TODO: Prove that this is in the center exactly
	game.p2.style.top=window.innerHeight/8*3+"px";
	// Function stuff
	p1move();
	p2move();
	ballInit();
	doBallStuff();
}
window.onresize=function(){
	alert("Please don't resize the screen.\nIt's very buggy at the moment.");
}
window.onkeydown=function(e){
	// w=87
	// s=83
	// up=38
	// down=40
	game.down[e.keyCode]=true;
	if (e.keyCode==87){
		game.p1vel=-1;
	} else if (e.keyCode==83){
		game.p1vel=1;
	} else if (e.keyCode==38){
		game.p2vel=-1;
	} else if (e.keyCode==40){
		game.p2vel=1;
	}
}
window.onkeyup=function(e){
	game.down[e.keyCode]=false;
	if (e.keyCode==87){
		game.p1vel=(game.down[83]?1:0);
	} else if (e.keyCode==83){
		game.p1vel=(game.down[87]?-1:0);
	} else if (e.keyCode==38){
		game.p2vel=(game.down[40]?1:0);
	} else if (e.keyCode==40){
		game.p2vel=(game.down[38]?-1:0);
	}
}
function p1move(){
	var rect=game.p1.getBoundingClientRect();
	// Get new distance from top
	var top=parseInt(game.p1.style.top)+game.p1vel*game.speed;
	top=Math.max(top,0);
	top=Math.min(window.innerHeight-rect.height,top);
	game.p1.style.top=top+"px";
	
	requestAnimationFrame(p1move);
}
function p2move(){
	var rect=game.p2.getBoundingClientRect();
	// Get new distance from top
	var top=parseInt(game.p2.style.top)+game.p2vel*game.speed;
	top=Math.max(top,0);
	top=Math.min(window.innerHeight-rect.height,top);
	game.p2.style.top=top+"px";
	
	requestAnimationFrame(p2move);
}
function ballInit(){
	// var genv=function(){return (Math.random()>0.5?-1:1)*Math.ceil(Math.random()*3+2);}
	var genv=function(){return [-5, -4, -3, 3, 4, 5][Math.floor(Math.random()*6)];} // Velocity generator function (Equivalent to above)
	// Put ball in the center of the screen
	game.ball.style.left=window.innerWidth/2+"px";
	game.ball.style.top=window.innerHeight/2+"px";
	// Randomly generate the velocity of the ball
	game.ballv=[genv(), genv()];
	game.mag=Math.sqrt(game.ballv[0]**2+game.ballv[1]**2);
}
function doBallStuff(){
	var ballRect=game.ball.getBoundingClientRect();
	var p1Rect=game.p1.getBoundingClientRect();
	var p2Rect=game.p2.getBoundingClientRect();
	var left, leftpre, top, toppre;
	if ( // https://stackoverflow.com/a/12067046
		(!(p1Rect.right<ballRect.left||p1Rect.left>ballRect.right||p1Rect.bottom<ballRect.top||p1Rect.top>ballRect.bottom)
		|| !(p2Rect.right<ballRect.left||p2Rect.left>ballRect.right||p2Rect.bottom<ballRect.top||p2Rect.top>ballRect.bottom))
		&& game.bounce
	){
		// The game.bounce shenanigans stop the ball from jittering when it hits a paddle from the side
		game.bounce=false;
		
		game.ballv[0]*=-1
		// TODO: Replace the above with a fixed version of the below.
		/*var ballhmid=(ballRect.top+ballRect.bottom)/2
		if (ballRect.left<window.innerWidth/2){
			var padhmid=(p1Rect.top+p1Rect.bottom)/2;
			var angle=Math.atan2(ballhmid-padhmid, ballRect.left-p1Rect.left)/6
			console.log(1, angle, game.mag)
			game.ballv=[Math.cos(angle*game.mag), Math.sin(angle)*game.mag]
		} else {
			var padhmid=(p2Rect.top+p2Rect.bottom)/2;
			var angle=Math.atan2(ballhmid-padhmid, ballRect.right-p2Rect.right)/6
			console.log(2, angle, game.mag)
			game.ballv=[Math.cos(angle)*game.mag, Math.sin(angle)*game.mag]
		}*/
		
		setTimeout(function(){game.bounce=true;}, 2500);
	}
	// Calculate new distance from the left
	left=parseFloat(game.ball.style.left)+game.ballv[0]; // New distance
	leftpre=left; // Old distance
	left=Math.min(window.innerWidth-ballRect.width, left);
	left=Math.max(left,0);
	if (leftpre!=left){ // Point scored
		// This code only activates when the ball would've gone off-screen (i.e: When a point is scored)
		game.points[left==0?1:0]++;
		updatePoints();
		ballInit();
	} else {
		game.ball.style.left=left+"px";
		// Calculate new distance from top
		top=parseFloat(game.ball.style.top)+game.ballv[1]; // New distance
		toppre=top; // Old distance
		top=Math.min(window.innerHeight-ballRect.height,top);
		top=Math.max(top,0);
		
		if (toppre!=top){game.ballv[1]*=-1}
		game.ball.style.top=top+"px";
	}
	if (!game.finished){requestAnimationFrame(doBallStuff);}
}
function updatePoints(){
	var score1=document.getElementById("score1");
	var score2=document.getElementById("score2");
	score1.innerHTML=game.points[0];
	score2.innerHTML=game.points[1];
	if (game.points.indexOf(game.winscore)!=-1){ // Has either player reached the winning score?
		game.finished=true;
		document.getElementById("winner").innerHTML="Player "+(game.points.indexOf(game.winscore)+1)+" wins!";
	}
}
