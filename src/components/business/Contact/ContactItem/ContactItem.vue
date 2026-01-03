<template>
  <div class="contact-item" @click.stop="$emit('click', contact)">
    <Avatar 
      :size="'medium'" 
      :text="displayName" 
      :backgroundColor="contact.avatarColor"
    />
    <div class="contact-info">
      <div class="contact-name">
        {{ displayName }}
        <span v-if="contact.tags && contact.tags.length" class="contact-tags">
          <span 
            v-for="tag in contact.tags.slice(0, 2)" 
            :key="tag" 
            class="tag"
          >
            {{ tag }}
          </span>
          <span v-if="contact.tags.length > 2" class="tag-more">
            +{{ contact.tags.length - 2 }}
          </span>
        </span>
      </div>
      <div class="contact-detail">
        <span v-if="contact.wechatId" class="wechat-id">
          微信号: {{ contact.wechatId }}
        </span>
        <span v-if="contact.description" class="description">
          {{ contact.description }}
        </span>
      </div>
    </div>
    <div class="contact-meta">
      <span v-if="contact.isStarred" class="star-icon">⭐</span>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/ui/Avatar/Avatar.vue'

export default {
  name: 'ContactItem',
  components: {
    Avatar
  },
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  computed: {
    displayName() {
      return this.contact.remarkName || this.contact.nickname || '未知用户'
    }
  }
}
</script>

<style scoped>
.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid var(--wechat-border-color);
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: white;
}

.contact-item:hover {
  background-color: #f5f5f5;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.contact-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-tags {
  display: flex;
  gap: 4px;
}

.tag {
  font-size: 10px;
  background-color: var(--wechat-primary-color);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
}

.tag-more {
  font-size: 10px;
  color: var(--wechat-text-secondary);
}

.contact-detail {
  font-size: 13px;
  color: var(--wechat-text-secondary);
}

.wechat-id, .description {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-meta {
  display: flex;
  align-items: center;
}

.star-icon {
  font-size: 14px;
}
</style>