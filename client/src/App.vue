<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Global styles or logic can be initialized here
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background-color: #09090D;
  color: #F6F5F2;
}
</style>
