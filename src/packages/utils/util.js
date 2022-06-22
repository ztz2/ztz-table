export const getProp = (column = {}) => column?.prop ?? column?.dataIndex ?? column?.key;
export const getLabel = (column = {}) => column?.label ?? column?.title ?? column?.name;
export const sortCurdVNodeBtn = (vnodeList = []) => vnodeList.sort((a, b) => {
  const v1 = a?.props?.['crud-sort'] ?? a?.props?.crudSort ?? 500;
  const v2 = b?.props?.['crud-sort'] ?? b?.props?.crudSort ?? 500;
  return v2 - v1;
});
export const checkType = (target, value) => Object.prototype.toString.call(target) === `[object ${value}]`;
export const uuid = () => {
  const tempUrl = URL.createObjectURL(new Blob());
  const str = tempUrl.toString();
  URL.revokeObjectURL(tempUrl);
  return str.substr(str.lastIndexOf('/') + 1);
};

// paramCase -> param-case
const paramCase = (value = '') => value.replace(/[A-Z]/, (s, i, str) => {
  const l = s.toLowerCase();
  return (i === 0 || i === str.length - 1) ? l : `-${l}`;
});

// camel-case -> camelCase
const camelCase = (value = '') => value.replace(/(-(.+?|$))/, (s) => s.charAt(1).toUpperCase());

export const getObjectValue = (target, path) => {
  if (!path) {
    return undefined;
  }
  const pathList = path.replace(/\[/gim, '.').replace(']', '').split('.').map((s) => [camelCase(s), paramCase(s)]);
  let res = target;
  try {
    // eslint-disable-next-line
    for (const p of pathList) {
      // @ts-ignore
      res = res[p[0]] ?? res[p[1]];
    }
  } catch {
    return undefined;
  }
  return res;
};
