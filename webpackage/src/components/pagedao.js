import EventTarget from 'eventtarget';
import EnOSDAO from 'dao';
import {PAGE_LEVEL_TARGE} from 'constants';

export default class EnOSPageDAO extends EnOSDAO{
    constructor(channelName){
        super(channelName);
        
        // used for msg in the whole page
        this._pageLevelTarget = new EventTarget(PAGE_LEVEL_TARGE);
    }

    onRequestStart(){
        this._pageLevelTarget.dispatchEvent('indicator.level.show');
    }

    onRequestFinish(){
        this._pageLevelTarget.dispatchEvent('indicator.level.hide');
    }

    dispatchInfo(msg){
        if(msg){
            this._dispatchMsg({
                'level': 'info',
                'msg': msg
            });
        }
    }

    dispatchSuccess(msg){
        if(msg){
            this._dispatchMsg({
                'level': 'success',
                'msg': msg
            });
        }
    }

    dispatchError(msg, key = ''){
        if(msg){
            this._dispatchMsg({
                'level': 'error',
                'msg': msg,
                'key': key,
                'isLogError': false
            });
        }
    }
    
    _dispatchMsg(data){
        this._pageLevelTarget.dispatchEvent('msg.level.show', data);
    }
}
