<template>
  <div class="moments-page">
    <!-- 头部导航 -->
    <header class="moments-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>朋友圈</h1>
      <button class="camera-button" @click="publishMoment">📷</button>
    </header>

    <!-- 页面内容 -->
    <main class="moments-content" ref="contentRef">
      <!-- 封面区域 -->
      <div class="cover-section">
        <div class="cover-image" :style="{ backgroundImage: `url(${userInfo.coverImage})` }">
          <div class="user-card" @click="viewProfile">
            <div class="user-name">{{ userInfo.nickname }}</div>
            <Avatar 
              :size="'large'" 
              :text="userInfo.nickname" 
              :backgroundColor="userInfo.avatarColor"
              class="user-avatar"
            />
          </div>
        </div>
      </div>

      <!-- 动态列表 -->
      <div class="moments-list">
        <div 
          v-for="moment in moments" 
          :key="moment.id" 
          class="moment-item"
          @click="closeAllMenus"
        >
          <!-- 左侧头像 -->
          <div class="moment-avatar">
            <Avatar 
              :size="'medium'" 
              :text="moment.author.name" 
              :backgroundColor="moment.author.avatarColor"
            />
          </div>

          <!-- 右侧内容 -->
          <div class="moment-content">
            <!-- 用户信息 -->
            <div class="author-name">{{ moment.author.name }}</div>
            
            <!-- 文字内容 -->
            <div class="moment-text" v-if="moment.content">
              {{ moment.content }}
            </div>
            
            <!-- 图片网格 -->
            <div 
              class="moment-images" 
              :class="`grid-${Math.min(moment.images.length, 9)}`"
              v-if="moment.images && moment.images.length > 0"
            >
              <img 
                v-for="(img, idx) in moment.images" 
                :key="idx" 
                :src="img" 
                alt="moment image"
                class="moment-image"
                @click.stop="previewImage(moment.images, idx)"
              />
            </div>
            
            <!-- 时间和操作 -->
            <div class="moment-actions">
              <span class="moment-time">{{ formatTime(moment.time) }}</span>
              <div class="action-buttons" @click.stop>
                <button 
                  class="action-toggle" 
                  @click="toggleAction(moment)"
                  :class="{ active: moment.showActions }"
                >
                  ⋯
                </button>
                <div class="action-menu" v-show="moment.showActions">
                  <button 
                    class="action-btn like-btn"
                    :class="{ liked: moment.isLiked }"
                    @click.stop="toggleLike(moment)"
                  >
                    <span class="like-icon">{{ moment.isLiked ? '❤️' : '🤍' }}</span>
                    <span>{{ moment.isLiked ? '取消' : '赞' }}</span>
                  </button>
                  <button class="action-btn comment-btn" @click.stop="comment(moment)">
                    💬 评论
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 点赞和评论 -->
            <div class="moment-interactions" v-if="moment.likes.length > 0 || moment.comments.length > 0">
              <!-- 点赞列表 -->
              <div class="likes" v-if="moment.likes.length > 0">
                <span class="like-icon">❤️</span>
                <span class="like-users">{{ formatLikes(moment.likes) }}</span>
              </div>
              
              <!-- 评论列表 -->
              <div class="comments" v-if="moment.comments.length > 0">
                <div 
                  v-for="comment in moment.comments" 
                  :key="comment.id" 
                  class="comment-item"
                >
                  <span class="comment-author">{{ comment.author }}:</span>
                  <span class="comment-text">{{ comment.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <button @click="loadMore" :disabled="loading">
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </main>

    <!-- 发布按钮（右下角悬浮） -->
    <div class="fab-publish" @click="publishMoment">
      <span>📷</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import Avatar from '@/components/ui/Avatar/Avatar.vue'

export default {
  name: 'Moments',
  components: {
    Avatar
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const contentRef = ref(null)
    const loading = ref(false)
    
    // 用户信息
    const userInfo = ref({
      nickname: '用户昵称',
      avatarColor: '#07c160',
      coverImage: 'https://picsum.photos/750/300?random=1'
    })

    // 朋友圈数据
    const moments = ref([
      {
        id: 1,
        author: {
          name: '张三',
          avatarColor: '#fa5151'
        },
        content: '今天天气真好！出去走走，心情都变得不一样了～',
        images: [
          'https://picsum.photos/200/200?random=2',
          'https://picsum.photos/200/200?random=3',
          'https://picsum.photos/200/200?random=4'
        ],
        time: new Date('2024-01-15 10:30'),
        likes: ['李四', '王五'],
        comments: [
          { id: 1, author: '李四', content: '真的不错！' },
          { id: 2, author: '王五', content: '下次一起去' }
        ],
        isLiked: false,
        showActions: false
      },
      {
        id: 2,
        author: {
          name: '李四',
          avatarColor: '#10aeff'
        },
        content: '分享一张今天拍的照片',
        images: ['https://picsum.photos/200/400?random=5'],
        time: new Date('2024-01-14 18:45'),
        likes: ['用户昵称'],
        comments: [],
        isLiked: true,
        showActions: false
      },
      {
        id: 3,
        author: {
          name: '王五',
          avatarColor: '#ffc300'
        },
        content: '今天学习了新的技术，感觉很有收获！继续加油💪',
        images: [],
        time: new Date('2024-01-13 22:15'),
        likes: [],
        comments: [
          { id: 3, author: '张三', content: '加油！' }
        ],
        isLiked: false,
        showActions: false
      }
    ])

    const hasMore = ref(true)

    // 返回
    const goBack = () => {
      router.back()
    }

    // 查看个人主页
    const viewProfile = () => {
      router.push('/me')
    }

    // 发布动态
    const publishMoment = () => {
      console.log('发布朋友圈')
    }

    // 预览图片
    const previewImage = (images, index) => {
      console.log('预览图片', images, index)
      // 实际应该调用图片预览组件
    }

    // 切换操作菜单
    const toggleAction = (moment) => {
      moments.value.forEach(m => {
        if (m.id !== moment.id) m.showActions = false
      })
      moment.showActions = !moment.showActions
    }

    // 关闭所有菜单
    const closeAllMenus = () => {
      moments.value.forEach(m => m.showActions = false)
    }

    // 点赞/取消点赞
    const toggleLike = (moment) => {
      moment.isLiked = !moment.isLiked
      if (moment.isLiked) {
        moment.likes.push(userInfo.value.nickname)
      } else {
        moment.likes = moment.likes.filter(name => name !== userInfo.value.nickname)
      }
      moment.showActions = false
    }

    // 评论
    const comment = (moment) => {
      console.log('评论', moment.id)
      moment.showActions = false
      // 实际应该弹出输入框
    }

    // 格式化时间
    const formatTime = (time) => {
      const now = new Date()
      const diff = now - time
      const oneDay = 24 * 60 * 60 * 1000
      
      if (diff < oneDay) {
        return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      } else if (diff < 2 * oneDay) {
        return '昨天'
      } else if (diff < 7 * oneDay) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `星期${days[time.getDay()]}`
      } else {
        return time.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      }
    }

    // 格式化点赞列表
    const formatLikes = (likes) => {
      if (likes.length === 0) return ''
      return likes.join('，')
    }

    // 加载更多
    const loadMore = async () => {
      loading.value = true
      // 模拟加载
      setTimeout(() => {
        loading.value = false
        hasMore.value = false
      }, 1000)
    }

    // 点击空白处关闭菜单
    const closeMenus = (e) => {
      if (!e.target.closest('.action-buttons')) {
        closeAllMenus()
      }
    }

    onMounted(() => {
      document.addEventListener('click', closeMenus)
      // 滚动到顶部
      nextTick(() => {
        if (contentRef.value) {
          contentRef.value.scrollTop = 0
        }
      })
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeMenus)
    })

    return {
      contentRef,
      userInfo,
      moments,
      hasMore,
      loading,
      goBack,
      viewProfile,
      publishMoment,
      previewImage,
      toggleAction,
      closeAllMenus,
      toggleLike,
      comment,
      formatTime,
      formatLikes,
      loadMore
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-bg: #ededed;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-text-time: #b2b2b2;
  --wechat-primary: #07c160;
  --wechat-cell-hover: #f5f5f5;
}

.moments-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow: hidden;
  position: relative;
}

/* 头部导航 - 微信标准44px */
.moments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  z-index: 200;
  box-sizing: border-box;
}

