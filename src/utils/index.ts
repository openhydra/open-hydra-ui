/**
 * @desc 此处存放一些公用的校验规则、一些公用的可转化的数据格式 、角色
 *
 * */
import * as _ from 'lodash-es';
import { useCallback, useRef } from 'react';

/**
 * @desc Json中删除所有值为null的属性
 * @param {object} objParams - 传入参数objParams
 * */
export const RemovePropertyOfNull = (objParams: any) => {
  //重要！！！
  objParams = { ...objParams };
  Object.keys(objParams).forEach((item) => {
    if (_.isNil(objParams[item]) || objParams[item] === 'NULL') delete objParams[item];
  });
  return objParams;
};

/**
 * 适用于React的防抖hooks
 */
export function useDebounce(fn, ms) {
  const fRef = useRef<any>();
  fRef.current = fn;

  const result = useCallback(
    _.debounce(() => fRef.current(), ms),
    []
  );
  return result;
}
