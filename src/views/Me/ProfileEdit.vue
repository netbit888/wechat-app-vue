<template>
  <div class="profile-edit-page">
    <header class="edit-header">
      <button class="back" @click="goBack">⬅</button>
      <h1>编辑资料</h1>
      <button class="save" @click="save">保存</button>
    </header>

    <main class="edit-form">
      <label>
        <span>头像</span>
        <input type="file" accept="image/*" @change="uploadAvatar" />
      </label>
      <label>
        <span>昵称</span>
        <input v-model="form.nickname" maxlength="20" />
      </label>
      <label>
        <span>签名</span>
        <input v-model="form.signature" maxlength="30" />
      </label>
      <label>
        <span>性别</span>
        <select v-model="form.gender">
          <option :value="1">男</option>
          <option :value="2">女</option>
          <option :value="0">保密</option>
        </select>
      </label>
      <label>
        <span>地区</span>
        <input v-model="form.region" />
      </label>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import { userApi } from '@/api/index'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ ...userStore.currentUser.value })

const goBack = () => router.back()

const save = async () => {
  await userStore.updateProfile(form)
  router.back()
}

const uploadAvatar = e => {
  const file = e.target.files[0]
  if (!file) return
  console.log('[TODO] upload', file)
}
</script>

<style scoped>
.edit-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
}
.back,
.save {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--wechat-primary, #07c160);
}
h1 {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
}
.edit-form {
  margin-top: 10px;
  background: #fff;
  padding: 0 15px;
}
label {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}
label span {
  width: 80px;
  color: var(--wechat-text-secondary, #666);
}
input,
select {
  flex: 1;
  border: none;
  outline: none;
  text-align: right;
}

label:last-of-type {
  border-bottom: none;
}
</style>