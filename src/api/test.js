// src/api/test.js
import request from './request.js';

export const testConnection = async () => {
  try {
    console.log('正在测试云端连接...');
    const result = await request.get('/health');
    console.log('✅ 云端连接成功:', result);
    return true;
  } catch (error) {
    console.error('❌ 云端连接失败:', error.message);
    return false;
  }
};