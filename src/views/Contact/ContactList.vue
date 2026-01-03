<template>
  <div class="contact-list-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <h1>通讯录</h1>
      <div class="header-actions">
        <button class="header-button" @click="showAddMenu">➕</button>
        <button class="header-button" @click="search">🔍</button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="search-section">
      <SearchBar 
        v-model="searchKeyword"
        placeholder="搜索"
        @search="handleSearch"
      />
    </div>

    <!-- 功能入口 -->
    <div class="function-section">
      <div class="function-item" @click="goToNewFriends">
        <div class="function-icon">👥</div>
        <div class="function-info">
          <div class="function-label">新的朋友</div>
        </div>
        <Badge :count="friendRequestsCount" :dot="false" />
      </div>
      <div class="function-item" @click="goToTags">
        <div class="function-icon">🏷️</div>
        <div class="function-info">
          <div class="function-label">标签</div>
        </div>
      </div>
      <div class="function-item" @click="goToGroups">
        <div class="function-icon">💬</div>
        <div class="function-info">
          <div class="function-label">群聊</div>
        </div>
      </div>
      <div class="function-item" @click="goToDevices">
        <div class="function-icon">📱</div>
        <div class="function-info">
          <div class="function-label">设备</div>
        </div>
      </div>
    </div>

    <!-- 联系人列表 -->
    <main class="contact-list" ref="contactListRef">
      <!-- 搜索结果显示 -->
      <div v-if="searchKeyword" class="search-results">
        <div class="section-title">搜索结果</div>
        <ContactItem 
          v-for="contact in searchResults" 
          :key="contact.id"
          :contact="contact"
          @click="(c)=>{console.log('点好友',c?.id);viewContactDetail(c)}"
        >
          <!-- ✅ 新增：添加按钮（仅非好友） -->
          <template #extra>
            <button
              v-if="!isAlreadyFriend(contact.id)"
              class="add-btn"
              @click.stop="addFriend(contact.id)"
            >添加</button>
          </template>
        </ContactItem>
      </div>

      <!-- 正常分组显示 -->
      <div v-else>
        <div v-for="group in groupedContacts" :key="group.letter">
          <div class="section-title" :id="`group-${group.letter}`">
            {{ group.letter }}
          </div>
          <ContactItem 
            v-for="contact in group.contacts" 
            :key="contact.id"
            :contact="contact"
            @click="(c)=>{console.log('父级传参',c);viewContactDetail(c)}"
          />
        </div>
      </div>
    </main>

    <!-- 右侧字母导航 -->
    <LetterNavigation 
      :letters="navigationLetters"
      @navigate="handleLetterNavigate"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import contactAPI from '@/api/modules/contact'
import SearchBar from '@/components/business/Common/SearchBar/SearchBar.vue'
import ContactItem from '@/components/business/Contact/ContactItem/ContactItem.vue'
import LetterNavigation from '@/components/business/Contact/LetterNavigation.vue'
import Badge from '@/components/ui/Badge/Badge.vue'
import { pinyin } from 'pinyin-pro'

/* 0. 数据源：永远数组 */
const store   = useStore()
const contacts = computed(() => store.getters['contact/contacts'])

const router = useRouter()
const contactListRef = ref(null)
const searchKeyword = ref('')
const searchResults = ref([])

/* 1. 初始化：只负责把后端数据写进 store */
onMounted(async () => {
  try {
    const res = await contactAPI.getList()
    console.log('后端返回', res)          // 留着你现有的日志
    // 关键：显式把 _id 映射成 id
    const list = (res.friends || []).map(u => ({
      id: u._id,                    // ← 就是这里
      nickname: u.nickname?.trim() || u.username,
      avatar: u.avatar || ''
    }))
    await store.dispatch('contact/loadContacts', list)
    console.log('store里的contacts', contacts.value)
  } catch (e) {
    console.error('加载联系人失败', e)
  }
})

/* 2. 好友请求数 */
const friendRequestsCount = computed(() => store.state.contact.friendRequests?.length || 0)

