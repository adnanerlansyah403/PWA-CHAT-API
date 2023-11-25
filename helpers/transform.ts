
// @ts-ignore
// @ts-nocheck
function splitData(dataArray, parts, allowedKeySeparete = [], notAllowedKey = []) {
    const result = [];

    for (const data of dataArray) {
      const obj = {};
  
      for (const part of parts) {
        obj[part.name] = {};
  
        for (const key of part.data) {
          if (data.hasOwnProperty(key)) {
            obj[part.name][key] = data[key];
            if(allowedKeySeparete.every(k => k != key)) delete data[key];
          }
        }
      }
  
      for (const key in data) {
        if (!obj.hasOwnProperty(key) && !notAllowedKey.includes(key)) {
          obj[key] = data[key];
        }
      }
  
      result.unshift(obj);
    }
  
    return result;
}  

module.exports = { splitData }