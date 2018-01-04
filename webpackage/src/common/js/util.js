/* eslint-disable */
'use strict';

export default {
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)
            return unescape(decodeURIComponent(r[2]));
        return null;
    },

    //获取cookie
    getCookie: function( name ) {
        var start = document.cookie.indexOf( name + "=" );
        var len = start + name.length + 1;
        if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
            return null;
        }
        if ( start == -1 ) return null;
        var end = document.cookie.indexOf( ';', len );
        if ( end == -1 ) end = document.cookie.length;
        return unescape( document.cookie.substring( len, end ) );
    },

    //设置cookie
    setCookie: function(name, value, path = '/', days = 30) {
        let exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + '; path=' + path;
    },

    //清除cookie
    clearCookie: function(key) {
        let keys = key && [key] || document.cookie.match(/[^ =;]+(?=\=)/g) || [];

        for (let i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + '; path=/';
        }
    },

    getLocaleUrl: function(url, params){
        const locale = this.getQueryString('locale');

        if(locale){
            if(url.indexOf('?') !== -1){
                url = `${url}&locale=${locale}`;
            }else{
                url = `${url}?locale=${locale}`;
            }
        }

        if(params){
            let paramArr = [];
            Object.keys(params).forEach(key => {
                paramArr.push(`${key}=${encodeURIComponent(params[key])}`);
            });

            if(url.indexOf('?') !== -1){
                url = `${url}&${paramArr.join('&')}`;
            }else{
                url = `${url}?${paramArr.join('&')}`;
            }
        }

        return url;
    },

    getAuth: function(){
        return {
            'uid': localStorage.getItem('eos_user_id'),
            'token': localStorage.getItem('eos_user_session'),
            'orgCode': localStorage.getItem('eos_user_team_code'),
            'userName': localStorage.getItem('eos_user_name'),
            'locale': this.getQueryString('locale') || localStorage.getItem('eos_user_locale') || 'zh-CN'
        };
    },

    getUserType: function() {
        return localStorage.getItem('eos_user_type');
    },

    /*
    * 常见Data URL的类型为：
    *
    *    data:text/plain,<文本数据>
    *
    *    data:text/html,<HTML代码>
    *
    *    data:text/html;base64,<base64编码的HTML代码>
    *
    *    data:text/plain;charset=UTF-8;base64,<base64编码的HTML代码>
    *
    *    data:text/css,<CSS代码>
    *
    *    data:text/css;base64,<base64编码的CSS代码>
    *
    *    data:text/javascript,<Javascript代码>
    *
    *    data:text/javascript;base64,<base64编码的Javascript代码>
    *
    *    data:image/gif;base64,<base64编码的gif图片数据>
    *
    *    data:image/png;base64,<base64编码的png图片数据>
    *
    *    data:image/jpeg;base64,<base64编码的jpeg图片数据>
    *
    *    data:image/x-icon;base64,<base64编码的icon图片数据>
    *
    */
    downloadURI: function(uri, name){
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        link.click();
    },

    downloadFile: function(fileName, content, locale){
        var aLink = document.createElement('a');
        var blob;

        if(locale === 'zh-CN'){
            blob = new Blob(['\ufeff' + content], {'type': 'text/csv;charset=GBK'});
        }else if(locale === 'en-US'){
            blob = new Blob([content], {'type': 'text/csv;charset=UTF-8'});
        }else{
            blob = new Blob([content]);
        }
         
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    },

    isArray: function(value){
        return Object.prototype.toString.call(value) === '[object Array]';
    },

    isKVObject: function(value){
        return Object.prototype.toString.call(value) === '[object Object]';
    },

    isFunction: function(value){
        return Object.prototype.toString.call(value) === '[object Function]';
    },

    isString: function(value){
        return Object.prototype.toString.call(value) === '[object String]';
    },

    isEmptyString: function(value){
        if(!value || !value.trim()){
            return true;
        }

        return false;
    }
    
};
/* eslint-enable */
