/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'json2',
'jac/polyfills/RequestAnimationFrame',
'jac/utils/BrowserUtils'],
function(L, ConsoleTarget, JSON, RequestAnimationFrame, BrowserUtils){
    L.addLogTarget(new ConsoleTarget());
    L.log('New Main!');
});
