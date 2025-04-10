import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import waterNormals from '../../images/waternormals.jpg';
import Mandala from '../../images/Mandala.svg';
// import style from '../../styles/scss/main.module.scss';

const Ocean = () => {
    useEffect(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let frameId;

        const renderElement = document.getElementById('reality');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 55, width / height, 1, 20000 );
        const sun = new THREE.Vector3();
        const sky = new Sky();
        const renderer = new THREE.WebGLRenderer();
        const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
        const geometry = new THREE.BoxGeometry( 30, 30, 30 );
        const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

        const mesh = new THREE.Mesh( geometry, material );
        // scene.add( mesh );

        camera.position.set( 30, 30, 100 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderElement.appendChild( renderer.domElement );

        const water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( waterNormals, function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x308688,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );
        water.rotation.x = - Math.PI / 2;
        scene.add( water );

        sky.scale.setScalar( 10000 );
        scene.add( sky );

        const skyUniforms = sky.material.uniforms;
        skyUniforms[ 'turbidity' ].value = 10;
        skyUniforms[ 'rayleigh' ].value = 2;
        skyUniforms[ 'mieCoefficient' ].value = 0.005;
        skyUniforms[ 'mieDirectionalG' ].value = 0.8;

        const parameters = {
            inclination: 0.49,
            azimuth: 0.205
        };

        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        const updateSun = () => {
            const theta = Math.PI * ( parameters.inclination - 0.5 );
            const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

            sun.x = Math.cos( phi );
            sun.y = Math.sin( phi ) * Math.sin( theta );
            sun.z = Math.sin( phi ) * Math.cos( theta );

            sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
            water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

            scene.environment = pmremGenerator.fromScene( sky ).texture;

        }
        updateSun();

        const loader = new SVGLoader();
        console.log(Mandala);
        loader.load(Mandala, (data) => {
            console.log(data)
        });

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set( 0, 10, 0 );
        controls.minDistance = 40.0;
        controls.maxDistance = 200.0;

        const onWindowResize = () => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize( width, height );
        }

        const render = () => {
            const time = performance.now() * 0.001;
            mesh.position.y = Math.sin( time ) * 20 + 5;
            mesh.rotation.x = time * 0.5;
            mesh.rotation.z = time * 0.51;
            water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
            renderer.render( scene, camera );
        }

        const animate = () => {
            frameId = window.requestAnimationFrame(animate);
            render();
        }

        const start = () => {
            if (!frameId) {
                frameId = requestAnimationFrame(animate)
            }
        }

        const stop = () => {
            cancelAnimationFrame(frameId)
            frameId = null
        }

        window.addEventListener( 'resize', onWindowResize );
        start();

        return () => {
            stop()
            window.removeEventListener('resize', onWindowResize)
            renderElement.removeChild(renderer.domElement)

            // scene.remove(cube)
            // geometry.dispose()
            // material.dispose()
        }
    },[]);

    return (
        <>
            <div id={'reality'} className={'style.reality'} />
        </>
    )
}

export default Ocean;
