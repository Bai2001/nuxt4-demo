<script lang="ts" setup>
const error = useError()
</script>
<template>
  <div>{{ error?.statusMessage }}</div>
</template>
<style lang="less" scoped></style>
