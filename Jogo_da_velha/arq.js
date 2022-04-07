const player = ['X', 'O'];
const game_state = ['PLAYING','DONE'];
const canvas =  document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const title = 'Jogo da Velha';
const title_font_size = 18;
const title_margin_top = 20;
const margin_top = title_font_size + title_margin_top;
const turn_label = 'Jogador: ';
const label_font_size = 14;
const winner_prhase = ' venceu';
const result_font_size = 22;
const label_button = ['Iniciar', 'Reiniciar'];
const draw = 'DEU VELHA';
let vertices = [];
let f_x;
let square_size;
let mat;
let current_player = 0;
let current_state = game_state[1];
let current_button_label = label_button[0];
let turn = 0;
let btn_init_x;
let btn_init_y;
let btn_width_x;
let btn_height_y;
	
function init_mat(){
	mat = [];
	for (let i = 0; i < 3; i++){
		let line = []
		for (let j = 0; j < 3; j++ )
			line.push(null);
		mat.push(line);
	}
}

function init_vertices(){
	vertices = [];
	let ref;
	let w_size;
	
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	
	if (canvas.width < canvas.height){
		ref = 0.1;
	}else{
		ref = 0.3;
	}
		
	w_size = Math.min(canvas.width, canvas.height)*(1-ref);
	f_x = canvas.width / 2 - w_size / 2;
	square_size = w_size / 3;
	
	vertices.push([f_x + square_size, margin_top]);
	vertices.push([f_x + square_size, 3 * square_size + margin_top]);
	
	vertices.push([f_x + 2 * square_size, margin_top]);
	vertices.push([f_x + 2 * square_size, 3 * square_size + margin_top]);
	
	vertices.push([f_x, square_size + margin_top]);
	vertices.push([f_x + square_size * 3, square_size + margin_top]);
	
	vertices.push([f_x, 2 * square_size + margin_top]);
	vertices.push([f_x + square_size * 3, 2 * square_size + margin_top]);
}

function winner(p){
	ctx.fillStyle = '#1569C7';
	ctx.fillRect(0,  square_size + margin_top - 1, window.innerWidth, square_size + 2);

	ctx.beginPath();
	ctx.moveTo(0, margin_top + square_size - 10);
	ctx.lineTo(canvas.width / 3 ,margin_top + square_size - 10);
	ctx.strokeStyle = '#1569C7';
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.font = result_font_size+'px Courier New';
	ctx.textAlign = 'center';
	if (p === draw){
		ctx.fillText(p, canvas.width  / 2, square_size * 1.5 + margin_top);
	}else{
		ctx.fillText(p+winner_prhase, canvas.width  / 2, square_size * 1.5 + margin_top);
	}
	
	ctx.fillStyle = 'black';
}

function draw_background(){
	ctx.fillStyle = '#1F45Fc';
	ctx.fillRect(0, 0, f_x - 5, canvas.height);
	ctx.fillRect( f_x + 5 + square_size * 3, 0, canvas.width, canvas.height);
}

function mat_full(){
	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 3; j++){
			if (mat[i][j] === null){
				return false;
			}
		}
	}
	return true;
}

function has_winner(){
	const comb = [
		      [[0, 0], [0, 1], [0, 2]], // first row
		      [[1, 0], [1, 1], [1, 2]], // second row
		      [[2, 0], [2, 1], [2, 2]], // third row
		      [[0, 0], [1, 0], [2, 0]], // first column
		      [[0, 1], [1, 1], [2, 1]], // second column
		      [[0, 2], [1, 2], [2, 2]], // third column
		      [[0, 0], [1, 1], [2, 2]], // one diagonal
		      [[0, 2], [1, 1], [2, 0]]  // another diagonal 
		     ];
		     
	for (let i = 0; i < comb.length; i++){
		if (mat[ comb[i][0][0] ][ comb[i][0][1] ] != null && mat[ comb[i][0][0] ][ comb[i][0][1] ] == mat[ comb[i][1][0] ][ comb[i][1][1] ]  && 
								     mat[ comb[i][1][0] ][ comb[i][1][1] ] == mat[ comb[i][2][0] ][ comb[i][2][1]] ){
			current_state = game_state[1];
			winner(mat[ comb[i][0][0] ][ comb[i][0][1] ]);
			return;
		}
	}
	
	if (mat_full()){
		winner(draw);
	}
}

function draw_x(i, j){
	ctx.moveTo((f_x + j * square_size) + (square_size * 0.1), (margin_top +  square_size * i) + (square_size * 0.1));
	ctx.lineTo((f_x + (j + 1) * square_size) - (square_size * 0.1), (margin_top +  square_size * (i + 1)) - (square_size * 0.1));
	
	
	ctx.moveTo((f_x + (j + 1) * square_size) - (square_size * 0.1), (margin_top +  square_size * i) + (square_size * 0.1));
	ctx.lineTo((f_x + j * square_size) + (square_size * 0.1), (margin_top +  square_size * (i + 1)) - (square_size * 0.1));
	
	ctx.stroke();
}

