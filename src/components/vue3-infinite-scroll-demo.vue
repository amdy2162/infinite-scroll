<template>
  <div>
    <div class="source">
      資料來源：
      <a :href="orgUrl" target="_blank" rel="noopener noreferrer">
        Vue 官方 GitHub（vuejs）
      </a>
    </div>
    <div class="wrapper" ref="rootEl">
      <ul class="list">
        <li v-for="item in reportList" :key="item.id" class="row">
          <div class="title">title：{{ item.title }}</div>
          <div class="desc">description：{{ item.description }}</div>
          <div class="link">
            link：
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              {{ item.link }}
            </a>
          </div>
        </li>
      </ul>

      <div ref="sentinelEl" class="sentinel" />
      <div class="state">
        <button v-if="error" class="btn" @click="loadMore">
          發生錯誤，重試
        </button>
        <span v-else-if="isLoading">載入中…</span>
        <span v-else-if="noData">目前沒有資料</span>
        <span v-else-if="end">沒有更多資料了</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { github } from "@/composables/useGithubRepos.js";

const orgUrl = "https://github.com/vuejs";
const isLoading = ref(false);
const noData = ref(false);
const end = ref(false);
const error = ref(false);

const reportList = ref([]);

const rootEl = ref(null);
const sentinelEl = ref(null);

const page = ref(1);

const mapRepos = (items) =>
  items.map((r) => ({
    title: r.full_name,
    description: r.description ?? "—",
    link: r.html_url,
    id: r.id,
  }));
  
const initReport = async () => {
  try {
    isLoading.value = true;
    error.value = false
    const { data } = await github.get("/orgs/vuejs/repos", {
      params: { per_page: 30, page: page.value },
    });
    if (data.length === 0) {
      noData.value = true;
    }
    reportList.value = mapRepos(data);
    page.value = 2;
    if (data.length < 30) {
      end.value = true;
    }
  } catch (err) {
    console.log("initReport error:", err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async () => {
  try {
    if (isLoading.value || end.value) return;
    isLoading.value = true;
    error.value = false;
    const { data } = await github.get("/orgs/vuejs/repos", {
      params: { per_page: 10, page: page.value },
    });
    if (data.length === 0) {
      end.value = true;
      return;
    }
    const newItems =  mapRepos(data);

    reportList.value.push(...newItems);
    page.value += 1;

    if (data.length < 10) {
      end.value = true;
    }
  } catch (err) {
    console.log("loadMore error:", err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};
let observer = null;
const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        !isLoading.value &&
        !end.value &&
        !error.value
      ) {
        loadMore();
      }
    },
    {
      root: rootEl.value,
      rootMargin: "100px",
      threshold: 0,
    }
  );

  if (sentinelEl.value) {
    observer.observe(sentinelEl.value);
  }
};
onMounted(async () => {
  await initReport();
  setupObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.wrapper {
  height: 70vh;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 8px 12px;
  text-align: left;
  margin-top: 20px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.row {
  padding: 12px 8px;
  border-bottom: 3px solid #444;
}
.title {
  font-weight: 600;
}
.desc {
  margin: 4px 0;
  color: #444;
}
.link a {
  text-decoration: underline;
  word-break: break-all;
}
.state {
  display: flex;
  justify-content: center;
  padding: 12px;
  color: #666;
}
.btn {
  border: 1px solid #ccc;
  background: #fafafa;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}
.sentinel {
  height: 1px;
}

.source {
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}
.source a {
  text-decoration: underline;
}
</style>
