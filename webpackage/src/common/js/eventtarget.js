import Postal from 'postal';

export default class EventTarget{
    constructor(channelName){
        this._channelName = channelName || `${(new Date()).getTime()}_channel`;
        this._channel = Postal.channel(this._channelName);
        this._topicMap = {};
    }
    
    subEvent(eventType, scope, func){
        this._topicMap[eventType] = this._channel.subscribe(eventType, this._proxy(scope[func], scope));
    }
    
    unSubEvent(eventType){
        if(eventType && this._topicMap[eventType]){
            this._topicMap[eventType].unsubscribe();
        }
    }
    
    dispatchEvent(eventType, data){
        this._channel.publish(eventType, data);
    }

    _proxy(func, scope){
        if(!func){
            console.error('the func can\'t be null or undefined!');
            return null;
        }

        if(Object.prototype.toString.call(func) !== '[object Function]'){
            console.error('the func must be a real function!');
            return null;
        }

        return function(){
            // eslint-disable-next-line prefer-rest-params
            return func.apply(scope || this, arguments);
        };
    }
}
