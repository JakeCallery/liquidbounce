/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/game/GameObject',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'jac/geometry/Rectangle'],
function(GameObject,ObjUtils,L,Rectangle){
    return (function(){
        /**
         * Creates a BaseField object
         * @param {Game} $game
         * @param {Number} $x
         * @param {Number} $y
         * @param {Number} $minDist
         * @param {Number} $maxDist
         * @param {String} $polarity
         * @param {Number} $strength
         * @param {BitmapRenderSource} $renderSource
         * @implements {IManageable}
         * @implements {IBitmapRenderable}
         * @extends {GameObject}
         * @constructor
         */
        function BaseField($game,$x,$y,$minDist,$maxDist,$polarity,$strength,$renderSource){
            //super
            GameObject.call(this);

	        this.game = $game;
	        this.x = $x;
	        this.y = $y;
	        this.minDist = $minDist;
	        this.maxDist = $maxDist;
	        this.polarity = $polarity;
	        this.strength = $strength;
	        this.renderSrc = $renderSource;
	        this.renderImg = this.renderSrc.srcImage;
	        this.renderWidth = this.renderSrc.width;
	        this.renderHeight = this.renderSrc.height;
	        this.renderX = 0;
	        this.renderY = 0;
	        this.renderZ = 0;
	        this.renderOffsetX = -(Math.round(this.renderWidth/2));
	        this.renderOffsetY = -(Math.round(this.renderHeight/2));
	        this.boundsRect = new Rectangle(this.x - (this.maxDist), this.y - (this.maxDist), this.maxDist*2, this.maxDist*2);

	        /**@type {Array.<IManager>}
	         * @private
	         */
	        this._managers = [];
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BaseField,GameObject);

	    BaseField.prototype.updateLocation = function($x,$y,$z){
		    this.x = $x;
		    this.y = $y;
		    //TODO: add in Z

		    this.boundsRect.x = $x - this.maxDist;
		    this.boundsRect.y = $y - this.maxDist;

	    };

	    //// IManageable ////
	    BaseField.prototype.addManager = function($manager){
		    L.log('adding manager: ' + $manager, '@manager');
		    this._managers.push($manager);
	    };

	    BaseField.prototype.removeManager = function($manager){
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
        return BaseField;
    })();
});
