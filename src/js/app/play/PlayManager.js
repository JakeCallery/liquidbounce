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
'app/parts/field/BaseField'],
function(EventDispatcher,ObjUtils,EventUtils,L,TestFieldRenderSource,Polarity,BaseField){
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
	        this.fieldsByFingerId = {};
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

	    PlayManager.prototype.handleFingerAdded = function($e){
		    L.log('Handle Finger Added: ' + $e.data.id, '@play');
		    var testField = new BaseField(this.game,$e.data.x,$e.data.y,1,20,Polarity.ATTRACT,1,this.testFieldSrc);
		    this.game.addGameObject(testField);

		    this.fieldsByFingerId[$e.data.id] = testField;

	    };

	    PlayManager.prototype.handleFingerRemoved = function($e){
		    L.log('Handle Finger Removed: ' + $e.data.id, '@play');
		    var field = this.fieldsByFingerId[$e.data.id];
		    this.game.removeGameObj(field);
		    delete this.fieldsByFingerId[$e.data.id];
	    };

        //Return constructor
        return PlayManager;
    })();
});
