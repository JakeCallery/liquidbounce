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
'app/renderEngine/RenderTypes'],
function(L, GameObject,ObjUtils,IManageable,IBitmapRenderable,RenderTypes){
    return (function(){
        /**
         * Creates a BaseDispenser object
         * @extends {EventDispatcher}
         * @constructor
         */
        function BaseDispenser($x, $y, $renderSource, $waitTicks){
            //super
            GameObject.call(this);

	        /**
	         * @type {Array.<IManager>}
	         * @private
	         */
	        this._managers = [];

	        this.pastTicks = 0;
	        this.waitTicks = $waitTicks;

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
	     * @param {Boolean}[$resetWaitTicks=true]
	     */
	    BaseDispenser.prototype.dispense = function($resetWaitTicks){
		    L.log('Dispense!', '@dispenser');
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
