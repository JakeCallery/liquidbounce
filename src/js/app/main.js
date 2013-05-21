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
'app/game/GameObjTypes'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils, Game, GameObjTypes){
    L.addLogTarget(new ConsoleTarget());
    L.log('New Main!');

	var game = new Game();
	game.init();
	var bp = game.createGameObj(GameObjTypes.BLOB_PART, {x:0,y:0});
	game.removeGameObj(bp);
});
