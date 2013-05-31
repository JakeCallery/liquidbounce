/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/linkedList/Node',
'jac/utils/ObjUtils',
'jac/pool/IPoolable'],
function(Node,ObjUtils, IPoolable){
    return (function(){
        /**
         * Creates a PoolableNode object
         * @implements {IPoolable}
         * @extends {Node}
         * @constructor
         */
        function PoolableNode(){
            //super
            Node.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PoolableNode,Node);

	    PoolableNode.prototype.init = function($args){
		    this.prev = null;
		    this.next = null;
		    this.obj = null;
	    };

	    PoolableNode.prototype.recycle = function(){
		    this.prev = null;
		    this.next = null;
		    this.obj = null;
	    };

        //Return constructor
        return PoolableNode;
    })();
});
