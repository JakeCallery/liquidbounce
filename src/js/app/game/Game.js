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
'app/parts/field/BaseField',
'app/input/InputManager',
'app/play/PlayManager'],
function(EventDispatcher,ObjUtils, GameObjTypes, L, BlobPart ,Pool,
         EventUtils, GameObjEvent, RenderEngine, Stats, PhysicsEngine,
		 BlobManager, InfluenceManager, DispenserManager, BaseDispenser,
		 CollisionManager, BaseDeflector, LinkedList, DebugDrawTool,
		 FieldManager,BaseField,InputManager,PlayManager){
    return (function(){

	    /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($doc, $window, $gameCanvas, $gameWidth, $gameHeight, $renderAsBlobs){
            //super
            EventDispatcher.call(this);

	        var self = this;

		    this.doc = $doc;
		    this.window = $window;
			this.gameWidth = $gameWidth;
		    this.gameHeight = $gameHeight;
		    this.gameHalfWidth = Math.round(this.gameWidth/2);
		    this.gameHalfHeight = Math.round(this.gameHeight/2);
			this.gameCanvas = $gameCanvas;
		    this.gameCtx = $gameCanvas.getContext('2d');
			this.renderAsBlobs = $renderAsBlobs;
		    this.stats = new Stats();
		    this.stats.setMode(0);
			this.doc.getElementById('statsDiv').appendChild(this.stats.domElement);

		    var ddt = new DebugDrawTool();

		    /**@type int*/
		    var blobPartNextIndex = -1;

		    var blobList = new LinkedList();
		    /**@type {Array.<BlobPart>}*/
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
			this.inputManager = new InputManager(self);
		    this.playManager = new PlayManager(self.inputManager,self);

		    /**
		     * create and add a blob part to the game
		     * @param {Object} $configObj data object that has key/vals to define the object
		     * @param {BlobRenderSource} $renderSource
		     * returns {BlobPart}
		     */
		    var createAndAddBlobPart = function($configObj, $renderSource){
				/**@type {BlobPart|Object}*/var bp = blobPartPool.getObject($configObj, $renderSource);
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
			    var node = blobList.getNext();
			    while(node !== null){
				    obj = node.obj;
				    obj.renderX = obj.x + obj.renderOffsetX;
				    obj.renderY = obj.y + obj.renderOffsetY;
				    if(obj.renderX < -obj.renderWidth || obj.renderX > (self.gameWidth + obj.renderWidth) ||
					    obj.renderY < obj.renderHeight || obj.renderY > (self.gameHeight + obj.renderHeight)){
					    //out of bounds, remove
					    L.log('Setting obj to dead: ' + obj, '@dead');
					    obj.isDead = true;
				    }

				    node = blobList.getNext();
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
			    self.renderEngine.renderDeflectors(deflectors);
			    self.renderEngine.renderFields(fields);
			    self.renderEngine.renderBlobParts(blobList, self.renderAsBlobs);

		    };

		    var updateInput = function(){
			    self.inputManager.update();
			    self.playManager.update();
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
			    var node = null;
			    var deadNode = null;
			    blobList.resetCurrent();
			    node = blobList.getNext();
			    while(node !== null){
					gameObj = node.obj;
				    if(gameObj === undefined){
					    L.error('something broke while culling dead game objects', true);
				    }
				    if(gameObj.isDead === true){
						deadNode = node;
					    node = blobList.getNext();
					    blobList.removeNode(deadNode);
					    gameObj.destroy();
				    } else {
					    node = blobList.getNext();
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
			    updateInput();
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
					    self.blobManager.removeObject($objToRemove);
					    self.influenceManager.removeObject($objToRemove);
						blobPartPool.recycle($objToRemove);
					    $objToRemove.removeAllHandlersByType(GameObjEvent.DESTROYED);
					    L.log('Total: ' + blobPartPool.getNumTotal(), '@game');
					    L.log('Avail: ' + blobPartPool.getNumFree(), '@game');
					    L.log('In Use: ' + blobPartPool.getNumUsed(), '@game');

					    break;

				    case ($objToRemove instanceof BaseField):
					    idx = fields.indexOf($objToRemove);
					    if(idx != -1){
						    self.fieldManager.removeObject($objToRemove);
						    fields.splice(idx,1);
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