function draw_o(i, j){
	ctx.beginPath();
	ctx.arc(  (f_x + j * square_size) + (square_size / 2), (margin_top +  square_size * i) + (square_size / 2), (square_size / 2) - (square_size * 0.2 ), 0, Math.abs(square_size / 2 - square_size * 0.2) * Math.PI);
	ctx.stroke();
}

function draw_xo(){
	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 3; j++){
			if (mat[i][j] === player[0]){ // X
				draw_x(i, j);
			}else if (mat[i][j] === player[1]){
				draw_o(i, j);
			}
		}
	}
}

function draw_vertices(){
	for (let i = 0;  i < vertices.length; i+=2){
		ctx.moveTo(vertices[i][0], vertices[i][1]);
		ctx.lineTo(vertices[i+1][0], vertices[i+1][1]);
		ctx.stroke();
	}	
}

function clear(){
	ctx.clearRect(0, 0, window.innerWidth , window.innerHeight);
}

function draw_label(){
	ctx.font = title_font_size+'px Courier New ';
	ctx.textAlign = 'center'; 
	ctx.fillText(title, canvas.width / 2, title_margin_top);

	if (current_state == game_state[0]){
		ctx.font = label_font_size+'px Courier New ';
		ctx.fillText(turn_label + player[current_player] , canvas.width / 2 , square_size * 3 + square_size / 2); 	
	}
}

function draw_button(color='black', f_color='green'){
	let m_size = 0;

		
	for (let i = 0; i < label_button.length; i++){
		if (label_button[i].length > m_size){
			m_size = label_button[i].length;
		}
	}
	
	btn_init_x = f_x + square_size * 1.5 -  (m_size * label_font_size + 20) /2;
	btn_init_y = margin_top + 3 * square_size + label_font_size + square_size / 2;
	btn_width_x = m_size * label_font_size + 20;
	btn_height_y = label_font_size * 3;


	ctx.fillStyle = color;
	ctx.fillRect(btn_init_x,  btn_init_y, btn_width_x, btn_height_y);
			 
	ctx.fillStyle = f_color;
	ctx.font = label_font_size+'px Courier New ';
	ctx.fillText(current_button_label, 
			canvas.width / 2, 
			btn_init_y + btn_height_y / 2 + label_font_size / 2 ); 
	ctx.fillStyle = 'black';
}

function repaint(){
	init_vertices();
	draw_label();
	draw_background();
	draw_vertices();
	draw_xo();
	draw_button();
}

function start(){
	turn = 0;
	current_player = 0;
	current_state = game_state[0];
	init_mat();
	clear();
	repaint();
}

window.onload = function(){
	init_mat();
	repaint();
};


window.addEventListener('resize', function(){
	repaint();
	has_winner();
});


canvas.addEventListener('mousemove', function(e){
	let x = e.clientX;
	let y = e.clientY;
		
	if (x >= btn_init_x && x <= btn_width_x + btn_init_x && y >= btn_init_y && y <= btn_init_y + btn_height_y ){
		draw_button('green', 'black');
	}else{
		draw_button('black', 'green');
	}
});

canvas.addEventListener('click', function(e) {
	let x = e.clientX;
	let y = e.clientY;

	if (current_state == game_state[0]){
		let column;
		let row;
		
		if (f_x <= x && x <= f_x + square_size){ // first column
			column = 0;		
		}else if (f_x + square_size <= x && x <= f_x + square_size * 2){ // second column
			column = 1;
		}else if (f_x + square_size * 2 <= x && x <= f_x + square_size * 3){ // second column
			column = 2;
		}else{
			column = null;
		}
		
		if ( margin_top <= y && y <= margin_top + square_size){ // first row
			row = 0;
		}else if (margin_top + square_size <= y && y <= margin_top + square_size * 2){ // second row
			row = 1;
		}else if (margin_top + square_size * 2 <= y && y <= margin_top + square_size * 3){ // third row
			row = 2;
		}else{
			row = null;
		}
		
		
		if (row != null && column != null){
			if (mat[row][column] === null){
				mat[row][column] = player[current_player];
				++turn;
				current_player = turn % 2;
				repaint();
				has_winner();
			}
		}
		
	}
	
	if (x >= btn_init_x && x <= btn_width_x + btn_init_x && y >= btn_init_y && y <= btn_init_y + btn_height_y ){
			if (current_button_label === label_button[0]){ // init game
				current_state = game_state[0];
				current_button_label = label_button[1];
			}else{
				current_button_label = label_button[1];
			}
			start();
	}
});
