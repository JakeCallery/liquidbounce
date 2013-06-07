/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['app/parts/deflector/BaseDeflector','jac/utils/ObjUtils'],
function(BaseDeflector,ObjUtils){
    return (function(){
        /**
         * Creates a TestDeflector object
         * @param {Number} $x
         * @param {Number} $y
         * @param {BitmapRenderSource} $renderSource
         * @extends {BaseDeflector}
         * @constructor
         */
        function TestDeflector($x,$y,$renderSource){
            //super
            BaseDeflector.call(this,$x,$y,$renderSource);

	        this.buildCollisionShell();
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(TestDeflector,BaseDeflector);
        
        //Return constructor
        return TestDeflector;
    })();
});