.moments-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: white;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.back-button,
.camera-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s;
}

.back-button:hover,
.camera-button:hover {
  opacity: 0.8;
}

/* 页面内容 */
.moments-content {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 300px; /* 封面高度 */
}

/* 封面区域 - 微信标准高度300px */
.cover-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  z-index: 100;
}

.cover-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  position: relative;
}

.user-card {
  position: absolute;
  bottom: 20px;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px;
}

.user-name {
  font-size: 16px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border: 3px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

/* 动态列表 */
.moments-list {
  background-color: white;
  padding: 0;
}

.moment-item {
  display: flex;
  padding: 15px;
  background-color: white;
  position: relative;
  cursor: pointer;
}

.moment-item:active {
  background-color: var(--wechat-cell-hover);
}

.moment-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 78px; /* 头像48 + 边距15 + 左padding15 */
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.moment-avatar {
  flex-shrink: 0;
  margin-right: 15px;
  width: 48px;
  height: 48px;
}

.moment-content {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 16px;
  color: var(--wechat-text-primary);
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
}

.moment-text {
  font-size: 15px;
  line-height: 1.5;
  color: var(--wechat-text-primary);
  margin-bottom: 8px;
  word-wrap: break-word;
  word-break: break-word;
}

/* 图片网格 - 微信标准 */
.moment-images {
  display: grid;
  gap: 3px;
  margin-bottom: 12px;
}

.moment-images.grid-1 {
  grid-template-columns: 1fr;
  max-width: 240px;
}

.moment-images.grid-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 320px;
}

