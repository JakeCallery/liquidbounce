/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/pool/IPoolable',
'jac/logger/Logger',
'jac/events/JacEvent'],
function(EventDispatcher,ObjUtils,IPoolable,L,JacEvent){
    return (function(){
        /**
         * Creates a Finger object
         * @implements {IPoolable}
         * @constructor
         */
        function Finger(){

	        //super
	        EventDispatcher.call(this);

			this.x = null;
			this.y = null;
			this.z = null;
	        this.id = null;
	        this.isActive = null;
        }

	    //Inherit / Extend
	    ObjUtils.inheritPrototype(Finger,EventDispatcher);

	    Finger.prototype.destroy = function(){
            var self = this;
		    this.isActive = false;
		    this.dispatchEvent(new JacEvent('destroyed'));
	    };

	    ///// IPoolable /////
	    Finger.prototype.init = function($x,$y,$z,$id){
			this.x = $x;
			this.y = $y;
			this.z = $z;
			this.id = $id;
		    this.isActive = true;
	    };

	    Finger.prototype.recycle = function(){
		    this.x = null;
		    this.y = null;
		    this.z = null;
		    this.id = null;
		    this.isActive = null;
	    };

        //Return constructor
        return Finger;
    })();
});
