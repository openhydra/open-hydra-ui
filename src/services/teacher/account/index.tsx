/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE } from '@src/fetchUtil/fetchUtil';

export const getAccount = (params:any) =>
  GET('getAccount', null, params, false);

export const addAccount = (body:any) =>
  POST('addAccount', body, null, false);

export const delAccount = (params:any) =>
  DELETE('delAccount', null, params, false);
