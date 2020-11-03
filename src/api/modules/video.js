import GetData from '@/utils/axios.js'
const { $get } = new GetData()

// 获取发现页视频列表 
const getVideoList = function({ parentUserId, pageNum, pageSize }) {
  return $get(`/api/video/find/${parentUserId}/${pageNum}/${pageSize}`)
}

// 获取视频详情
const getVideoDetail = function(courseVideoId) {
  return $get(`/api/video/video/${courseVideoId}`)
}

// 获取推荐视频
const getRecommendList = function({ parentUserId, courseVideoId }) {
  return $get(`/api/video/recommend/${parentUserId}/${courseVideoId}`)
}

// 印尼发现视频列表接口
const getVideoActivityList = function({ parentUserId, pageNum, pageSize }) {
  return $get(`/api/video/find/activity/${parentUserId}/${pageNum}/${pageSize}`)
}

// 印尼推荐视频详情接口
const getRecommendActivityList = function({ parentUserId, courseVideoId }) {
  return $get(`/api/video/recommend/activity/${parentUserId}/${courseVideoId}`)
}

export default {
  getVideoList,
  getVideoDetail,
  getRecommendList,
  getVideoActivityList,
  getRecommendActivityList
}