/* 3. 搜索：依然走接口，结果仅用于展示 */
const handleSearch = async (keyword) => {
  const kw = keyword.trim()
  if (!kw) { searchResults.value = []; return }
  try {
    const { users } = await contactAPI.search(kw)
    searchResults.value = users
  } catch (e) {
    console.error('搜索失败', e)
    searchResults.value = []
  }
}

/* 4. 判断是否好友 → 直接用 getter 数据 */
const isAlreadyFriend = (userId) => contacts.value.some(c => c.id === userId)

/* 5. 加好友 */
const addFriend = async (userId) => {
  try {
    await contactAPI.add(userId)
    alert('已发送好友请求')
  } catch (e) {
    alert(e?.response?.data?.msg || '添加失败')
  }
}

/* 6. 首字母 */
const getFirstLetter = (name) => {
  if (!name?.trim()) return '#'
  try {
    const letter = pinyin(name[0], { pattern: 'first', toneType: 'none' })?.[0]?.toUpperCase()
    return /[A-Z]/.test(letter) ? letter : '#'
  } catch {
    return '#'
  }
}

/* 7. 分组字母列表 */
const groupedContacts = computed(() => {
  const groups = {}
  contacts.value.forEach((c) => {
    const letter = getFirstLetter(c.nickname)
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(c)
  })
  return Object.keys(groups)
    .sort()
    .map(letter => ({
      letter,
      contacts: groups[letter].sort((a, b) =>
        a.nickname.toLowerCase().localeCompare(b.nickname.toLowerCase(), 'zh-CN')
      )
    }))
})
const navigationLetters = computed(() => groupedContacts.value.map(g => g.letter))

/* 8. 字母导航 */
const handleLetterNavigate = (letter) => {
  const el = document.getElementById(`group-${letter}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* 9. 跳资料页 */
const viewContactDetail = (contact) => {
  if (!contact?.id) return
  router.push(`/contact/${contact.id}`)
}

/* 10. 其他入口 */
const showAddMenu = () => console.log('显示添加菜单')
const search = () => console.log('搜索')
const goToNewFriends = () => router.push('/contact/new-friends')
const goToTags = () => console.log('跳转到标签')
const goToGroups = () => console.log('跳转到群聊')
const goToDevices = () => console.log('跳转到设备')
</script>

<style scoped>
:root {
  --wechat-bg: #ededed;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-cell-hover: #f5f5f5;
}

.contact-list-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow: hidden;
  position: relative;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 44px;
  box-sizing: border-box;
}

.page-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin: 0;
  text-align: center;
  line-height: 44px;
}

.header-actions {
  display: flex;
  gap: 25px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.header-button {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--wechat-text-primary);
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s;
  width: auto;
  height: auto;
  line-height: 1;
}

.header-button:hover {
  opacity: 0.7;
}

.search-section {
  padding: 10px 15px;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: sticky;
  top: 44px;
  z-index: 10;
}

.function-section {
  background-color: white;
  margin-bottom: 20px;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  height: 56px;
  box-sizing: border-box;
}

.function-item:active {
  background-color: var(--wechat-cell-hover);
}

.function-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 57px;
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.function-icon {
  font-size: 24px;
  margin-right: 12px;
  width: 30px;
  text-align: center;
  flex-shrink: 0;
}

.function-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.function-label {
  font-size: 16px;
  color: var(--wechat-text-primary);
  line-height: 1.4;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: white;
  padding-bottom: env(safe-area-inset-bottom);
}

.section-title {
  padding: 4px 15px;
  font-size: 13px;
  color: var(--wechat-text-secondary);
  background-color: var(--wechat-bg);
  font-weight: normal;
  position: sticky;
  top: 98px;
  z-index: 10;
}

.search-results .section-title {
  top: 0;
}

.search-results {
  background-color: white;
}

/* ✅ 新增：添加按钮样式 */
.add-btn {
  padding: 4px 12px;
  border: 1px solid #07c160;
  color: #07c160;
  background: #fff;
  border-radius: 3px;
  font-size: 14px;
}
</style>