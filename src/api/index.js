// 所有接口用Promise+setTimeout异步模拟请求

// 分页列表接口
export const pageApi = (data) => {
  console.log('【pageListApi】请求参数：', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 1000,
        content: [
          {
            date: Date.now(),
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
            _options: {
              'inject-delete': false,
            },
          },
          {
            date: Date.now(),
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            date: Date.now(),
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
          {
            date: Date.now(),
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
          },
        ],
      });
    }, 922 + Math.random() * 2000);
  });
};

// 新增接口
export const addApi = (data) => {
  console.log('【addApi】请求参数：', data);
  return new Promise((resolve) => { setTimeout(() => { resolve(null); }, 921 + Math.random() * 2000); });
};

// 编辑接口
export const editApi = (data) => {
  console.log('【editApi】请求参数：', data);
  return new Promise((resolve) => { setTimeout(() => { resolve(null); }, 24921 + Math.random() * 2000); });
};

// 删除接口
export const deleteApi = (data) => {
  console.log('【deleteApi】请求参数：', data);
  return new Promise((resolve) => { setTimeout(() => { resolve(null); }, 924 + Math.random() * 21000); });
};
