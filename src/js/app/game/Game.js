/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/GameObjTypes',
'jac/logger/Logger',
'app/parts/BlobPart',
'jac/pool/Pool',
'jac/utils/EventUtils',
'app/game/events/GameObjEvent'],
function(EventDispatcher,ObjUtils, GameObjTypes, L, BlobPart ,Pool, EventUtils, GameObjEvent){
    return (function(){

	    /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game(){
            //super
            EventDispatcher.call(this);

	        var self = this;

		    /**@type int*/
		    var blobPartNextIndex = -1;

		    /**@type {Array.<BlobPart>}*/
		    var blobParts = [];

		    var delegateMap = {};

		    var blobPartPool = new Pool(BlobPart);

		    /**
		     * create and add a blob part to the game
		     * @param {Object} $configObj data object that has key/vals to define the object
		     * returns {BlobPart}
		     */
		    var createAndAddBlobPart = function($configObj){
				var bp = blobPartPool.getObject($configObj);
			    blobParts.push(bp);

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');

			    return bp;
		    };

		    var handleGameObjDestroyed = function($e){
			    L.log('Caught Game Obj Destroyed: ' + $e.target, '@game');
			    self.removeGameObj($e.target);
		    };

		    this.init = function(){
			    blobPartPool.fill(100,{x:0,y:0});

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
		    };

		    /**
		     * Create a game object, and properly set it up in the game
		     * @param {String} $objType (enum'd in GameObjTypes)
		     * @param {Object} $configObj
		     * @returns {Object} the newly created object
		     */
		    this.createGameObj = function($objType, $configObj){
				var obj = null;
			    switch($objType){
				    case GameObjTypes.BLOB_PART:
					    obj = createAndAddBlobPart($configObj);
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
