import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export function useWebSocket(url) {
  const socket = ref(null);
  const store = useStore();
  const isConnected = ref(false);

  const connect = () => {
    socket.value = io(url);

    socket.value.on('connect', () => {
      console.log('WebSocket 已连接');
      isConnected.value = true;
      
      // 注册当前用户
      const currentUser = store.state.user.currentUser;
      if (currentUser) {
        socket.value.emit('register', currentUser._id);
      }
    });

    socket.value.on('receiveMessage', (message) => {
      // 收到新消息，添加到 store
      store.commit('chat/ADD_MESSAGE', message);
    });

    socket.value.on('disconnect', () => {
      console.log('WebSocket 已断开');
      isConnected.value = false;
    });
  };

  const sendMessage = (data) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('sendMessage', data);
    }
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  return {
    socket,
    isConnected,
    sendMessage
  };
}