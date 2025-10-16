<script lang="ts" setup>
const username = resetRef('t')
const reset = username.reset

const { data } = $useFetch('/api/users', { query: { username: username } })
</script>
<template>
  <div>
    <input v-model="username" > <button type="button" @click="reset">reset</button>
    <div>{{ data }}</div>
    <div>index.vue</div>
  </div>
</template>
<style lang="less" scoped></style>
