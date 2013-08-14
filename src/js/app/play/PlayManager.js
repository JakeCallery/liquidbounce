/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/logger/Logger',
'app/parts/field/TestFieldRenderSource',
'app/parts/field/Polarity',
'app/parts/field/BaseField',
'jac/utils/ArrayUtils'],
function(EventDispatcher,ObjUtils,EventUtils,L,TestFieldRenderSource,Polarity,BaseField,ArrayUtils){
    return (function(){
        /**
         * Creates a PlayManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function PlayManager($inputManager, $game){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.fieldList = [];
	        this.fingerList = [];
	        this.inputManager = $inputManager;
			this.game = $game;

	        //// set up test field ////
	        this.testFieldSrc = new TestFieldRenderSource(10,'#00FF00');
	        this.testFieldSrc.init();

	        this.inputManager.addHandler('addedFinger', EventUtils.bind(self, self.handleFingerAdded));
	        this.inputManager.addHandler('removedFinger', EventUtils.bind(self, self.handleFingerRemoved));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PlayManager,EventDispatcher);

	    PlayManager.prototype.update = function(){
		    var field,finger = null;

			for(var i = 0, l = this.fieldList.length; i < l; i++){
				field = this.fieldList[i];
				finger = this.fingerList[i];

				field.updateLocation(finger.x, finger.y, finger.z);

			}
	    };

	    PlayManager.prototype.handleFingerAdded = function($e){
		    //$e.data needs to be a 'Finger' object

		    L.log('Handle Finger Added: ' + $e.data.id, '@play');
		    var testField = new BaseField(this.game,$e.data.x,$e.data.y,1,50,Polarity.ATTRACT,3,this.testFieldSrc);
		    this.game.addGameObject(testField);

		    //Keep field List and finger list in sync
		    this.fieldList.push(testField);
		    this.fingerList.push($e.data);

	    };

	    PlayManager.prototype.handleFingerRemoved = function($e){
		    L.log('Handle Finger Removed: ' + $e.data.id, '@play');
		    var index = ArrayUtils.findFirstIndexObjWithProp(this.fingerList,'id',$e.data.id);
		    var field = this.fieldList[index];
		    this.game.removeGameObj(field);
		    this.fieldList.splice(index,1);
		    this.fingerList.splice(index,1);

		    L.log('List Lengths: ' + this.fieldList.length + '/' + this.fingerList.length, '@play');
	    };

        //Return constructor
        return PlayManager;
    })();
});
