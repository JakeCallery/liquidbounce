/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var InterfaceUtils = {};

	    /**
	     *
	     * @param {Object} $obj item to compare to interface
	     * @param {...} $interfaceList interface object to get a property list from
	     * @returns {Boolean|String} true if valid, reason string if not
	     */
	    InterfaceUtils.isImplemented = function($obj, $interfaceList){

		    $interfaceList = Array.prototype.slice.call(arguments);
		    $interfaceList.shift();

		    var failReason = '';

		    for(var i = 0; i < $interfaceList.length; i++){
			    if(failReason !== ''){break;}

			    var iface = $interfaceList[i];
			    for(var prop in iface){
				    if(iface.hasOwnProperty(prop)){
					    //Check to see if the $obj has the same property
					    var objProp = null;
					    if($obj.hasOwnProperty(prop)){
							objProp = $obj[prop];
					    } else if($obj.prototype.hasOwnProperty(prop)){
							objProp = $obj.prototype[prop];
					    }

					    if(objProp !== null){
						    //make sure the property types are similar'ish at a basic level
						    if(typeof iface[prop] === typeof objProp){
							    if(typeof prop === 'function'){
								    //check argument length
								    if(iface[prop].length !== objProp.length){
									    failReason = 'Argument count mismatch for function: ' + prop + ' with interface index ' + i;
								    }
							    }
						    } else {
							    failReason = 'Property types don\'t match for: ' + prop + ' with interface index ' + i;
						    }

					    } else {
						    failReason = 'Property \'' + prop + '\' not found on object with interface index ' + i;
					    }
				    }
			    }
		    }

		    if(failReason !== ''){
			    //failed
			    return failReason;
		    } else {
			    return true;
		    }

	    };
        
        
        //Return constructor
        return InterfaceUtils;
    })();
});
