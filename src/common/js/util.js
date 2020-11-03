export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if(arr instanceof Array) {
        arr.forEach((str) => {
            let tempArr = str.substring(1).split('=');
            let key = encodeURIComponent(tempArr[0]);
            let val = encodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
        return obj;
    }
}
/**
 * @Author   Yaodongxin
 * @DateTime 2019-12-27
 * @method   strlen  计算字符长度中文算两个英文算一个
 * @param    {String}      str 要计算的字符串
 * @return   {Number}      字符长度
 */
export function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
     var c = str.charCodeAt(i); 
    //单字节加1 
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))    { 
       len++; 
     } 
     else { 
      len+=2; 
     } 
    } 
    return len;
}