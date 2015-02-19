
var dispatcher = require("./dispatcher"),
    strophe = require("strophe"),
    Strophe = window.Strophe;

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

function parse_error_iq(iq){
  var errorNode = iq.getElementsByTagName("error")[0],
      errorCode = errorNode.getAttribute("code"),
      errorType = errorNode.getAttribute("type"),
      errorKey = errorNode.childNodes[0].nodeName,
      errorTextNodes = errorNode.getElementsByTagName("text"),
      errorText = errorTextNodes.length ? Strophe.getText(errorTextNodes[0]) : "";
  return {
    "code": errorCode,
    "type": errorType,
    "key": errorKey,
    "text": errorText,
    "orginal": iq
  }
}


module.exports = {
    simple_register: simple_register,
    parse_error_iq: parse_error_iq
  }