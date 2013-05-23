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
'app/renderEngine/RenderEngine'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils, Game, GameObjTypes, RenderEngine){
    L.addLogTarget(new ConsoleTarget());
    L.log('New Main!');

	var mainCanvas = document.getElementById('gameCanvasDiv');
	var game = new Game(mainCanvas, 600, 600);
	game.init();

	var testBlobSrc = new BlobRenderSource(30,30,'#0000FF');
	var testBlobConfig = {};
	testBlobConfig.x = 50;
	testBlobConfig.y = 50;
	testBlobConfig.width = testBlobSrc.width;
	testBlobConfig.height = testBlobSrc.height;
	testBlobConfig.renderSrc = testBlobSrc.srcContext;

	var bp = game.createGameObj(GameObjTypes.BLOB_PART, testBlobConfig);
	//bp.destroy();
});
