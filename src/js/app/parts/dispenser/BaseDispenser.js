/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'app/game/GameObject',
'jac/utils/ObjUtils',
'app/game/managers/IManageable',
'app/renderEngine/IBitmapRenderable',
'app/renderEngine/RenderTypes',
'app/physicsEngine/InfluenceObject',
'app/game/GameObjTypes',
'app/parts/blob/BlobRenderSource',
'jac/math/Vec2DObj'],
function(L, GameObject,ObjUtils,IManageable,IBitmapRenderable,
         RenderTypes,InfluenceObject,GameObjTypes, BlobRenderSource,
		 Vec2DObj){
    return (function(){
        /**
         * Creates a BaseDispenser object
         * @extends {EventDispatcher}
         * @constructor
         */
        function BaseDispenser($game, $x, $y, $renderSource, $waitTicks){
            //super
            GameObject.call(this);

	        this.game = $game;

	        /**
	         * @type {Array.<IManager>}
	         * @private
	         */
	        this._managers = [];

	        this.pastTicks = 0;
	        this.waitTicks = $waitTicks;

            this.dispenseXOffset = 30;
	        this.dispenseYOffset = 65;
			this.blobSrc = new BlobRenderSource(30,30,'#FF0000');
	        this.blobCfg = {x:0,y:0};

	        this.x = $x;
	        this.y = $y;
	        this.prevX = 0;
	        this.prevY = 0;
	        this.vx = 0;
	        this.vy = 0;

	        /**@type {CanvasRenderingContext2D}*/
	        this.renderSrc = $renderSource;
	        this.renderImg = this.renderSrc.srcImage;
	        this.renderWidth = 0;
	        this.renderHeight = 0;
	        this.renderX = 0;
	        this.renderY = 0;
	        this.renderZ = 0;

	        this.renderOffsetX = -(Math.round(this.renderWidth/2));
	        this.renderOffsetY = -(Math.round(this.renderHeight/2));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BaseDispenser,GameObject);

	    /**
	     * dispense particles
	     * @param {Boolean}[$resetPastTicks=false]
	     */
	    BaseDispenser.prototype.dispense = function($resetPastTicks){
		    L.log('Dispense!', '@dispenser');

			var bp = this.game.createGameObj(GameObjTypes.BLOB_PART, this.blobCfg, this.blobSrc);
		    bp.transportTo((this.x + this.dispenseXOffset),(this.y + this.dispenseYOffset));

		    //Gravity influence
		    var gravityInfluence = new InfluenceObject(new Vec2DObj(0,0.5),InfluenceObject.NO_DECAY,InfluenceObject.INFINITE_LIFETIME,'testDispense');
			bp.influenceList.addInfluence(gravityInfluence);

		    if($resetPastTicks === true){
			    this.pastTicks = 0;
		    }


	    };

	    //// IManageable ////
	    BaseDispenser.prototype.addManager = function($manager){
		    L.log('adding manager: ' + $manager, '@manager');
		    this._managers.push($manager);
	    };

	    BaseDispenser.prototype.removeManager = function($manager){
		    var idx = this._managers.indexOf($manager);
		    L.log('Remove Manager Called', '@manager');
		    if(idx !== -1){
			    //remove
			    L.log('removing manager: ' + $manager, '@manager');
			    this._managers.splice(idx,1);
		    } else {
			    //not found, warn
			    L.warn('Manager not found in dispenser, could not remove');
		    }
	    };

        //Return constructor
        return BaseDispenser;
    })();
});
