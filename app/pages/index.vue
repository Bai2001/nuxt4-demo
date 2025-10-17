<script lang="ts" setup>
const username = resetRef('t')
const reset = username.reset

const { data } = $useFetch('/api/users', { query: { username: username } })
</script>
<template>
  <div>
    <el-input v-model="username" /> <el-button type="primary" @click="reset">reset</el-button>
    <div>{{ data }}</div>
    <div>index.vue</div>
  </div>
</template>
<style lang="less" scoped></style>
