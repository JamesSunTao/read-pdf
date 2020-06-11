/* jshint esversion: 6 */ 
import { get, post, dealResult, dealResultForBool } from '../request.js';
export default {
  // 获取摘录列表
  getExtractList(data) {
    return post('Common/SearchCentos', data).then(dealResult);
  },
  // 删除摘录信息
  delExtract(data) {
    return post('Common/DelCentoInfo', data).then(dealResultForBool);
  }
  
};





