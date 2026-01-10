import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { io } from 'socket.io-client'

export function useWebSocket(url) {
  const socket = ref(null);
  const store = useStore();
  
  // 连接状态：connecting, connected, disconnected, error
  const connectionStatus = ref('disconnected');
  const isConnected = ref(false);
  
  // 重连配置
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3秒
  let reconnectTimer = null;
  
  // 注册用户ID
  let userId = null;
  
  // 连接方法
  const connect = () => {
    // 防止重复连接
    if (connectionStatus.value === 'connecting' || connectionStatus.value === 'connected') {
      return;
    }
    
    connectionStatus.value = 'connecting';
    
    try {
      socket.value = io(url, {
        debug: false,
        transports: ['websocket'],
        timeout: 10000,
        reconnection: false // 禁用默认重连，使用自定义重连逻辑
      });

      // 连接成功
      socket.value.on('connect', () => {
        console.log('WebSocket 已连接');
        connectionStatus.value = 'connected';
        isConnected.value = true;
        reconnectAttempts.value = 0;
        
        // 注册当前用户
        if (userId) {
          socket.value.emit('register', userId);
        } else {
          const currentUser = store.state.user.currentUser;
          if (currentUser) {
            userId = currentUser._id;
            socket.value.emit('register', userId);
          }
        }
      });

      // 接收消息
      socket.value.on('receiveMessage', (message) => {
        // 收到新消息，添加到 store
        store.commit('chat/ADD_MESSAGE', message);
      });

      // 连接断开
      socket.value.on('disconnect', (reason) => {
        console.log(`WebSocket 已断开，原因：${reason}`);
        connectionStatus.value = 'disconnected';
        isConnected.value = false;
        
        // 触发重连
        if (reason !== 'io server disconnect' && reason !== 'io client disconnect') {
          handleReconnect();
        }
      });

      // 连接错误
      socket.value.on('connect_error', (error) => {
        console.error('WebSocket 连接错误:', error);
        connectionStatus.value = 'error';
        isConnected.value = false;
        
        // 触发重连
        handleReconnect();
      });

      // 连接超时
      socket.value.on('connect_timeout', () => {
        console.error('WebSocket 连接超时');
        connectionStatus.value = 'error';
        isConnected.value = false;
        
        // 触发重连
        handleReconnect();
      });
    } catch (error) {
      console.error('WebSocket 初始化错误:', error);
      connectionStatus.value = 'error';
      isConnected.value = false;
      
      // 触发重连
      handleReconnect();
    }
  };
  
  // 重连处理
  const handleReconnect = () => {
    // 清除现有重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    // 限制重连次数
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.error(`WebSocket 重连失败，已尝试 ${maxReconnectAttempts} 次`);
      connectionStatus.value = 'error';
      return;
    }
    
    // 增加重连次数
    reconnectAttempts.value++;
    
    // 计算重连延迟（指数退避）
    const delay = reconnectInterval * Math.pow(1.5, reconnectAttempts.value - 1);
    
    console.log(`WebSocket 将在 ${delay}ms 后尝试第 ${reconnectAttempts.value} 次重连`);
    
    // 设置重连定时器
    reconnectTimer = setTimeout(() => {
      console.log(`WebSocket 尝试第 ${reconnectAttempts.value} 次重连...`);
      connect();
    }, delay);
  };
  
  // 手动重连
  const reconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
    }
    reconnectAttempts.value = 0;
    connect();
  };

  // 发送消息
  const sendMessage = (data) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('sendMessage', data);
      return true;
    } else {
      console.error('WebSocket 未连接，无法发送消息');
      return false;
    }
  };
  
  // 监听消息
  const onMessage = (callback) => {
    if (socket.value) {
      socket.value.on('receiveMessage', callback);
    }
  };
  
  // 监听连接状态变化
  const onStatusChange = (callback) => {
    // 可以添加事件总线来监听连接状态变化
    console.log('WebSocket 连接状态变化监听已添加');
  };

  // 断开连接
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      connectionStatus.value = 'disconnected';
      isConnected.value = false;
    }
    
    // 清除重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  // 组件挂载时连接
  onMounted(() => {
    connect();
  });

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    connectionStatus,
    isConnected,
    connect,
    reconnect,
    disconnect,
    onMessage,
    onStatusChange,
    sendMessage
  };
}