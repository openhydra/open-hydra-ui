/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, UPLOAD, DELETE } from '@src/fetchUtil/fetchUtil';

export const getClass = (params:any) =>
  GET('getClass', null, params, false);

export const addClass = (body:any) =>
  UPLOAD('addClass', body, null, false);

export const delClass = (params:any) =>
  DELETE('delClass', null, params, false);


