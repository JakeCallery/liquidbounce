/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */


//TODO: NEXT
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
'app/parts/deflector/TestDeflector'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils, Game,
         GameObjTypes, RenderEngine, BlobRenderSource, EventUtils, InfluenceObject,
		 Vec2DObj,BaseDispenser,TestDispenserRenderSource, BaseDeflector, TestDeflectorRenderSource,
		 TestDeflector){

	L.addLogTarget(new ConsoleTarget());
    L.log('New Main!','@main');
	L.isEnabled = true;
	L.isTagFilterEnabled = true;
	L.isShowingUnTagged = false;
	L.addTag('@main');
	L.addTag('@deflector');
	L.addTag('@collision');
	//L.addTag('@influence');
	//L.addTag('@dispenser');


	var mainCanvas = document.getElementById('gameCanvas');
	var game = new Game(document, window, mainCanvas, 600, 600);
	game.init();

	//TMP///////////
	//Set up blob
	/*
	var testBlobSrc = new BlobRenderSource(30,30,'#0000FF');
	var testBlobConfig = {};
	testBlobConfig.x = 50;
	testBlobConfig.y = 50;

	var bp = game.createGameObj(GameObjTypes.BLOB_PART, testBlobConfig, testBlobSrc);

	var infObj = new InfluenceObject(new Vec2DObj(0,0.5),InfluenceObject.NO_DECAY,InfluenceObject.INFINITE_LIFETIME,'testPush');
	//var infObj = new InfluenceObject(new Vec2DObj(0,0.5),InfluenceObject.NO_DECAY,10,'testPush');
	//var infObj = new InfluenceObject(new Vec2DObj(0,0.3),0.01,InfluenceObject.INFINITE_LIFETIME,'testPush');
	bp.influenceList.addInfluence(infObj);
	*/

	//set up test dispenser
	var testDispenserSrc = new TestDispenserRenderSource(60,60,'#00FF00');
	testDispenserSrc.init();
	var testDispenser = new BaseDispenser(game, 20,250,testDispenserSrc,60);
	game.addGameObject(testDispenser);

	//set up test deflector
	var testDeflectorSrc = new TestDeflectorRenderSource(80,20, '#0000FF');
	testDeflectorSrc.init();
	var testDeflector = new TestDeflector(175, 450, testDeflectorSrc);
	game.addGameObject(testDeflector);

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
