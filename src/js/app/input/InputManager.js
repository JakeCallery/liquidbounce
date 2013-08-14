/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'leap',
'jac/pool/Pool',
'jac/logger/Logger',
'app/input/Finger',
'jac/utils/ArrayUtils',
'jac/events/JacEvent',
'jac/utils/MathUtils'],
function(EventDispatcher,ObjUtils,Leap,Pool,L,Finger,ArrayUtils,JacEvent,MathUtils){
    return (function(){
        /**
         * Creates a InputManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function InputManager($game){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.game = $game;
	        this.fingers = [];
	        this.fingerPool = new Pool(Finger);

	        L.log('New Input Manager', '@input');

	        this.controller = new Leap.Controller({host:'127.0.0.1', port:6437, enableGestures:false, frameEventName:'animationFrame'});

	        this.controller.on('connect', function(){
		        L.log('Connected to leap service', '@leap');
	        });

	        this.controller.on('ready', function(){
		        L.log('Protocol to socket server selected.', '@leap');
	        });

	        this.controller.on('deviceConnected', function(){
		        L.log('A Leap device has been connected.', '@leap');
	        });

	        this.controller.on('deviceDisconnected', function(){
		        L.log('A Leap device has been disconnected', '@leap');
	        });

	        /* -- This is now handled externally via this.update() below
	        this.controller.on('frame', function($data){
				self.update($data);
	        });
			*/
	        L.log('Trying to connect to Leap Device', '@leap');
	        this.controller.connect();
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);

	    InputManager.prototype.update = function($data){
			if($data === undefined){$data = this.controller.frame();}

		    //L.log('Input Update','@input');

		    var self = this;
		    var i, l,finger,pointable;

		    //Deactivate all fingers, re-activate on match
		    for(i = 0, l = self.fingers.length; i < l; i++){
			    self.fingers[i].isActive = false;
		    }

		    //Map pointables to active fingers
		    for(i = 0, l = $data.pointables.length; i < l; i++){
			    pointable = $data.pointables[i];
			    finger = ArrayUtils.findFirstObjWithProp(self.fingers,'id',pointable.id);
			    if(finger !== null){
				    //update finger's info
				    this.mapPointableCoordsToFinger(pointable,finger);
				    finger.isActive = true;
				    //L.log('Update Active Finger Info: ' + finger.z, '@tmp');
			    } else {
				    //new finger
				    //L.log('Adding new finger', '@leap');
				    finger = self.fingerPool.getObject(0,0,0,pointable.id);
				    this.mapPointableCoordsToFinger(pointable,finger);
				    self.fingers.push(finger);
				    this.dispatchEvent(new JacEvent('addedFinger',finger));
			    }
		    }

		    //Destroy all remaining inactive fingers
		    for(i = self.fingers.length-1; i >= 0; i--){
			    finger = self.fingers[i];
			    if(!finger.isActive){
				    //L.log('Removing Finger: ' + finger.id, '@leap');
				    this.dispatchEvent(new JacEvent('removedFinger', finger));
				    finger.destroy();
				    self.fingers.splice(i,1);
				    self.fingerPool.recycle(finger);
			    }
		    }

	    };

	    InputManager.prototype.mapPointableCoordsToFinger = function($pointable, $finger){
			$finger.x = $pointable.tipPosition[0] + this.game.gameHalfWidth;
			$finger.y = this.game.gameHeight - $pointable.tipPosition[1];
		    $finger.z = MathUtils.clampToRange(-100,100,$pointable.tipPosition[2]);
	    };

        //Return constructor
        return InputManager;
    })();
});
