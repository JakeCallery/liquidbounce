/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

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
'jac/math/Vec2DObj'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils, Game,
         GameObjTypes, RenderEngine, BlobRenderSource, EventUtils, InfluenceObject,
		 Vec2DObj){

	L.addLogTarget(new ConsoleTarget());
    L.log('New Main!');

	var mainCanvas = document.getElementById('gameCanvas');
	var game = new Game(document, window, mainCanvas, 600, 600);
	game.init();

	var testBlobSrc = new BlobRenderSource(30,30,'#0000FF');
	var testBlobConfig = {};
	testBlobConfig.x = 50;
	testBlobConfig.y = 50;

	var bp = game.createGameObj(GameObjTypes.BLOB_PART, testBlobConfig, testBlobSrc);
	//bp.destroy();

	//var infObj = new InfluenceObject(new Vec2DObj(0,0.5),InfluenceObject.NO_DECAY,InfluenceObject.INFINITE_LIFETIME,'testPush');
	var infObj = new InfluenceObject(new Vec2DObj(0,0.5),InfluenceObject.NO_DECAY,20,'testPush');
	//var infObj = new InfluenceObject(new Vec2DObj(0,0.3),0.01,InfluenceObject.INFINITE_LIFETIME,'testPush');
	bp.influenceList.addInfluence(infObj);

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
	//game.startGame();
});
