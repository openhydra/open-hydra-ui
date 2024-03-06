/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { POST } from '@src/fetchUtil/fetchUtil';

export const login = (body: any, params:any) => POST('getLogin', body, params, false);
