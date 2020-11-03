import GetData from '@/utils/axios.js'
const { $get, $post } = new GetData()

const uploadFile = (formdata) => {
  return $post('/api/upload/uploadFile', formdata);
}

export default {
  uploadFile
}
