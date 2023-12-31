/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */


//TODO: NEXT
//Update field placement and size based on finger position
//Rework creating and adding objects, don't do it in the 'game', create an object and ask the game to add it.

//TODO: PERFORMANCE
//pool influence objects

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'json2',
'jac/polyfills/RequestAnimationFrame',
'jac/utils/BrowserUtils',
'app/game/Game',
'app/game/GameObjTypes',
'app/renderEngine/RenderEngine',
'app/parts/blob/BlobRenderSource',
'jac/utils/EventUtils',
'app/physicsEngine/InfluenceObject',
'jac/math/Vec2DObj',
'app/parts/dispenser/BaseDispenser',
'app/parts/dispenser/TestDispenserRenderSource',
'app/parts/deflector/BaseDeflector',
'app/parts/deflector/TestDeflectorRenderSource',
'app/parts/deflector/TestDeflector',
'app/parts/field/BaseField',
'app/parts/field/TestFieldRenderSource',
'app/parts/field/Polarity'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils, Game,
         GameObjTypes, RenderEngine, BlobRenderSource, EventUtils, InfluenceObject,
		 Vec2DObj,BaseDispenser,TestDispenserRenderSource, BaseDeflector, TestDeflectorRenderSource,
		 TestDeflector,BaseField,TestFieldRenderSource,Polarity){

	L.addLogTarget(new ConsoleTarget());
    L.log('New Main!','@main');
	L.isEnabled = false;
	L.isTagFilterEnabled = true;
	L.isShowingUnTagged = false;
	L.addTag('@main');
//	L.addTag('@deflector');
//	L.addTag('@collision');
//	L.addTag('@render');
	L.addTag('@input');
	L.addTag('@leap');
	L.addTag('@play');
	L.addTag('@tmp');
	//L.addTag('@finger');
	//L.addTag('@influence');
	//L.addTag('@dispenser');


	var mainCanvas = document.getElementById('gameCanvas');
	var game = new Game(document, window, mainCanvas, mainCanvas.width, mainCanvas.height, true);
	game.init();

	//// set up test dispenser ////
	var testDispenserSrc = new TestDispenserRenderSource(60,60,'#00FF00');
	testDispenserSrc.init();

	var testDispenser = new BaseDispenser(game, 20,20,testDispenserSrc,1);
	game.addGameObject(testDispenser);

	//// set up test deflectors ////
	var testDeflectorSrc = new TestDeflectorRenderSource(80,20, '#0000FF');
	testDeflectorSrc.init();

	var testDeflector = new TestDeflector(150, 200, testDeflectorSrc);
	testDeflector.setRotation(10);
	game.addGameObject(testDeflector);

	var testDeflector2 = new TestDeflector(470, 300, testDeflectorSrc);
	game.addGameObject(testDeflector2);
	testDeflector2.setRotation(-30);

	///////////////////////////////////////////////////////////////////////////////
	var stepButtonEl = document.getElementById('stepButton');
	EventUtils.addDomListener(stepButtonEl, 'click', function(e){
		game.update(true);
	});

	var startButtonEl = document.getElementById('startButton');
	EventUtils.addDomListener(startButtonEl, 'click', function(e){
		game.startGame();
	});

	var stopButtonEl = document.getElementById('stopButton');
	EventUtils.addDomListener(stopButtonEl, 'click', function(e){
		game.pauseGame();
	});

	var clearButtonEl = document.getElementById('clearButton');
	EventUtils.addDomListener(clearButtonEl, 'click', function(e){
		bp.destroy();
	});

	//auto start game
	game.startGame();
	game.pauseGame();
});
