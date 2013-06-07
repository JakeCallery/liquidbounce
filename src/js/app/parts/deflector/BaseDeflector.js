/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/collision/CollisionSides',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils, CollisionSides, L){
    return (function(){
        /**
         * Creates a BaseDeflector object
         * @param {Number} $x
         * @param {Number} $y
         * @param {BitmapRenderSource} $renderSource
         * @extends {EventDispatcher}
         * @implements {IManageable}
         * @implements {IBitmapRenderable}
         * @implements {ICollideable}
         * @constructor
         */
        function BaseDeflector($x, $y, $renderSource){
            //super
            EventDispatcher.call(this);

	        this.isDirty = true;
	        this.isBlocking = true;
	        this.collisionSide = CollisionSides.BOTH;
	        this.shellSegList = [];
	        this.shellVecList = [];

	        this.x = $x;
	        this.y = $y;
	        this.prevX = 0;
	        this.prevY = 0;
	        this.vx = 0;
	        this.vy = 0;

	        //// IManageable ////
	        this._managers = [];

	        //// IBitmapRenderable ////
	        /**@type {CanvasRenderingContext2D}*/
	        this.renderSrc = $renderSource;
	        this.renderImg = this.renderSrc.srcImage;
	        this.renderWidth = this.renderSrc.width;
	        this.renderHeight = this.renderSrc.height;
	        this.renderX = 0;
	        this.renderY = 0;
	        this.renderZ = 0;

	        this.renderOffsetX = -(Math.round(this.renderWidth/2));
	        this.renderOffsetY = -(Math.round(this.renderHeight/2));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BaseDeflector,EventDispatcher);

	    BaseDeflector.prototype.buildCollisionShell = function(){
			//Top flat (left to right, clockwise)
		    this.shellVectList.push(new Vec2DObj(this.renderWidth,0,0,0));
	    };

	    //// IManageable ////
		BaseDeflector.prototype.addManager = function($manager){
			L.log('Adding collision manager: ' + $manager, '@manager');
			this._managers.push($manager);
		};

	    BaseDeflector.prototype.removeManager = function($manager){
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
        return BaseDeflector;
    })();
});
