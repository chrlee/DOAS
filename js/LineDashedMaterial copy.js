

			if ( WEBGL.isWebGLAvailable() === false ) {

				document.body.appendChild( WEBGL.getWebGLErrorMessage() );

			}

			var renderer, scene, camera, stats;

			var particles;

			var PARTICLE_SIZE = 20;

			var raycaster, intersects;
			var mouse, INTERSECTED;

			init();
			animate();

			function init() {

				var container = document.getElementById( 'container' );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 250;

				//

				var vertices = new THREE.BoxGeometry( 200, 200, 200, 16, 16, 16 ).vertices;

				var positions = new Float32Array( vertices.length * 3 );
				var colors = new Float32Array( vertices.length * 3 );
				var sizes = new Float32Array( vertices.length );

				var vertex;
				var color = new THREE.Color();

				for ( var i = 0, l = vertices.length; i < l; i ++ ) {

					vertex = vertices[ i ];
					vertex.toArray( positions, i * 3 );

					color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
					color.toArray( colors, i * 3 );

					sizes[ i ] = PARTICLE_SIZE * 0.5;

				}

				var geometry = new THREE.BufferGeometry();
				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
				geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

				//

				var material = new THREE.ShaderMaterial( {

					uniforms: {
						color: { value: new THREE.Color( 0xffffff ) },
						texture: { value: new THREE.TextureLoader().load( "textures/sprites/disc.png" ) }
					},
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

					alphaTest: 0.9

				} );

				//

				particles = new THREE.Points( geometry, material );
				scene.add( particles );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//

				raycaster = new THREE.Raycaster();
				mouse = new THREE.Vector2();

				//

				stats = new Stats();
				container.appendChild( stats.dom );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

			}

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				particles.rotation.x += 0.0005;
				particles.rotation.y += 0.001;

				var geometry = particles.geometry;
				var attributes = geometry.attributes;

				raycaster.setFromCamera( mouse, camera );

				intersects = raycaster.intersectObject( particles );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].index ) {

						attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

						INTERSECTED = intersects[ 0 ].index;

						attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.25;
						attributes.size.needsUpdate = true;

					}

				} else if ( INTERSECTED !== null ) {

					attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
					attributes.size.needsUpdate = true;
					INTERSECTED = null;

				}

				renderer.render( scene, camera );

			}

		