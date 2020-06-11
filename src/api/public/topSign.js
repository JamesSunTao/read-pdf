/* jshint esversion: 6 */ 
import { get, post, dealResult, dealResultForBool } from '../request.js';
export default{
    
    // 获取摘录列表
    getExsistedSigns(data) {
        return get('LitNotes/GetNoteExtByStudyId', data).then(dealResult);
    },
    //获取已经选择的标签
    getSigns(data){
        return get('LitNotes/GetLitSignsByFileCode', data).then(dealResult);
    },
    //添加标签
    addLabel(data){
        return post('LitNotes/SetFileSignStudy', data).then(dealResult);
    },
    //删除标签
    deleteSign(data){
        return post('LitNotes/DeleteFileSign', data).then(dealResult);
    },
    
  
};