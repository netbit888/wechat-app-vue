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
          @click="viewContactDetail(contact)"
        />
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
            @click="viewContactDetail(contact)"
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

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useContactStore } from '@/composables/useStore'
import SearchBar from '@/components/business/Common/SearchBar/SearchBar.vue'
import ContactItem from '@/components/business/Contact/ContactItem/ContactItem.vue'
import LetterNavigation from '@/components/business/Contact/LetterNavigation.vue'
import Badge from '@/components/ui/Badge/Badge.vue'
import { pinyin } from 'pinyin-pro'

export default {
  name: 'ContactList',
  components: {
    SearchBar,
    ContactItem,
    LetterNavigation,
    Badge
  },
  setup() {
    const router = useRouter()
    const contactStore = useContactStore()
    const contactListRef = ref(null)
    const searchKeyword = ref('')

    // 获取联系人数据
    const contacts = computed(() => contactStore.contacts || [])
    const friendRequestsCount = computed(() => contactStore.friendRequests?.length || 0)

    const handleSearch = (keyword) => {
      console.log('搜索关键词:', keyword)
    }

    // 获取首字母
    const getFirstLetter = (name) => {
      if (!name || typeof name !== 'string' || name.length === 0) return '#'
      
      try {
        const firstChar = name.charAt(0)
        const pinyinResult = pinyin(firstChar, { pattern: 'first', toneType: 'none' })
        const letter = pinyinResult?.charAt(0)?.toUpperCase() || '#'
        
        return /[A-Z]/.test(letter) ? letter : '#'
      } catch (error) {
        console.warn('获取首字母失败:', error)
        return '#'
      }
    }

    // 分组联系人
    const groupedContacts = computed(() => {
      if (!Array.isArray(contacts.value) || contacts.value.length === 0) {
        return []
      }

      const groups = {}
      
      contacts.value.forEach((contact, index) => {
        const displayName = contact?.nickname || contact?.remarkName || `未知用户_${index}`
        const letter = getFirstLetter(displayName)
        
        if (!groups[letter]) {
          groups[letter] = []
        }
        groups[letter].push(contact)
      })

      // 转换为数组并排序
      return Object.keys(groups)
        .sort()
        .map(letter => ({
          letter,
          contacts: groups[letter].sort((a, b) => {
            const nameA = (a?.nickname || a?.remarkName || '').toString().toLowerCase()
            const nameB = (b?.nickname || b?.remarkName || '').toString().toLowerCase()
            
            if (!nameA && !nameB) return 0
            if (!nameA) return 1
            if (!nameB) return -1
            
            return nameA.localeCompare(nameB, 'zh-CN')
          })
        }))
    })

    // 搜索结果
    const searchResults = computed(() => {
      const keyword = searchKeyword.value?.trim?.() || ''
      if (!keyword) return []
      
      return contacts.value.filter(contact => {
        const name = (contact?.nickname || contact?.remarkName || '').toString().toLowerCase()
        const wechatId = (contact?.wechatId || '').toString().toLowerCase()
        
        return name.includes(keyword.toLowerCase()) || wechatId.includes(keyword.toLowerCase())
      })
    })

    const navigationLetters = computed(() => {
      return groupedContacts.value.map(group => group.letter)
    })

    const handleLetterNavigate = (letter) => {
      const element = document.getElementById(`group-${letter}`)
      if (element && contactListRef.value) {
        contactListRef.value.scrollTo({
          top: element.offsetTop - 44,
          behavior: 'smooth'
        })
      }
    }

    const viewContactDetail = (contact) => {
      if (contact?.id) {
        router.push(`/contact/${contact.id}`)
      } else {
        console.error('联系人ID无效:', contact)
      }
    }

    const showAddMenu = () => {
      console.log('显示添加菜单')
    }

    const search = () => {
      console.log('搜索')
    }

    const goToNewFriends = () => {
      router.push('/contact/new-friends')
    }

    const goToTags = () => {
      console.log('跳转到标签')
    }

    const goToGroups = () => {
      console.log('跳转到群聊')
    }

    const goToDevices = () => {
      console.log('跳转到设备')
    }

    return {
      searchKeyword,
      contacts,
      friendRequestsCount,
      groupedContacts,
      searchResults,
      navigationLetters,
      contactListRef,
      handleSearch,
      handleLetterNavigate,
      viewContactDetail,
      showAddMenu,
      search,
      goToNewFriends,
      goToTags,
      goToGroups,
      goToDevices
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
  --wechat-cell-hover: #f5f5f5;
}

.contact-list-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow: hidden;
  position: relative;
}

/* 页面头部 - 微信标准44px */
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

/* 右侧操作按钮 */
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

/* 搜索区域 */
.search-section {
  padding: 10px 15px;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: sticky;
  top: 44px;
  z-index: 10;
}

/* 功能入口区域 */
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
  left: 57px; /* 图标30 + 边距12 + 左padding15 */
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

/* 联系人列表区域 */
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
  top: 98px; /* 44 + 10 + 44 */
  z-index: 10;
}

.search-results .section-title {
  top: 0;
}

/* 搜索结果 */
.search-results {
  background-color: white;
}
</style>