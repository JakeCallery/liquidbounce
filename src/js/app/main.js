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
	var bp = game.createGameObj(GameObjTypes.BLOB_PART, {x:20,y:45});
	L.log('BP (should now be 20,45): ' + bp.x + '/' + bp.y);
	bp.destroy();
	L.log('BP (should now be -1,-1): ' + bp.x + ' / ' + bp.y);
});
