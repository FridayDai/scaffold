import EventTarget from 'eventtarget';
import Util from 'util';
import msg from 'lang';
import fetch from 'isomorphic-fetch';
import Promise from 'promise-polyfill';
import {MODE, SSO_MODE} from 'constants';

export default class EnOSDAO extends EventTarget{
    constructor(channelName){
        super(channelName);

        if(window.isCsrfDisabled === 'n'){
            this._tokenName = document.querySelector('meta[name="_csrfname_"]').getAttribute('content');
            this._token = document.querySelector('meta[name="_csrftoken_"]').getAttribute('content');
        }

        if(!window.Promise){
            // only for IE
            window.Promise = Promise;
        }
    }

    _fetchDataAction(ajaxObj, needNotify){
        const headers = {
            'Accept': 'application/json',
            'eos_auth': JSON.stringify(Util.getAuth())
        };

        if(window.isCsrfDisabled === 'n'){
            headers['csrf-token'] = this._tokenName;
            headers[this._tokenName] = this._token;
        }

        if(ajaxObj.contentType){
            headers['Content-Type'] = ajaxObj.contentType;
        }

        const fetchObj = {
            'method': ajaxObj.type || 'POST',
            'headers': headers,
            'credentials': 'same-origin',
            'cache': 'no-cache'
        };

        if(ajaxObj.type.toUpperCase() === 'POST'){
            fetchObj.body = ajaxObj.data;
        }

        return new Promise((resolve, reject) => {
            fetch(ajaxObj.url, fetchObj)
            .then(response => {
                if(response.status >= 200 && response.status < 400){
                    return response.json();
                }else{
                    if(needNotify){
                        this.onRequestFinish();
                    }

                    throw(response);
                }
            })
            .then(data => {
                if(needNotify){
                    this.onRequestFinish();
                }
                // This check will be removed soon!!!
                if(data.hasOwnProperty('retCode')){
                    if(data.retCode === 10000){
                        resolve(data.data);
                    }else if(data.retCode === 30000){
                        window.location = Util.getLocaleUrl('./nopermission.html');
                    }else{
                        reject(`${data.retCode}: ${msg(data.errMsg)}`);
                    }
                }else{
                    resolve(data);
                }
            })
            .catch(error => {
                if(needNotify){
                    this.onRequestFinish();
                }

                console.error(error);
                reject(error);
            });
        });
    }
    
    fetchData(path, data, options = {}){
        if(Util.getQueryString(MODE) === SSO_MODE &&
            !sessionStorage.getItem('eos_sso_head')){
            console.log('fetch user info first!');
        }

        const {type, contentType, needNotify} = options;
        let requestData = '';
        const requestType = type || 'POST';
        const ajaxObj = {
            'url': path,
            'type': requestType,
            'data': requestData,
            'contentType': contentType
        };

        if(data){
            if(Util.isString(data)){
                // Most of time, this's used for requestbody
                requestData = data;
            }else{
                let params;
                if(requestType.toUpperCase() !== 'GET'){
                    params = new FormData();
                }else{
                    params = [];
                }

                Object.keys(data).forEach(key => {
                    let val = data[key];

                    if(Util.isArray(val) || Util.isKVObject(val)){
                        val = JSON.stringify(val);
                    }

                    if(requestType.toUpperCase() !== 'GET'){
                        params.append(key, val);
                    }else{
                        params.push(`${key}=${encodeURIComponent(val)}`);
                    }
                });

                if(requestType.toUpperCase() !== 'GET'){
                    requestData = params;
                }else{
                    requestData = params.join('&');
                }
            }

            if(requestType.toUpperCase() !== 'GET'){
                ajaxObj.data = requestData;
            }else{
                let requestPath = path;

                if(requestPath.indexOf('?') !== -1){
                    requestPath = `${requestPath}&${requestData}`;
                }else{
                    requestPath = `${requestPath}?${requestData}`;
                }

                ajaxObj.url = requestPath;
            }
        }

        if(needNotify){
            this.onRequestStart();
        }
        
        return this._fetchDataAction(ajaxObj, needNotify);
    }

    onRequestStart(){
        console.log('the default start action!');
    }

    onRequestFinish(){
        console.log('the default finish action!');
    }

    logError(prefix, errorObj){
        let errorMsg = '';

        if(errorObj.status){
            errorMsg = `${prefix}: ${errorObj.status} ${errorObj.statusText}`;
        }else{
            errorMsg = `${prefix}: ${errorObj}`;
        }

        return errorMsg;
    }
    
    sortArray(array, prop = ''){
        return array.sort((a, b) => {
            if(!prop){
                return a > b ? 1 : -1;
            }else{
                return a[prop] > b[prop] ? 1 : -1;
            }
        });
    }
}
