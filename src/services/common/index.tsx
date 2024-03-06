/**
 * @AUTHOR wangshegnyun
 * @DATE 2022/6/28
 * @Description: 常用接口
 */

import { GET, DOWNLOAD, POST } from '@src/fetchUtil/fetchUtil';

export const getEnterprises = (params: any) => GET('getEnterprises', null, params, false);

export const getUserEnterprise = (params: any) => GET('getUserEnterprise', null, params, false);

export const getDepartments = (params: any) => GET('getDepartments', null, params, false);

export const vmsDepartmentById = (params: any) => GET('vmsDepartmentById', null, params, false);

export const getDepartmentListByVmId = (params: any) => GET('getDepartmentListByVmId', null, params, false);

export const getServicesDepartments = (params: any) => GET('getServicesDepartments', null, params, false);

export const getVendors = (params: any) => GET('getVendors', null, params, false);

export const getTenants = (params: any) => GET('getTenants', null, params, false);

export const getEdgeTenants = (params: any) => GET('getEdgeTenants', null, params, false);

// 公有云区域
export const getPublicRegion = (params: any) => GET('getPublicRegion', null, params, false);
// 公有云区域
export const getPublicRegionByTenantUuid = (params: any) => GET('getPublicRegionByTenantUuid', null, params, false);

// 所有的区域
export const getRegionList = (params: any) => GET('getRegionList', null, params, false);
// 所有区域包含区域下资源
export const getRegionsList = (params: any) => GET('getRegionsList', null, params, false);

export const getOssservers = (params: any) => GET('getOssservers', null, params, false);

export const ossServerDetail = (params: any) => GET('ossServerDetail', null, params, false);

export const getOssserversDetailInfo = (params: any) => GET('getOssserversDetailInfo', null, params, false);
// todo: 等待后端更改支持post
export const validations = (params: any) => GET('validationsUnique', null, params, false);

export const validationsPost = (body: any) => POST('validationsUnique', body, null, false);

export const downLoadFile = (body, params: any) => DOWNLOAD('downloadUrl', 'post', body, params, false);

// 可用区
export const getDatacenterLists = (params: any) => GET('getDatacenterLists', null, params, false);

// 云平台账号---申请公有云资源下
export const getAccountByPool = (params: any) => GET('getAccountByPool', null, params, false);

// 可用区
export const getAvailabilityZone = (params: any) => GET('ossServerCenter', null, params, false);

export const getEventMessages = (params: any) =>
  // GET_SWR('getEventMessages', null, params, false, {refreshInterval:3000});
  GET('getEventMessages', null, params, false);
