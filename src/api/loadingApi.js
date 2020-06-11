import { get, post, dealResult, dealResultForBool } from './request_pub'

// pdfLoading 接口
export default {
    GetCode(data) {
        return post('File/HfsFileLoad', data).then(dealResult);
    },
}