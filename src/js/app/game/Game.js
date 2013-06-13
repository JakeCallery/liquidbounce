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
'app/renderEngine/RenderEngine',
'stats',
'app/physicsEngine/PhysicsEngine',
'app/game/managers/BlobManager',
'app/game/managers/InfluenceManager',
'app/game/managers/DispenserManager',
'app/parts/dispenser/BaseDispenser',
'app/game/managers/CollisionManager',
'app/parts/deflector/BaseDeflector',
'jac/linkedList/LinkedList',
'app/debug/DebugDrawTool',
'app/game/managers/FieldManager',
'app/parts/field/BaseField'],
function(EventDispatcher,ObjUtils, GameObjTypes, L, BlobPart ,Pool,
         EventUtils, GameObjEvent, RenderEngine, Stats, PhysicsEngine,
		 BlobManager, InfluenceManager, DispenserManager, BaseDispenser,
		 CollisionManager, BaseDeflector, LinkedList, DebugDrawTool,
		 FieldManager,BaseField){
    return (function(){

	    /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($doc, $window, $gameCanvas, $gameWidth, $gameHeight){
            //super
            EventDispatcher.call(this);

	        var self = this;

		    this.doc = $doc;
		    this.window = $window;
			this.gameWidth = $gameWidth;
		    this.gameHeight = $gameHeight;
			this.gameCanvas = $gameCanvas;
		    this.gameCtx = $gameCanvas.getContext('2d');

		    this.stats = new Stats();
		    this.stats.setMode(0);
			this.doc.getElementById('statsDiv').appendChild(this.stats.domElement);

		    var ddt = new DebugDrawTool();

		    /**@type int*/
		    var blobPartNextIndex = -1;

		    var blobList = new LinkedList();
		    /**@type {Array.<BlobPart>}*/
		    var blobParts = [];
			var dispensers = [];
			var deflectors = [];
		    var fields = [];

		    var delegateMap = {};
		    var blobPartPool = new Pool(BlobPart);

		    this.updateId = -1;
		    //this.updateDelegate = EventUtils.bind(self, self.update);
		    this.renderEngine = new RenderEngine(this.gameCanvas, $gameWidth, $gameHeight);
			this.physicsEngine = new PhysicsEngine();
		    this.blobManager = new BlobManager(blobList);
		    this.influenceManager = new InfluenceManager();
		    this.dispenserManager = new DispenserManager();
		    this.collisionManager = new CollisionManager();
		    this.fieldManager = new FieldManager();

		    /**
		     * create and add a blob part to the game
		     * @param {Object} $configObj data object that has key/vals to define the object
		     * @param {BlobRenderSource} $renderSource
		     * returns {BlobPart}
		     */
		    var createAndAddBlobPart = function($configObj, $renderSource){
				/**@type {BlobPart|Object}*/var bp = blobPartPool.getObject($configObj, $renderSource);
			    blobParts.push(bp);

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
			    L.log('In Use: ' + blobPartPool.getNumUsed(), '@game');

				self.blobManager.addObject(bp);
			    self.influenceManager.addObject(bp);

			    return bp;
		    };

		    var handleGameObjDestroyed = function($e){
			    L.log('Caught Game Obj Destroyed: ' + $e.target, '@game');
			    var gameObj = $e.target;
			    self.removeGameObj(gameObj);
		    };

		    var updateGame = function(){
			    //L.log('Update Game', '@frame');

			    var i = 0;
			    var l = 0;
				var obj;

			    //Blob Parts
			    for(i = 0, l = blobParts.length; i < l; i++){
					obj = blobParts[i];
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
				    if(obj.renderX < -obj.renderWidth || obj.renderX > (self.gameWidth + obj.renderWidth) ||
					   obj.renderY < obj.renderHeight || obj.renderY > (self.gameHeight + obj.renderHeight)){
					    //out of bounds, remove
					    L.log('Setting obj to dead: ' + obj, '@dead');
					    obj.isDead = true;
				    }
			    }

			    //Dispensers
			    for(i = 0, l = dispensers.length; i < l; i++){
				    obj = dispensers[i];
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
			    }

			    //Deflectors
			    for(i = 0, l = deflectors.length; i < l; i++){
				    obj = deflectors[i];
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
			    }

			    //Fields
			    for(i = 0, l = fields.length; i < l; i++){
				    obj = fields[i];
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
			    }

		    };

		    var renderGame = function(){
			    //L.log('Render Game', '@frame');

			    self.renderEngine.clearFrame();
			    self.renderEngine.renderDispensers(dispensers);
			    self.renderEngine.renderBlobParts(blobParts);
			    self.renderEngine.renderDeflectors(deflectors);
			    self.renderEngine.renderFields(fields);


		    };

		    var updatePhysics = function(){
			    self.dispenserManager.updateDispensers(1);
			    self.influenceManager.tickInfluenceLists(1); //TODO: delta ticks might need to be dynamic in the future, for now just 1
			    self.fieldManager.calcFieldInfluences(blobList,1);
			    self.blobManager.updateBlobParts(1);
		    };

		    var updateCollisions = function(){
			    self.collisionManager.calcCollisions(blobList,1);
		    };

		    var cullDead = function(){
			    var gameObj = null;
			    for(var i = blobParts.length-1, l = 0; i >= l; i--){
				    gameObj = blobParts[i];
				    if(gameObj === undefined){
					    L.error('something broke while culling dead game objects', true);
				    }
				    if(gameObj.isDead === true){
					    L.log('Destroying Obj: ' + gameObj, '@dead');
					    //TODO: This has a bad side effect of removing this object from the blobParts array.
					    //Might not want to do that during remove, but after this loop?
					    gameObj.destroy();
				    }
			    }
		    };

		    this.init = function(){
			    //blobPartPool.fill(100,{x:0,y:0});

			    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
			    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
		    };

		    /**
		     * step the game forward
		     * @param {Boolean} [$isManualUpdate=false]
		     */
		    this.update = function($isManualUpdate){

			    if($isManualUpdate === undefined){$isManualUpdate = false;}


			    if($isManualUpdate !== true){
				    self.updateId = self.window.requestAnimationFrame(self.update);
			    }

			    cullDead();
			    updatePhysics();
			    updateCollisions();
			    updateGame();
			    renderGame();
			    self.stats.update();

			    //debug draw
			    ddt.draw(self.gameCtx);
		    };

		    this.stepGame = function(){
			    L.log('Stepping Game 1 Tick...');
			    self.update(true);
		    };

		    this.startGame = function(){
			    L.log('Starting Game...', '@game');
			    self.update();
		    };

		    this.pauseGame = function(){
			    L.log('Pausing Game...', '@game');
			    self.window.cancelAnimationFrame(self.updateId);
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
					    obj.addHandler(GameObjEvent.DESTROYED, handleGameObjDestroyed);
					    break;

				    default:
					    L.error('Unknown Game Obj Type: ' + $objType, true);
					    break;
			    }

			    return obj;
		    };

		    /**
		     * add a premade object to the game
		     * @param {Object} $obj
		     */
		    this.addGameObject = function($obj){
			    if($obj instanceof BaseDispenser){
				    //add dispenser
				    dispensers.push($obj);
				    self.dispenserManager.addObject($obj);
			    } else if($obj instanceof BaseDeflector){
				    deflectors.push($obj);
				    self.collisionManager.addObject($obj);
			    } else if($obj instanceof BaseField){
				    fields.push($obj);
				    self.fieldManager.addObject($obj);
			    } else {
				    //unknown obj
				    L.error('Unknown Game Obj Type: ' + $obj, true);
			    }
		    };

		    this.removeGameObj = function($objToRemove){
			    L.log('Remove game obj: ' + $objToRemove, '@game');

			    switch(true){
				    case ($objToRemove instanceof BlobPart):
					    var idx = blobParts.indexOf($objToRemove);
					    if(idx != -1){
						    self.blobManager.removeObject($objToRemove);
						    self.influenceManager.removeObject($objToRemove);
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
