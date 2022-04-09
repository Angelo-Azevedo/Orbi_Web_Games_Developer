const game_state = ['PLAYING','DONE','drawING','GAME_OVER'];
const canvas =  document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const green_sound = new sound('./sound/1.mp3');
const red_sound = new sound('./sound/2.mp3');
const blue_sound = new sound('./sound/3.mp3');
const yellow_sound = new sound('./sound/4.mp3');
let x = canvas.width /2;
let y = canvas.height / 2;
let score = 0;
let current_state = game_state[1];
let red = 'red';
let blue = 'blue';
let yellow = 'yellow';
let green = 'green';
let r2;
let r3;
let seq_color = [];
let level;
let ind;

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
	  this.sound.play();
	}
	this.stop = function(){
	  this.sound.pause();
	}
  }

function animate_sequence(i){
	if (i === 0){ //change red
		red = '#ff9999';
		red_sound.play();
	}else if (i === 1){ //change green
		green = '#c6ecc6';
		green_sound.play();
	}else if (i === 2){ //change blue
		blue = '#99ccff';
		blue_sound.play();
	}else if (i === 3){ //change yellow
		yellow = '#e6ff99';
		yellow_sound.play();
	}
	draw();
	red = 'red';
	green = 'green';
	blue = 'blue';
	yellow = 'yellow';
}

function game_over(){
	ctx.fillStyle = '#99ccff';
	ctx.rect(0, y - window.innerHeight * 0.2, window.innerWidth, window.innerHeight * 0.4);
	ctx.fill();

	ctx.font = window.innerHeight * 0.2+'px Courier New';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.fillText('GAME OVER', x, y)

	ctx.font = window.innerHeight * 0.1+'px Courier New';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.fillText('Pontos: '+score, x, y + window.innerHeight * 0.1);
	
}

function draw(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	x = canvas.width /2;
	y = canvas.height / 2;
	const r1 = Math.min(x, y) - 0.1 * Math.min(x, y);
	r2 = r1 - r1 * 0.1;
	r3 = r2 - r2 * 0.7;

	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.arc(x, y, r1, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = red;
	ctx.arc(x, y, r2, Math.PI, Math.PI * 1.5);
	ctx.moveTo(x, y);
	ctx.lineTo(x-r2, y);
	ctx.lineTo(x, y-r2);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = green;
	ctx.arc(x, y, r2, Math.PI * 1.5, 0);
	ctx.moveTo(x, y);
	ctx.lineTo(x+r2, y);
	ctx.lineTo(x, y-r2);
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = blue;
	ctx.arc(x, y, r2, Math.PI * 0.5, Math.PI);
	ctx.moveTo(x, y);
	ctx.lineTo(x-r2, y);
	ctx.lineTo(x, y+r2);
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = yellow;
	ctx.arc(x, y, r2, 0, Math.PI * 0.5);
	ctx.moveTo(x, y);
	ctx.lineTo(x+r2, y);
	ctx.lineTo(x, y+r2);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(x, y, r3, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.font = r3 / 3+'px Courier New';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	if (current_state === game_state[1]){
		ctx.fillText('INICIAR', x, y + r3 / 8); 
	}else{
		ctx.fillText('PONTOS', x, y + r3 / 8); 
		
		ctx.font = r3 / 6+'px Courier New';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText(score, x, y + r3 /2); 
	}
	if (current_state === game_state[3]){
		game_over();
	}
}

function sequence(){
	seq_color = [];
	for (let i = 0; i < level; i++){
		seq_color.push(Math.floor(Math.random() * 4));
	}
}

function is_right(n){
	if (seq_color[ind] === n){
		score+=10;
		ind++;
	}else{
		current_state = game_state[3];
		game_over();
	}
};

async function start(){
	ind = 0;
	current_state = game_state[2];
	draw();
	sequence();
	for (let i = 0; i < seq_color.length; i++){
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(1000);
		animate_sequence(seq_color[i]);
		await delay(1000);
		draw();
	}
	current_state = game_state[0];
}

window.onload = function(){
	level = 1;
	draw();
};

window.addEventListener('resize', function(){
	draw();
});

canvas.addEventListener('click', function(e) {
	m_x = e.pageX;
	m_y = e.pageY;
	
	const dist = Math.pow(m_x - x, 2) + Math.pow(m_y - y, 2);
	
	if (dist <= Math.pow(r3, 2)){ // inner circle
		if (current_state === game_state[1]){
			start();
		}
	}else if (current_state === game_state[0] && dist <=  Math.pow(r2, 2)){ // outer circle
		if (m_x < x && m_y < y){
			animate_sequence(0);
			is_right(0);
		}else if(m_x < x && m_y > y){
			animate_sequence(2);
			is_right(2);
		}else if(m_x > x && m_y < y){
			animate_sequence(1);
			is_right(1);
		}else if(m_x > x && m_y > y){
			animate_sequence(3);
			is_right(3);
		}

		if (seq_color.length === ind){
			level++;
			start();
		}
	}
});
