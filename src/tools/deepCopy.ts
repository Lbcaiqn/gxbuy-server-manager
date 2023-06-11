export function deepCopy(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const copyArray = obj.map((item: any) => deepCopy(item));
    return copyArray;
  }

  const copyObj: any = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'function') {
        copyObj[key] = obj[key].bind(copyObj);
      } else {
        copyObj[key] = deepCopy(obj[key]);
      }
    }
  }

  return copyObj;
}
