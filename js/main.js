var camera, scene, renderer, rowN, spriteN
var groups = [];

var RATIO_PER_100 = 0.4, SPRITE_HEIGHT = 80, SPRITE_WIDTH = 80, SPRITE_SPACING = 40

class Row {
	static get DIRECTION_UP(){
		return 1
	}
	static get DIRECTION_DOWN(){
		return -1
	}
	CHANGE=1

	constructor(dir, group){
		this.direction = dir || Row.DIRECTION_UP
		this.group = group
	}

	reverse(){
		this.direction *= -1
	}

	update(){
		this.group.position.x += this.direction * this.CHANGE
		this.group.position.y += this.direction * this.CHANGE 
		if(this.group.position.y > window.innerHeight + SPRITE_HEIGHT || this.group.position.y + (spriteN) * (SPRITE_HEIGHT + SPRITE_SPACING) < 0 ){
			this.reverse()
		}
	}
}

init();
animate();




function getRowsN(width, height){
	return Math.floor(RATIO_PER_100 * (width + height) / 100) + 1;
}

function getSpriteN(width, height){
	return Math.floor(1.5 * (width + height) / (SPRITE_HEIGHT + SPRITE_SPACING)) + 1
}

function init() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	rowN = getRowsN(width, height);


	camera = new THREE.OrthographicCamera( 0, width, height, 0, 1, 100 );
	camera.position.z = 100;

	camera.aspect = 1;

	scene = new THREE.Scene();

	// create sprites

	spriteN = getSpriteN(width, height);

	var textureLoader = new THREE.TextureLoader();

	let spriteMap = textureLoader.load( "textures/4.png");
	let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
	let sprite = new THREE.Sprite( spriteMaterial );

	console.log(spriteMaterial)
	let sprite_width = SPRITE_WIDTH
	let sprite_height = SPRITE_HEIGHT
	sprite.center.set(0.5, 0.5)
	console.log(sprite_width, sprite_height)
	sprite.scale.set(sprite_width, sprite_height, 1)
	
	for(let i = 0; i<rowN; i++){
		let group = new THREE.Group();

		for ( let a = 0; a < spriteN; a ++ ) {

			var x = a * (SPRITE_HEIGHT + SPRITE_SPACING);
			var y = a * (SPRITE_HEIGHT + SPRITE_SPACING);
			var z = 0;

			var material;

			if ( z < 0 ) {

				material = spriteMaterial.clone();

			} else {

				material = spriteMaterial.clone();
				material.color.setHSL( 0.7*Math.random(), 0.7 * Math.random(), 0.7 * Math.random() );
				material.map.offset.set( - 0.5, - 0.5 );
				material.map.repeat.set( 2, 2 );

			}

			let sprite = new THREE.Sprite( material );

			sprite.position.set( x, y, z );
			sprite.center.set(0.5, 0.5)
			sprite.scale.set(256, 256)
			group.add( sprite );

		}
		group.position.x =  - height + i * Math.floor(100 / RATIO_PER_100);
		group.position.y = 0
		
		var row	
		if(i % 2 == 0){
			group.position.x -= (spriteN - 1) * (SPRITE_HEIGHT + SPRITE_SPACING)
			group.position.y -= (spriteN - 1) * (SPRITE_HEIGHT + SPRITE_SPACING)
			row = new Row(Row.DIRECTION_UP, group)
		} else {
			group.position.x += height
			group.position.y += height
			row = new Row(Row.DIRECTION_DOWN, group)
		}
		groups.push(row);
		scene.add( group );
	}

	// renderer

	renderer = new THREE.WebGLRenderer({
		alpha: true
	});
	// renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = true; // To allow render overlay on top of sprited sphere

	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera.left = 0
    camera.right = width
    camera.top = height
    camera.bottom = 0
    camera.updateProjectionMatrix()
	renderer.setSize( width,  height );
	updateRows(width, height);
}

function updateRows(width, height){
	let newN = getRowsN(width, height)
	if( newN > rowN ){
		for(let i=0; i<newN-rowN; i++){

		}
	}
}


function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	var time = Date.now() / 1000;

	for (let i = 0; i<groups.length; i++){
		let group = groups[i]
		group.update()
	}

	renderer.render( scene, camera );

}