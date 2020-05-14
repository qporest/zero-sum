var camera, scene, renderer, rowN, spriteN, spriteMaterial
var groups = []

var composer, renderPass, glitchPass
var plane

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
		this.first = this.getFirst()
	}
	/* Gets the first element to get out of bounds - depending on direction 
		For up we want the highest: el2 - el1
		For down we want the lowest: el1 - el2
		
	*/
	getFirst(){
		return this.group.children.sort((c1, c2) => this.direction * -1 * c1.position.x - this.direction * -1 * c2.position.x)[0]
	}

	/* Gets the last element in the moving row.
		For up we want the lowest: el1 - el2
		For down we want highest: el2 - el1
	*/
	getLast(){
		return this.group.children.sort((c1, c2) => this.direction * c1.position.x - this.direction * c2.position.x)[0]
	}

	reverse(){
		this.direction *= -1
	}

	update(){
		this.group.position.x += this.direction * this.CHANGE
		this.group.position.y += this.direction * this.CHANGE 
		// if(this.group.position.y > window.innerHeight + SPRITE_HEIGHT || this.group.position.y + (spriteN) * (SPRITE_HEIGHT + SPRITE_SPACING) < 0 ){
		// 	this.reverse()
		// }
		if(this.direction == Row.DIRECTION_UP && 
			this.first.position.y + this.group.position.y > window.innerHeight + SPRITE_HEIGHT
		){
			this.group.remove(this.first)
			let last = this.getLast()
			let newC = getSpriteCopy()
			newC.position.set(last.position.x - (SPRITE_HEIGHT + SPRITE_SPACING), 
							  last.position.y - (SPRITE_HEIGHT + SPRITE_SPACING),
							  last.position.z)
			console.log("Became", this.group.children.length, newC.position.x + this.group.position.x, newC.position.y + this.group.position.y, newC.position.z)
			this.group.add(newC)
			this.first = this.getFirst()
		} else 
		if (this.direction == Row.DIRECTION_DOWN &&
			this.first.position.y + this.group.position.y <  - SPRITE_HEIGHT
		){
			console.log("Adding element going down")
			this.group.remove(this.first)

			let last = this.getLast()
			let newC = getSpriteCopy()
			
			newC.position.set(last.position.x + (SPRITE_HEIGHT + SPRITE_SPACING), 
								last.position.y + (SPRITE_HEIGHT + SPRITE_SPACING),
								last.position.z)

			this.group.add(newC)
			this.first = this.getFirst()
		}
	}
}

function getSpriteCopy(){
	let material = spriteMaterial.clone()
	material.color.setHSL( 0.5*Math.random()+0.3, 0.5 * Math.random() + 0.3, 0.5 * Math.random() + 0.3)
	material.map.offset.set( - 0.5, - 0.5 )
	material.map.repeat.set( 2, 2 )


	let sprite = new THREE.Sprite( material )

	sprite.center.set(0.5, 0.5)
	sprite.scale.set(256, 256)
	sprite.fog = true
	return sprite
}

function getRowsN(width, height){
	return Math.floor(RATIO_PER_100 * (width + height) / 100) + 1
}

function getSpriteN(width, height){
	return Math.floor(1.5 * (width + height) / (SPRITE_HEIGHT + SPRITE_SPACING)) + 1
}

function init() {

	var width = window.innerWidth
	var height = window.innerHeight

	rowN = getRowsN(width, height)


	camera = new THREE.OrthographicCamera( 0, width, height, 0, 1, 110 )
	camera.position.z = 100

	camera.aspect = 1

	scene = new THREE.Scene()

	object = new THREE.Object3D();
	scene.add(object)
	// scene.fog = new THREE.Fog( 0x000000, 1, 110 );
	scene.background = new THREE.Color( 0xffffff );
	// create sprites

	spriteN = getSpriteN(width, height)

	var textureLoader = new THREE.TextureLoader()

	let spriteMap = textureLoader.load( "/textures/4.png")
	spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } )
	spriteMaterial.depthTest = false

	let sprite = new THREE.Sprite( spriteMaterial )

	let sprite_width = SPRITE_WIDTH
	let sprite_height = SPRITE_HEIGHT
	sprite.center.set(0.5, 0.5)
	sprite.scale.set(sprite_width, sprite_height, 1)
	
	for(let i = 0; i<rowN; i++){
		let group = new THREE.Group()

		for ( let a = 0; a < spriteN; a ++ ) {

			var x = a * (SPRITE_HEIGHT + SPRITE_SPACING)
			var y = a * (SPRITE_HEIGHT + SPRITE_SPACING)
			var z = 0

			var material

			let sprite = getSpriteCopy()

			sprite.position.set( x, y, z )
			
			group.add( sprite )

		}
		group.position.x =  - height + i * Math.floor(100 / RATIO_PER_100)
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
		groups.push(row)
		scene.add( group )
	}

	var geometry = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffff00, flatShading: true } );
	plane = new THREE.Mesh( geometry, material );
	plane.material.side = THREE.DoubleSide;
	plane.position.set(0, 0, 10)
	plane.lookAt(0, 0, 100)
	// object.add( plane ); 

	let light = new THREE.AmbientLight( 0xffffff )
	light.position.set(0, 0, 10)
	scene.add( light );

	// renderer

	renderer = new THREE.WebGLRenderer()
	// renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )

	renderer.autoClear = true // To allow render overlay on top of sprited sphere



	
	
	composer = new THREE.EffectComposer( renderer );
	composer.setSize( window.innerWidth, window.innerHeight )
	
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	glitchPass = new THREE.GlitchPass();
	glitchPass.renderToScreen = true;
	composer.addPass( glitchPass );

	
	

 // 	renderPass = new THREE.RenderPass(scene, camera)
	// // renderPass.clear = false
	// glitchPass = new THREE.GlitchPass()
	// glitchPass.renderToScreen = true
	
	
	// composer.addPass(renderPass)
	// composer.addPass(glitchPass)

	document.body.appendChild( renderer.domElement )
	window.addEventListener( 'resize', onWindowResize, false )

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
	composer.setSize( width,  height )
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

function render(dt) {

	var time = Date.now() / 1000;

	for (let i = 0; i<groups.length; i++){
		let group = groups[i]
		group.update()
	}

	composer.render(dt)
	// renderer.render(scene, camera)

}


init();
animate();