.moment-images.grid-3,
.moment-images.grid-4,
.moment-images.grid-5,
.moment-images.grid-6,
.moment-images.grid-7,
.moment-images.grid-8,
.moment-images.grid-9 {
  grid-template-columns: repeat(3, 1fr);
  max-width: 240px;
}

.moment-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

/* 操作栏 */
.moment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.moment-time {
  font-size: 13px;
  color: var(--wechat-text-time);
}

.action-buttons {
  position: relative;
}

.action-toggle {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--wechat-text-secondary);
  cursor: pointer;
  padding: 5px 10px;
  transition: all 0.2s;
  border-radius: 4px;
}

.action-toggle:hover,
.action-toggle.active {
  background-color: var(--wechat-cell-hover);
  color: var(--wechat-text-primary);
}

.action-menu {
  position: absolute;
  right: 0;
  bottom: 35px;
  display: flex;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 6px;
  padding: 5px;
  gap: 5px;
  z-index: 100;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.action-menu::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 15px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgba(0, 0, 0, 0.9);
}

.action-btn {
  background: none;
  border: none;
  color: white;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.like-btn.liked {
  color: #ff6b6b;
}

/* 互动区域 */
.moment-interactions {
  background-color: #f7f7f7;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
}

.likes {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: var(--wechat-text-secondary);
  margin-bottom: 6px;
  line-height: 1.4;
  padding: 2px 0;
}

.like-icon {
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}

.like-users {
  color: #576b95;
  font-weight: 500;
}

.comments {
  border-top: 1px solid var(--wechat-border-light);
  padding-top: 6px;
}

.comment-item {
  font-size: 13px;
  line-height: 1.6;
  color: var(--wechat-text-secondary);
}

.comment-author {
  color: #576b95;
  font-weight: 500;
}

.comment-text {
  color: var(--wechat-text-primary);
}

/* 发布按钮（悬浮） */
.fab-publish {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: var(--wechat-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 100;
}

.fab-publish:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.fab-publish:active {
  transform: scale(0.95);
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 20px;
  background-color: white;
}

.load-more button {
  background: none;
  border: none;
  color: var(--wechat-text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 10px;
  transition: color 0.2s;
}

.load-more button:hover {
  color: var(--wechat-text-primary);
}

.load-more button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>