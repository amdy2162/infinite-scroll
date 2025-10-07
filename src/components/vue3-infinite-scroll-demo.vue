<template>
  <div class="">vue3-infinite-scroll-demo</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { github } from '@/composables/useGithubRepos.js';

const reportList = ref([]);
const initReport = async () => {
  const { data } = await github.get("/orgs/vuejs/repos", {
    params: { per_page: 30 },
  });
  reportList.value = data.map((r) => ({
    title: r.full_name,
    description: r.description ?? "—",
    link: r.html_url,
  }));
  console.log(reportList.value);
};
onMounted(() => {
  initReport();
});
</script>

<style scoped></style>
