<template>
  <view class="vocabularies-page">
    <!-- 搜索和筛选 -->
    <view class="filter-section">
      <view class="search-wrapper">
        <view class="search-box">
          <u-icon name="search" size="18" color="#757575" />
          <u-input
            v-model="searchWord"
            placeholder="Search vocabulary..."
            :border="false"
            :custom-style="{
              flex: 1,
              fontSize: '16px',
              padding: '0 12px'
            }"
            @input="handleSearchChange"
            @confirm="handleSearch"
          />
          <u-icon 
            v-if="searchWord" 
            name="close-circle-fill" 
            size="16" 
            color="#BDBDBD" 
            @click="handleClear"
          />
        </view>
      </view>
      <view class="filter-tags">
        <scroll-view class="filter-scroll" scroll-x>
          <view class="filter-chips">
            <view
              v-for="(item, index) in subsectionList"
              :key="index"
              class="filter-chip"
              :class="{ active: subsectionCurrent === index }"
              @click="onSubsectionChange(index)"
            >
              <text>{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading && vocabularies.length === 0" class="loading-container">
      <u-loading-icon mode="spinner" color="#4CAF50" />
      <text class="loading-text">Loading...</text>
    </view>

    <!-- 词汇列表 -->
    <scroll-view 
      v-else-if="vocabularies.length > 0" 
      class="vocabulary-scroll"
      scroll-y
      @scrolltolower="handleLoadMore"
    >
      <view class="vocabulary-list">
        <view
          v-for="(vocab, index) in vocabularies"
          :key="vocab.id"
          class="vocabulary-card"
          @click="goToDetail(vocab.id)"
        >
          <view class="card-content">
            <view class="card-header">
              <view class="word-section">
                <text class="word">{{ vocab.word || 'Unknown' }}</text>
                <text class="phonetic" v-if="vocab.phonetic">{{ vocab.phonetic }}</text>
              </view>
              <view class="difficulty-badge" :class="`badge-${(vocab.difficulty_level || 'B1').toLowerCase()}`">
                <text>{{ vocab.difficulty_level || 'B1' }}</text>
              </view>
            </view>
            
            <view class="card-body">
              <text class="definition">{{ vocab.definition || 'No definition available' }}</text>
              <text class="definition-zh" v-if="vocab.definition_zh">{{ vocab.definition_zh }}</text>
            </view>
            
            <view class="card-footer">
              <view class="footer-left">
                <view class="pos-tag" v-if="vocab.part_of_speech">
                  <text>{{ vocab.part_of_speech }}</text>
                </view>
              </view>
              <view class="footer-right">
                <view class="example-badge">
                  <u-icon name="file-text" size="12" color="#4CAF50" />
                  <text>{{ vocab.example_count || 0 }}</text>
                </view>
                <u-icon name="arrow-right" size="16" color="#BDBDBD" />
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <u-button
            v-if="!isLoadingMore"
            text="Load More"
            type="primary"
            plain
            size="small"
            :custom-style="{
              borderRadius: '20px',
              padding: '10px 32px',
              borderColor: '#4CAF50',
              color: '#4CAF50'
            }"
            @click="handleLoadMore"
          />
          <view v-else class="loading-more">
            <u-loading-icon mode="spinner" color="#4CAF50" />
            <text class="loading-text">Loading more...</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-else-if="!isLoading" class="empty-state">
      <u-icon name="inbox" size="64" color="#BDBDBD" />
      <text class="empty-title">No vocabularies found</text>
      <text class="empty-desc" v-if="searchWord || selectedLevel">Try adjusting your search or filter</text>
      <u-button
        type="primary"
        text="Refresh"
        shape="round"
        @click="loadVocabularies"
        :custom-style="{
          marginTop: '20px',
          borderRadius: '24px',
          padding: '12px 32px'
        }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onPullDownRefresh } from '@dcloudio/uni-app';
import { useLearningStore } from '@/stores/learning';
import { useLoading } from '@/composables/useLoading';
import { debounce } from '@/composables/useDebounce';
import { DIFFICULTY_LEVELS } from '@/utils/constants';

const learningStore = useLearningStore();
const { loading: isLoading, withLoading } = useLoading();
const isLoadingMore = ref(false);

const vocabularies = computed(() => learningStore.vocabularies || []);
const hasMore = computed(() => learningStore.pagination?.hasMore || false);
const searchWord = ref('');
const selectedLevel = ref('');

