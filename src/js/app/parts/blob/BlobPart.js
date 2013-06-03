/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/game/GameObject',
'jac/utils/ObjUtils',
'jac/pool/IPoolable',
'jac/logger/Logger',
'app/renderEngine/IBitmapRenderable',
'app/renderEngine/RenderTypes',
'app/physicsEngine/InfluenceObject',
'app/physicsEngine/InfluenceList',
'app/physicsEngine/IInfluenceable'],
function(GameObject,ObjUtils,IPoolable,L, IBitmapRenderable, RenderTypes, InfluenceObject,
         InfluenceList, IInfluenceable){
    return (function(){
        /**
         * Creates a BlobPart object
         * @extends {GameObject}
         * @implements {IPoolable}
         * @implements {IBitmapRenderable}
         * @implements {IInfluenceable}
         * @implements {IManageable}
         * @constructor
         */
        function BlobPart(){
            //super
            GameObject.call(this);

	        /**
	         * @type {Array.<IManager>
	         * @private
	         */
	        this._managers = [];

	        this.x = 0;
	        this.y = 0;
	        this.prevX = 0;
	        this.prevY = 0;
	        this.vx = 0;
	        this.vy = 0;

	        /**@type {CanvasRenderingContext2D}*/
	        this.renderSrc = null;
	        this.renderImg = null;
	        this.renderWidth = 0;
	        this.renderHeight = 0;
	        this.renderX = 0;
	        this.renderY = 0;
	        this.renderZ = 0;

	        this.renderOffsetX = 0;
	        this.renderOffsetY = 0;

	        /** @type {InfluenceList} */
	        this.influenceList = new InfluenceList();

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BlobPart,GameObject);

	    BlobPart.prototype.destroy = function(){
		    BlobPart.superClass.destroy.call(this);
		    L.log('Destroy Blobpart', '@dead');
	    };

	    //// IPoolable ////
	    /**
	     * set up blob (called from pool on add)
	     * @param {Object} $configObj
	     * @param {BlobRenderSource} $renderSource
	     */
	    BlobPart.prototype.init = function($configObj, $renderSource){
			this.x = this.prevX = $configObj.x;
		    this.y = this.prevY = $configObj.y;

		    this.renderSrc = $renderSource;
		    this.renderImg = $renderSource.srcImage;
		    this.renderWidth = $renderSource.width;
		    this.renderHeight = $renderSource.height;
		    this.renderOffsetX = -(Math.round((this.renderWidth/2)));
		    this.renderOffsetY = -(Math.round((this.renderHeight/2)));

		    L.log('Init Blobpart', '@bpart');
	    };

	    BlobPart.prototype.recycle = function(){
			this.x = this.prevX = -1;
		    this.y = this.prevY = -1;
		    L.log('Recycle BlobPart', '@bpart');
	    };

	    //// IManageable ////
	    BlobPart.prototype.addManager = function($manager){
		    L.log('adding manager: ' + $manager, '@manager');
		    this._managers.push($manager);
	    };

	    BlobPart.prototype.removeManager = function($manager){
			var idx = this._managers.indexOf($manager);
		    L.log('Remove Manager Called', '@manager');
		    if(idx !== -1){
			    //remove
			    L.log('removing manager: ' + $manager, '@manager');
			    this._managers.splice(idx,1);
		    } else {
			    //not found, warn
			    L.warn('Manager not found in blob part, could not remove');
		    }
	    };

        //Return constructor
        return BlobPart;
    })();
});
