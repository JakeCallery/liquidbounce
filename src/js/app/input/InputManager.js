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
'jac/utils/ArrayUtils'],
function(EventDispatcher,ObjUtils,Leap,Pool,L,Finger,ArrayUtils){
    return (function(){
        /**
         * Creates a InputManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function InputManager(){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.fingers = [];
	        this.fingerPool = new Pool(Finger);

	        L.log('New Input Manager', '@input');

	        var controller = new Leap.Controller({host:'192.168.1.95', port:6437, enableGestures:false, frameEventName:'animationFrame'});

	        controller.on('connect', function(){
		        L.log('Leap Connected', '@leap');
	        });

	        controller.on('ready', function(){
		        L.log('Protocol to socker server selected.', '@leap');
	        });

	        controller.on('deviceConnected', function(){
		        L.log('A Leap device has been connected.', '@leap');
	        });

	        controller.on('deviceDisconnected', function(){
		        L.log('A Leap device has been disconnected', '@leap');
	        });

	        controller.on('frame', function($data){

		        var i, l,finger,pointable;

		        //Deactivate all fingers, re-activate on match
		        for(i = 0, l = self.fingers.length; i < l; i++){
					self.fingers[i].isActive = false;
		        }

		        //Walk pointables,
		        //match up with active fingers,
		        //set matching fingers as active
		        //add new fingers if needed
		        for(i = 0, l = $data.pointables.length; i < l; i++){
					pointable = $data.pointables[i];
			        finger = ArrayUtils.findFirstObjWithProp(self.fingers,'id',pointable.id);
			        if(finger !== null){
				        //update finger's info
				        finger.x = pointable.stabilizedTipPosition[0];
				        finger.y = pointable.stabilizedTipPosition[1];
				        finger.z = pointable.stabilizedTipPosition[2];
				        finger.isActive = true;
				        L.log('Update Active Finger Info: ' + finger.x, '@leap');
			        } else {
				        //new finger
				        L.log('Adding new finger', '@leap');
				        finger = self.fingerPool.getObject(
					        pointable.stabilizedTipPosition[0],
					        pointable.stabilizedTipPosition[1],
					        pointable.stabilizedTipPosition[2],
				            pointable.id);
				        self.fingers.push(finger);
			        }
		        }

		        //Destroy all remaining inactive fingers
		        for(i = self.fingers.length-1; i >= 0; i--){
			        finger = self.fingers[i];
			        if(!finger.isActive){
				        L.log('Removing Finger: ' + finger.id, '@leap');
				        finger.destroy();
				        self.fingers.splice(i,1);
				        self.fingerPool.recycle(finger);
			        }
		        }
	        });

	        L.log('Trying to connect to Leap Device', '@leap');
	        controller.connect();

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);
        
        //Return constructor
        return InputManager;
    })();
});
