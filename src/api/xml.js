/* jshint esversion: 6 */ 
import { get, post, dealResult, dealResultForBool } from './request.js';

// xml阅读
export default {
  test(data) {
    return post({
      url: '/upload/CheckFile',
      data: data
    }).then(request.dealResult).then((data) => {
      if(data) {
        return {a: data.x, b: data.y};
      } else throw data;
    });
  }
}