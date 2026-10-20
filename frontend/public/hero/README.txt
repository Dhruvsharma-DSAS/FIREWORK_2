FIREWORK CHRONOS - Home hero kit (realistic Earth + sunrise + moving satellite)

Only for the Home page. Explorer / Calendar / other data pages keep the vector globe.

Files
- earth3d.js         three.js scene: day/night Earth shader, city lights, clouds, atmosphere, satellite model
- three.module.js    three.js r160 (MIT)
- RoomEnvironment.js reflection lighting for the satellite (from three.js examples)
- tex/               NASA Blue Marble / Black Marble derived textures (public domain)
- hero_photo_mock.html  the design mock-up used in the atlas (needs the atlas kit.js/atlas.css to run as-is)

Run the mock: serve this folder with any static server (python3 -m http.server) so /earth3d.js and /tex/ resolve.
Open ...?live=1 to animate the satellite on a 24 s loop.
