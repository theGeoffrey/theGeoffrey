
var dispatcher = require("./dispatcher");

function simple_register(callbacks){
    dispatcher.register(function(evt) {
        console.log(evt, callbacks);
        var actionType = evt.actionType;
        if (!actionType) return;
        if (callbacks.hasOwnProperty(actionType)){
            try {
                callbacks[actionType](evt.payload, evt);
            } catch(x) {
                console.error(x)
            }
        }
    });
}


module.exports = {simple_register: simple_register}