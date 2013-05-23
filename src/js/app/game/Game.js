/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/GameObjTypes',
'jac/logger/Logger',
'app/parts/blob/BlobPart',
'jac/pool/Pool',
'jac/utils/EventUtils',
'app/game/events/GameObjEvent',
'app/renderEngine/RenderEngine'],
function(EventDispatcher,ObjUtils, GameObjTypes, L, BlobPart ,Pool, EventUtils, GameObjEvent, RenderEngine){
    return (function(){

	    /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($gameCanvas, $gameWidth, $gameHeight){
            //super
            EventDispatcher.call(this);

	        var self = this;

		    /**@type int*/
		    var blobPartNextIndex = -1;

		    /**@type {Array.<BlobPart>}*/
		    var blobParts = [];

		    var delegateMap = {};

		    var blobPartPool = new Pool(BlobPart);

		    this.renderEngine = new RenderEngine($gameCanvas, $gameWidth, $gameHeight);

		    /**
		     * create and add a blob part to the game
		     * @param {Object} $configObj data object that has key/vals to define the object
		     * @param {BlobRenderSource} $renderSource
		     * returns {BlobPart}
		     */
		    var createAndAddBlobPart = function($configObj, $renderSource){
				var bp = blobPartPool.getObject($configObj, $renderSource);
			    blobParts.push(bp);

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
			    L.log('In Use: ' + blobPartPool.getNumUsed(), '@game');

			    return bp;
		    };

		    var handleGameObjDestroyed = function($e){
			    L.log('Caught Game Obj Destroyed: ' + $e.target, '@game');
			    self.removeGameObj($e.target);
		    };

		    var updateGame = function(){
			    //TODO: update game
			    L.log('Update Game', '@game');

			    var i = 0;
			    var l = 0;
				var obj;

			    //Blob Parts
			    for(i = 0, l = blobParts.length; i < l; i++){
					obj = blobParts[i];
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
			    }

		    };

		    var renderGame = function(){
			    L.log('Render Game', '@game');

			    self.renderEngine.clearFrame();
			    self.renderEngine.renderBlobParts(blobParts);

		    };

		    this.init = function(){
			    //blobPartPool.fill(100,{x:0,y:0});

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
		    };

		    this.startGame = function(){
			    //TODO: Update via requestAnimationFrame or some other kind of timer system
			    //TMP, just manually update once for now
			    updateGame();
			    renderGame();   //TODO: START HERE - follow the render path and fill in the rest of the holes
		    };

		    /**
		     * Create a game object, and properly set it up in the game
		     * @param {String} $objType (enum'd in GameObjTypes)
		     * @param {...} $args
		     * @returns {Object} the newly created object
		     */
		    this.createGameObj = function($objType, $args){
				var self = this;
			    var obj = null;
			    $args = Array.prototype.slice.call(arguments,1);

			    switch($objType){
				    case GameObjTypes.BLOB_PART:
					    obj = createAndAddBlobPart.apply(self, $args);
					    obj.addHandler(GameObjEvent.DESTROYED, EventUtils.bind(self, handleGameObjDestroyed));
					    break;

				    default:
					    L.error('Unknown Game Obj Type: ' + $objType, true);
					    break;
			    }

			    return obj;
		    };

		    this.removeGameObj = function($objToRemove){
			    L.log('Remove game obj: ' + $objToRemove, '@game');

			    switch(true){
				    case ($objToRemove instanceof BlobPart):
					    var idx = blobParts.indexOf($objToRemove);
					    if(idx != -1){
							blobPartPool.recycle($objToRemove);
						    blobParts.splice(idx, 1);
						    $objToRemove.removeAllHandlersByType(GameObjEvent.DESTROYED);
						    L.log('BlobParts Length: ' + blobParts.length, '@game');
						    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
						    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
						    L.log('In Use: ' + blobPartPool.getNumUsed(), '@game');

					    } else {
						    throw new Error('Can\'t remove obj, couldn\'t find in list');
					    }
					    break;

				    default:
					    throw new Error('Unhandled Object Type for removal');
					    break;
			    }

		    };

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);

        //Return constructor
        return Game;
    })();
});
