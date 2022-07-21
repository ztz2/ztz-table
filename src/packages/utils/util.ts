export const getProp = (column: any = {}) => column?.prop ?? column?.dataIndex ?? column?.key;
export const getLabel = (column: any = {}) => column?.label ?? column?.title ?? column?.name;
export const sortCurdVNodeBtn = (vnodeList: any = []) => vnodeList.sort((a: any, b: any) => {
  const v1 = a?.props?.['crud-sort'] ?? a?.props?.crudSort ?? 500;
  const v2 = b?.props?.['crud-sort'] ?? b?.props?.crudSort ?? 500;
  return v2 - v1;
});
export const checkType = (target: any, value: string) => Object.prototype.toString.call(target) === `[object ${value}]`;
export const uuid = function (): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// paramCase -> param-case
const paramCase = (value = '') => value.replace(/[A-Z]/, (s: any, i: any, str: any) => {
  const l = s.toLowerCase();
  return (i === 0 || i === str.length - 1) ? l : `-${l}`;
});

// camel-case -> camelCase
const camelCase = (value = '') => value.replace(/(-(.+?|$))/, (s) => s.charAt(1).toUpperCase());

export const getObjectValue = (target: any, path = '') => {
  if (!path) {
    return undefined;
  }
  let res = target;
  try {
    const pathList = path.replace(/\[/gim, '.').replace(']', '').split('.').map((s) => [camelCase(s), paramCase(s)]);
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
