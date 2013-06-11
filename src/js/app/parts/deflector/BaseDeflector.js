/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/game/collision/CollisionSides',
'jac/logger/Logger',
'jac/math/Vec2DObj',
'jac/geometry/Rectangle',
'jac/math/LineSeg2DObj'],
function(EventDispatcher,ObjUtils,CollisionSides,L,Vec2DObj,Rectangle,LineSeg2DObj){
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
			this.colRect = null;

	        this.x = $x;
	        this.y = $y;
	        this.prevX = 0;
	        this.prevY = 0;
	        this.vx = 0;
	        this.vy = 0;

	        //// IManageable ////
	        /**@private*/this._managers = [];

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
		    this.shellVecList.push(new Vec2DObj(this.renderWidth,0,this.x + this.renderOffsetX,this.y + this.renderOffsetY));

		    //manually build col rect for now
		    var minX, minY, maxX, maxY;
		    minX = minY = maxX = maxY = NaN;

		    var lineSeg = new LineSeg2DObj(0,0,0,0);
			var vec = null;

		    for(var i = 0, l = this.shellVecList.length; i < l; i++){
			    vec = this.shellVecList[i];
			    lineSeg.ax = vec.xOffset;
			    lineSeg.ay = vec.yOffset;
			    lineSeg.bx = vec.x + vec.xOffset;
			    lineSeg.by = vec.y + vec.yOffset;

			    if(i == 0){
				    minX = lineSeg.ax;
				    maxX = lineSeg.bx;
				    minY = lineSeg.ay;
				    maxY = lineSeg.by;
			    }

			    if(lineSeg.ax < minX){minX = lineSeg.ax;}
			    else if(lineSeg.ax > maxX){maxX = lineSeg.ax;}
			    if(lineSeg.ay < minY){minY = lineSeg.ay;}
			    else if(lineSeg.ay > maxY){maxY = lineSeg.ay;}
			    if(lineSeg.bx < minX){minX = lineSeg.bx;}
			    else if(lineSeg.bx > maxX){maxX = lineSeg.bx;}
			    if(lineSeg.by < minY){minY = lineSeg.by;}
			    else if(lineSeg.by > maxY){maxY = lineSeg.by;}
		    }

		    this.colRect = new Rectangle(minX, minY, (maxX - minX), (maxY - minY));
		    if(this.colRect.width <= 0){this.colRect.width = 1;}
		    if(this.colRect.height <= 0){this.colRect.height = 1;}

		    debugger;

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
