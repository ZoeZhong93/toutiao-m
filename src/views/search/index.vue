<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。
     -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索栏 -->
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" />

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" />

    <!-- 历史记录 -->
    <search-history v-else />
  </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false // 控制搜索结果的展示
    }
  },
  methods: {
    onSearch (val) {
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="less">
  .search-container {
    .van-search__action {
      color: #fff;
    }
  }
</style>
