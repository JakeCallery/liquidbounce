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
	     * @param {Array.<Object>} $interfaceList interface object to get a property list from
	     * @param {Boolean} [$throwError=true] throw an error if it does not match
	     * @returns {Boolean|String} true if valid, reason string if not
	     */
	    InterfaceUtils.implements = function($obj, $interfaceList, $throwError){
			if($throwError === undefined){
				$throwError = true;
			}

		    var failReason = '';

		    for(var i = 0; i < $interfaceList.length; i++){
			    if(failReason !== ''){break;}

			    var iface = $interfaceList[i];
			    for(var prop in iface){
				    if(iface.hasOwnProperty(prop)){
					    //Check to see if the $obj has the same property
					    if($obj.hasOwnProperty(prop)){
						    //make sure the property types are similar'ish at a basic level
						    if(typeof iface[prop] === typeof $obj[prop]){
							    if(typeof prop === 'function'){
								    //check argument length
								    if(iface[prop].length !== $obj[prop].length){
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
			    if($throwError === true){
				    throw new Error(failReason);
			    }

			    return failReason;
		    }

		    return true;
	    };
        
        
        //Return constructor
        return InterfaceUtils;
    })();
});
