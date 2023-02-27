import * as axios from './http.js';

/**
 * 获取聊天室列表
 * @date 2022-12-19
 * @param {PageParameter} pageParameter - 页码类
 * @returns {Promise} res - 返回接口数据
 */
export const getChatRoomPage = function ({ pageParameter, }) {
  return axios.http({
    url: '/admin/room/getChatRoomPage',
    methods: 'GET',
    data: {
      ...pageParameter.toSpecialMap([ 'timeType', ]),
    },
  });
};

/**
 * 获取聊天室记录
 * @date 2022-12-19
 * @param {any} roomId - 聊天室房间号
 * @returns {Promise} res - 返回接口数据
 */
export const getPageRoomMessagesAdmin = function ({ roomId, pageParameter, }) {
  return axios.http({
    url: '/admin/room/getPageRoomMessagesAdmin',
    methods: 'GET',
    data: {
      ...pageParameter.toSpecialMap([ 'timeType', ]),
      chatRoomId: roomId,
    },
  });
};
