/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var InterfaceUtils = {};

	    /**
	     * Determine if a class has all of the required functions defined by the passed in interfaces
	     * if inheritance is used, the constructor must have a superclass (from ObjUtils.inheritPrototype)
	     * @param {Object} $class item to compare to interface
	     * @param {...} $interfaceArgs interface object to get a property list from
	     * @returns {Boolean|String} true if valid, reason string if not
	     */
	    InterfaceUtils.isImplemented = function($class, $interfaceArgs){

		    $interfaceList = Array.prototype.slice.call(arguments);
		    $interfaceList.shift();

		    var failReason = '';

		    var propMap = {};
			var propCount = 0;

		    for(var l = 0; l < $interfaceList.length; l++){
				for (var p in $interfaceList[l]){
					if($interfaceList[l].hasOwnProperty(p)){
						if(!propMap.hasOwnProperty(p)){
							propMap[p] = $interfaceList[l][p];
							propCount++;
						} else {
							//TODO: this should allow interfaces with the same function names as long as the signatures/param counts match
							throw new Error('two or more interfaces have the same property');
						}

					}
				}
		    }

		    var tmp = $class;
		    do {
				for(var prop in propMap){
					var propFound = true;
					if(propMap.hasOwnProperty(prop)){
						if(tmp.hasOwnProperty(prop)){
							//basic type check prop
							if(typeof propMap[prop] !== typeof tmp[prop]){
								failReason = 'Property types don\'t match for: ' + prop;
								propFound = false;
							} else if(typeof propMap[prop] === 'function'){
								//if function, check param counts
								if(propMap[prop].length !== tmp[prop].length){
									propFound = false;
									failReason = 'Argument count mismatch for function: ' + prop + ' in interface list';
								}
							}

							//Found one
							if(propFound === true){
								delete propMap[prop];
								propCount--;
							}
						}
					}
				}
				if(tmp.prototype){
					tmp = tmp.prototype
				} else if(tmp.hasOwnProperty('constructor') && tmp.constructor.hasOwnProperty('superClass')){
					tmp = tmp.constructor.superClass;
				} else {
					tmp = null;
				}

		    } while(propCount > 0 && tmp !== null);

		    if(propCount > 0){
			    //not all props found
			    var notFoundList = [];
			    for(var pr in propMap){
				    if(propMap.hasOwnProperty(pr)){
					    notFoundList.push(pr);
				    }
			    }
			    failReason = 'Interfaces not fully implemented, missing: ' + notFoundList;
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
