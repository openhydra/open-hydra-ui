/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, PUT } from '@src/fetchUtil/fetchUtil';

export const getDefaultSetting = (params:any) =>
  GET('getDefaultSetting', null, params, false);

export const putDefaultSetting = (body:any) =>
  PUT('putDefaultSetting', body, null, false);

