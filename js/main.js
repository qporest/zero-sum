var camera, scene, renderer;
var groups = [];

init();
animate();


function init() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	camera = new THREE.OrthographicCamera( 0, width, height, 0, 1, 100 );
	camera.position.z = 100;

	camera.aspect = 1;

	scene = new THREE.Scene();

	// create sprites

	var amount = 30;
	var radius = 50;

	var textureLoader = new THREE.TextureLoader();

	let spriteMap = textureLoader.load( "textures/4.png");
	let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
	let sprite = new THREE.Sprite( spriteMaterial );

	console.log(spriteMaterial)
	let sprite_width = spriteMaterial.map.image || 256
	let sprite_height = spriteMaterial.map.image || 256
	sprite.center.set(0.5, 0.5)
	console.log(sprite_width, sprite_height)
	sprite.scale.set(sprite_width, sprite_height, 1)
	
	for(let i = 0; i<15; i++){
		let group = new THREE.Group();

		for ( let a = 0; a < amount; a ++ ) {

			var x = a * 150;
			var y = a * 150;
			var z = 0;

			var material;

			if ( z < 0 ) {

				material = spriteMaterial.clone();

			} else {

				material = spriteMaterial.clone();
				material.color.setHSL( 0.5 * Math.random(), 0.75, 0.5 );
				material.map.offset.set( - 0.5, - 0.5 );
				material.map.repeat.set( 2, 2 );

			}

			let sprite = new THREE.Sprite( material );

			sprite.position.set( x, y, z );
			sprite.center.set(0.5, 0.5)
			sprite.scale.set(256, 256)
			group.add( sprite );

		}
		group.position.x = window.innerWidth - i * 300;
		group.position.y = -500
		groups.push(group);
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
    camera.top = 0
    camera.bottom = - height
    camera.updateProjectionMatrix()
	renderer.setSize( width,  height );
}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	var time = Date.now() / 1000;

	for (let i = 0; i<groups.length; i++){
		let group = groups[i]
		let change = -0.50
		if (i%2==0){
			change = 0.50
		}
		groups[i].position.x += change
		groups[i].position.y += change
	}

	renderer.render( scene, camera );

}