const subsectionList = computed(() => [
  { name: 'All' },
  ...DIFFICULTY_LEVELS.map((l) => ({ name: l })),
]);

const subsectionCurrent = computed(() => {
  if (!selectedLevel.value) return 0;
  const idx = DIFFICULTY_LEVELS.indexOf(selectedLevel.value as any);
  return idx >= 0 ? idx + 1 : 0;
});

const debouncedSearch = debounce(() => {
  loadVocabularies();
}, 300);

const handleSearchChange = () => {
  debouncedSearch();
};

const handleSearch = () => {
  loadVocabularies();
};

const handleClear = () => {
  searchWord.value = '';
  loadVocabularies();
};

const onSubsectionChange = (index: number) => {
  selectedLevel.value = index === 0 ? '' : DIFFICULTY_LEVELS[index - 1];
  loadVocabularies();
};

const loadVocabularies = async () => {
  try {
    await withLoading(async () => {
      await learningStore.loadVocabularies({
        word: searchWord.value || undefined,
        difficulty_level: selectedLevel.value || undefined,
        limit: 20,
      });
    });
  } catch (error: any) {
    console.error('Failed to load vocabularies:', error);
    uni.showToast({
      title: error?.message || 'Failed to load vocabularies',
      icon: 'none',
      duration: 2000,
    });
  }
};

const handleLoadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  
  isLoadingMore.value = true;
  try {
    await learningStore.loadMoreVocabularies({
      word: searchWord.value || undefined,
      difficulty_level: selectedLevel.value || undefined,
      limit: 20,
    });
  } catch (error: any) {
    console.error('Failed to load more:', error);
    uni.showToast({
      title: error?.message || 'Failed to load more',
      icon: 'none',
      duration: 2000,
    });
  } finally {
    isLoadingMore.value = false;
  }
};

onMounted(async () => {
  await loadVocabularies();
});

onPullDownRefresh(async () => {
  await loadVocabularies();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 500);
});

const goToDetail = (id: number) => {
  if (!id) return;
  uni.navigateTo({ url: `/pages/vocabulary-detail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.vocabularies-page {
  padding-bottom: 100px;
  background: #FAFAFA;
  min-height: 100vh;
}

// Filter Section
.filter-section {
  background: white;
  padding: 16px 20px 20px;
  border-bottom: 1px solid #EEEEEE;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-wrapper {
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #F5F5F5;
  border-radius: 16px;
  gap: 12px;
}

.filter-tags {
  margin-top: 0;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-chips {
  display: inline-flex;
  gap: 8px;
}

.filter-chip {
  padding: 8px 16px;
  background: #F5F5F5;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #757575;
  white-space: nowrap;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &.active {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    border-color: rgba(76, 175, 80, 0.2);
    font-weight: 600;
  }
}

// Vocabulary List
.vocabulary-scroll {
  height: calc(100vh - 140px);
}

.vocabulary-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vocabulary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #EEEEEE;
  overflow: hidden;
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-color: #4CAF50;
  }
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 12px;
}

.word-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.word {
  font-size: 20px;
  font-weight: 700;
  color: #212121;
  line-height: 1.2;
}

.phonetic {
  font-size: 13px;
  color: #757575;
  font-style: italic;
}

.difficulty-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;
  
  &.badge-a1, &.badge-a2 {
    background: #4CAF50;
  }
  
  &.badge-b1 {
    background: #FFC107;
  }
  
  &.badge-b2 {
    background: #FF9800;
  }
  
  &.badge-c1, &.badge-c2 {
    background: #F44336;
  }
}

.card-body {
  margin-bottom: 16px;
}

.definition {
  display: block;
  font-size: 14px;
  color: #212121;
  margin-bottom: 8px;
  line-height: 1.6;
  font-weight: 500;
}

.definition-zh {
  display: block;
  font-size: 13px;
  color: #757575;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #EEEEEE;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pos-tag {
  padding: 4px 10px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  font-size: 11px;
  color: #2196F3;
  font-weight: 500;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.example-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  font-size: 11px;
  color: #4CAF50;
  font-weight: 600;
}

// Load More
.load-more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 0;
}

.loading-text {
  font-size: 13px;
  color: #757575;
  font-weight: 500;
}

// Loading & Empty States
.loading-container {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #212121;
}

.empty-desc {
  font-size: 14px;
  color: #757575;
}
</style>
