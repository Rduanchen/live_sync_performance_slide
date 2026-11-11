<template>
  <div class="event-page">
    <v-tabs
      v-model="tab"
      color="primary"
      bg-color="surface"
      grow
      class="event-tabs"
      aria-label="公演資訊"
    >
      <v-tab id="landing-tab" value="landing" aria-controls="landing-panel"
        >主頁</v-tab
      >
      <v-tab id="program-tab" value="program" aria-controls="program-panel"
        >節目表</v-tab
      >
      <v-tab id="sync-tab" value="sync" aria-controls="sync-panel"
        >現在演出</v-tab
      >
    </v-tabs>

    <v-window v-model="tab" :touch="false" class="event-window flex-grow-1">
      <v-window-item
        id="landing-panel"
        value="landing"
        role="tabpanel"
        aria-labelledby="landing-tab"
      >
        <section class="page-content landing">
          <div class="landing-copy">
            <img
              src="/ciao_logo.png"
              alt="CIAO 社團標誌"
              class="club-logo"
              width="64"
              height="92"
            />
            <p class="text-h6 mb-2">CIAO 期中公演</p>
            <h1 class="event-title text-primary">別為青春雀步</h1>
            <div class="event-meta">
              <span
                ><v-icon size="small" icon="mdi-clock-outline" />
                18:30～21:00</span
              >
              <span
                ><v-icon size="small" icon="mdi-map-marker-outline" />
                一大川堂</span
              >
            </div>

            <div class="landing-actions">
              <v-btn
                color="primary"
                size="large"
                rounded="pill"
                prepend-icon="mdi-broadcast"
                @click="tab = 'sync'"
              >
                即時節目資訊
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                rounded="pill"
                variant="outlined"
                prepend-icon="mdi-image"
                @click="tab = 'program'"
              >
                查看節目表
              </v-btn>
              <v-btn
                v-if="feedbackURL"
                :href="feedbackURL"
                color="primary"
                size="large"
                rounded="pill"
                variant="outlined"
                prepend-icon="mdi-form-select"
                target="_blank"
                rel="noopener noreferrer"
              >
                填寫回饋表單
              </v-btn>
              <v-btn
                size="large"
                rounded="pill"
                variant="text"
                prepend-icon="mdi-instagram"
                href="https://www.instagram.com/ntut_ciao/"
                target="_blank"
                rel="noopener noreferrer"
              >
                社團 IG
              </v-btn>
            </div>
          </div>

          <img
            v-if="coverPoster"
            crossorigin="anonymous"
            :src="coverPoster"
            alt="別為青春雀步公演插畫海報"
            class="poster landing-poster"
            width="1067"
            height="1535"
            fetchpriority="high"
          />
        </section>
      </v-window-item>

      <v-window-item
        id="program-panel"
        value="program"
        role="tabpanel"
        aria-labelledby="program-tab"
      >
        <section class="page-content" aria-labelledby="program-heading">
          <h2 id="program-heading" class="section-title text-primary">
            節目表
          </h2>
          <div class="program-layout">
            <a
              v-if="schedulePoster"
              :href="schedulePoster"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="開啟原尺寸曲序表"
            >
              <img
                crossorigin="anonymous"
                :src="schedulePoster"
                fetchpriority="high"
                alt="公演曲序表圖檔"
                class="poster"
                width="1067"
                height="1535"
              />
            </a>

            <div>
              <v-alert v-if="loadError" type="error" variant="tonal">{{
                loadError
              }}</v-alert>
              <v-progress-linear
                v-else-if="!program.length"
                indeterminate
                color="primary"
                aria-label="正在載入節目表"
              />
              <template v-else>
                <ol class="program-list" role="list">
                  <li v-for="item in runningOrder" :key="item.id">
                    <v-card
                      :color="item.type === 'message' ? 'accent' : 'surface'"
                      class="program-card"
                      tag="button"
                      type="button"
                      @click="goToSync(item.id)"
                    >
                      <span>
                        <span class="program-title">{{ item.title }}</span>
                        <span
                          v-if="item.groupName"
                          class="d-block text-body-2"
                          >{{ item.groupName }}</span
                        >
                      </span>
                      <v-icon
                        icon="mdi-chevron-right"
                        class="program-chevron"
                        aria-hidden="true"
                      />
                    </v-card>
                  </li>
                </ol>

                <v-card
                  v-for="item in closingSlides"
                  :key="item.id"
                  :color="item.type === 'feedback' ? 'accent' : 'surface'"
                  class="program-card closing-card"
                  tag="button"
                  type="button"
                  @click="goToSync(item.id)"
                >
                  <v-icon
                    :icon="
                      item.type === 'feedback'
                        ? 'mdi-form-select'
                        : 'mdi-heart-outline'
                    "
                    color="primary"
                    aria-hidden="true"
                  />
                  <span class="program-title">{{ item.title }}</span>
                  <v-icon
                    icon="mdi-chevron-right"
                    class="program-chevron"
                    aria-hidden="true"
                  />
                </v-card>
              </template>
            </div>
          </div>
        </section>
      </v-window-item>

      <v-window-item
        id="sync-panel"
        value="sync"
        role="tabpanel"
        aria-labelledby="sync-tab"
      >
        <section class="page-content">
          <v-alert v-if="loadError" type="error" variant="tonal">{{
            loadError
          }}</v-alert>
          <v-progress-linear
            v-else-if="!program.length"
            indeterminate
            color="primary"
            aria-label="正在載入演出資訊"
          />
          <template v-else>
            <div class="slide-controls">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                aria-label="上一頁"
                :disabled="carouselIndex === 0"
                @click="changeSlide(-1)"
              />
              <span v-if="isSyncMode" class="sync-label"
                ><v-icon color="primary" icon="mdi-broadcast" size="small" />
                跟隨現場</span
              >
              <v-btn
                v-else
                color="primary"
                size="small"
                rounded="pill"
                prepend-icon="mdi-sync"
                @click="restoreSync"
              >
                回到同步
              </v-btn>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                aria-label="下一頁"
                :disabled="carouselIndex === program.length - 1"
                @click="changeSlide(1)"
              />
            </div>

            <v-window
              v-model="carouselIndex"
              @update:model-value="onCarouselChange"
            >
              <v-window-item
                v-for="(item, index) in program"
                :key="item.id"
                :value="index"
              >
                <article
                  class="slide-layout"
                  :class="{ 'slide-layout--with-poster': item.slideURL }"
                >
                  <a
                    v-if="item.slideURL"
                    :href="getImgUrl(item.slideURL)"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="'開啟原圖：' + item.title"
                  >
                    <img
                      crossorigin="anonymous"
                      :src="getImgUrl(item.slideURL)"
                      :fetchpriority="index === carouselIndex ? 'high' : 'auto'"
                      :alt="item.title + '圖卡'"
                      class="poster"
                      width="1067"
                      height="1535"
                    />
                  </a>

                  <div class="slide-copy">
                    <div
                      class="slide-heading"
                      :class="{
                        'bg-accent':
                          item.type === 'message' || item.type === 'feedback',
                      }"
                    >
                      <p v-if="item.groupName" class="mb-2">
                        {{ item.groupName }}
                      </p>
                      <h2 class="section-title text-primary mb-0">
                        {{ item.title }}
                      </h2>
                      <p v-if="item.message" class="mt-3">{{ item.message }}</p>
                    </div>

                    <div v-if="item.feedbackURL" class="slide-section">
                      <v-btn
                        :href="item.feedbackURL"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        rounded="pill"
                        append-icon="mdi-open-in-new"
                      >
                        填寫回饋表單
                      </v-btn>
                    </div>

                    <div v-if="item.type === 'schedule'" class="slide-section">
                      <ol class="schedule-copy">
                        <li v-for="entry in runningOrder" :key="entry.id">
                          {{ entry.title }}
                        </li>
                      </ol>
                    </div>
                    <div v-if="item.members?.length" class="slide-section">
                      <h3 class="text-h6 mb-2">演出成員</h3>
                      <v-list
                        class="member-list bg-transparent pa-0"
                        lines="one"
                      >
                        <v-list-item
                          v-for="(member, memberIndex) in item.members"
                          :key="memberIndex"
                        >
                          <template v-if="member.imgUrl" #prepend>
                            <v-avatar
                              ><v-img :src="getImgUrl(member.imgUrl)" cover
                            /></v-avatar>
                          </template>
                          <v-list-item-title>{{
                            member.name || member.role
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            v-if="member.name && member.role"
                            >{{ member.role }}</v-list-item-subtitle
                          >
                          <template v-if="member.ig" #append>
                            <a
                              :href="member.ig"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="ig-link"
                            >
                              <v-icon
                                icon="mdi-instagram"
                                size="small"
                                aria-hidden="true"
                              />
                              @{{ member.ig.split("/").filter(Boolean).pop() }}
                            </a>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-if="item.sponsors?.length" class="slide-section">
                      <ul class="sponsor-list">
                        <li v-for="sponsor in item.sponsors" :key="sponsor">
                          {{ sponsor }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </article>
              </v-window-item>
            </v-window>
          </template>
        </section>
      </v-window-item>
    </v-window>

    <footer class="event-footer bg-surface">
      Designed by 阿端(陳宥端) |
      <a
        href="https://github.com/Rduanchen"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary"
      >
        <v-icon icon="mdi-github" size="small" aria-hidden="true" /> @Rduanchen
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { preloadPosters } from "../composables/preloadPosters";
import { useSocket } from "../composables/useSocket";
import type { ProgramSlide } from "../types/program";

const API_URL = import.meta.env.VITE_API_URL || "";
const tab = ref("landing");
const program = ref<ProgramSlide[]>([]);
const carouselIndex = ref(0);
const loadError = ref("");
const posterRequests = new AbortController();
let wakeLock: WakeLockSentinel | null = null;
let wakeLockPending = false;
let mounted = false;

const { connect, disconnect, isSyncMode, localId, setSyncMode } = useSocket();
const runningOrder = computed(() =>
  program.value.filter(
    (item) => item.type === "performance" || item.type === "message",
  ),
);
const closingSlides = computed(() =>
  program.value.filter(
    (item) => item.type === "sponsors" || item.type === "feedback",
  ),
);
const feedbackURL = computed(() =>
  closingSlides.value.find((item) => item.type === "feedback")?.feedbackURL,
);

const getImgUrl = (url: string) => (url.startsWith("/") ? API_URL + url : url);

const getProgramPoster = (type: "cover" | "schedule", fallback: string) => {
  if (!program.value.length && !loadError.value) return undefined;
  const url = program.value.find((item) => item.type === type)?.slideURL;
  return getImgUrl(url ?? fallback);
};

const coverPoster = computed(() => getProgramPoster("cover", "/images/1.png"));
const schedulePoster = computed(() => getProgramPoster("schedule", "/images/2.png"));

const fetchProgram = async () => {
  try {
    const res = await fetch(`${API_URL}/api/program`, {
      signal: posterRequests.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    program.value = await res.json();
    const first = [coverPoster.value, schedulePoster.value].filter(
      (url): url is string => url !== undefined,
    );
    const posters = program.value.flatMap((item) =>
      item.slideURL ? [getImgUrl(item.slideURL)] : [],
    );
    void preloadPosters(first, posters, posterRequests.signal);
  } catch (error) {
    if (posterRequests.signal.aborted) return;
    loadError.value = "暫時無法載入節目資訊，請重新整理頁面。";
    console.error("Error fetching program:", error);
  }
};

const followLiveSlide = () => {
  const index = program.value.findIndex((item) => item.id === localId.value);
  if (index !== -1) carouselIndex.value = index;
};

watch([localId, program], () => {
  if (isSyncMode.value) followLiveSlide();
});

const onCarouselChange = (index: number) => {
  if (program.value[index]?.id !== localId.value) setSyncMode(false);
};

const changeSlide = (direction: number) => {
  const index = carouselIndex.value + direction;
  if (index < 0 || index >= program.value.length) return;
  setSyncMode(false);
  carouselIndex.value = index;
};

const goToSync = (id: string) => {
  setSyncMode(false);
  carouselIndex.value = program.value.findIndex((item) => item.id === id);
  tab.value = "sync";
};

const restoreSync = () => {
  setSyncMode(true);
  followLiveSlide();
};

const shouldKeepScreenOn = () =>
  mounted && tab.value === "sync" && document.visibilityState === "visible";

const updateWakeLock = async () => {
  if (!shouldKeepScreenOn()) {
    const lock = wakeLock;
    wakeLock = null;
    await lock?.release();
    return;
  }
  if (wakeLockPending || (wakeLock && !wakeLock.released)) return;

  wakeLockPending = true;
  try {
    const lock = await navigator.wakeLock?.request("screen");
    if (!lock) return;
    if (shouldKeepScreenOn()) wakeLock = lock;
    else await lock.release();
  } catch (error) {
    console.warn("Wake Lock error:", error);
  } finally {
    wakeLockPending = false;
  }
};

watch(tab, () => {
  window.scrollTo(0, 0);
  void updateWakeLock();
});

watch(carouselIndex, () => {
  if (tab.value === "sync") window.scrollTo(0, 0);
});

onMounted(() => {
  mounted = true;
  void fetchProgram();
  connect();
  document.addEventListener("visibilitychange", updateWakeLock);
});

onUnmounted(() => {
  mounted = false;
  posterRequests.abort();
  disconnect();
  void updateWakeLock();
  document.removeEventListener("visibilitychange", updateWakeLock);
});
</script>

<style scoped>
.event-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.event-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgb(var(--v-theme-outline));
}

.event-window {
  overflow: clip;
}

.page-content {
  width: min(100%, 920px);
  margin-inline: auto;
  padding: clamp(16px, 4vw, 36px);
}

.landing {
  display: grid;
  align-items: center;
  justify-items: center;
  gap: clamp(24px, 5vw, 64px);
  padding-block: clamp(28px, 6vw, 60px);
}

.landing-copy {
  text-align: center;
}

.club-logo {
  display: block;
  width: auto;
  height: 76px;
  object-fit: contain;
  margin: 0 auto 16px;
}

.event-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  text-wrap: balance;
}

.event-meta,
.landing-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.event-meta {
  margin: 18px 0 26px;
  flex-wrap: wrap;
}

.event-meta .v-icon {
  color: rgb(var(--v-theme-primary));
}

.landing-actions {
  flex-direction: column;
}

.landing-actions .v-btn {
  width: min(100%, 270px);
}

.poster {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 12px;
}

.landing-poster {
  max-width: 420px;
}

.section-title {
  font-size: clamp(1.55rem, 4vw, 2.25rem);
  line-height: 1.2;
  margin-bottom: 18px;
  overflow-wrap: anywhere;
}

.program-layout,
.slide-layout {
  display: grid;
  align-items: start;
  gap: 20px;
}

.program-layout > a,
.slide-layout > a {
  display: block;
  width: min(100%, 420px);
  margin-inline: auto;
}

.program-list {
  padding: 0;
  margin: 0;
  list-style: none;
  counter-reset: running-order;
}

.program-list > li {
  counter-increment: running-order;
  margin-bottom: 8px;
}

.program-card {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: start;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgb(var(--v-theme-outline));
}

.program-list .program-card::before {
  content: counter(running-order);
  color: rgb(var(--v-theme-primary));
  text-align: center;
  min-width: 2ch;
}

.program-title {
  font-weight: 700;
}

.program-chevron {
  margin-inline-start: auto;
}

.closing-card {
  margin-top: 18px;
}

.slide-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 56px;
  z-index: 2;
  gap: 8px;
  margin-bottom: 16px;
  padding-inline: 4px;
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 10px;
  background: rgb(var(--v-theme-surface));
}

.sync-label {
  white-space: nowrap;
}

.slide-copy {
  border: 1px solid rgb(var(--v-theme-outline));
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  overflow: hidden;
}

.slide-heading,
.slide-section {
  padding: 16px;
}

.slide-section {
  border-top: 1px solid rgb(var(--v-theme-outline));
}

.member-list .v-list-item {
  padding-inline: 0;
}

.ig-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: 8px;
  color: rgb(var(--v-theme-primary));
  font-size: 0.875rem;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.ig-link:hover,
.event-footer a:hover {
  text-decoration: underline;
}

.schedule-copy,
.sponsor-list {
  padding-inline-start: 1.5em;
  line-height: 1.75;
}

.event-footer {
  padding: 16px;
  border-top: 1px solid rgb(var(--v-theme-outline));
  text-align: center;
  font-size: 0.875rem;
}

.event-footer a {
  text-decoration: none;
}

@media (min-width: 700px) {
  .landing,
  .program-layout,
  .slide-layout--with-poster {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .landing-copy {
    justify-self: stretch;
  }
}
</style>
