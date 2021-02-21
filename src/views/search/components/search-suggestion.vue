<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      :title="suggestion"
      icon="search"
    />
  </div>
</template>
<script>
import { getSearchSuggestions } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变之后，就会调用handler函数
      // handler函数名称是固定的
      handler (value) {
        this.loadSearchSuggestions(value)
      },
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        console.log(error)
        this.$toast('数据获取失败，请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less">

</style>
