import { isObject } from "./dataType";
export function mergeArr(...arg) {
  return arg.reduce((prev, next) => {
    if (!Array.isArray(next)) {
      return console.error("请确认参数为数组！");
    }
    return [...prev, ...next];
  }, []);
}
export function getHandle([
  handle,
  path = { data: "data", total: "count" },
  fn = i => i
]) {
  return {
    handle,
    path,
    fn
  };
}
export function flatMap(dataSource, path) {
  if (!isObject(path)) return console.error("path必须为一个对象，老铁！");
  const retObj = {};
  Object.keys(path).forEach(i => {
    const [key, ...rePath] = i.split(".");
    retObj[key] = reMap(dataSource, path[i], rePath);
  });
  return retObj;
}

export function reduceMap(dataSource, pathcell) {
  return pathcell.split(".").reduce((prev, next) => prev[next], dataSource);
}

export function reMap(dataSource, pathcell, path) {
  const [key, ...rePath] = path;
  if (!key) return reduceMap(dataSource, pathcell);
  const ret = {};
  ret[key] = reMap(dataSource, pathcell, rePath);
  return ret;
}

export function flatter(obj) {
  if (!isObject(obj)) return console.error("flatter必须为一个对象，老铁！");
  let result = {};
  for (const i in obj) {
    if (!isObject(obj[i])) {
      result[i] = obj[i];
    } else {
      result = { ...result, ...obj[i] };
    }
  }
  return result;
}
