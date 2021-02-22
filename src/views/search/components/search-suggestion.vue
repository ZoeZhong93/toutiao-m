<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', suggestion)"
    >
      <div slot="title" v-html="highlight(suggestion, searchText)"></div>
    </van-cell>
  </div>
  <!-- 使用v-html指令可以绑定渲染带有html标签的字符串 -->
</template>
<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载，只会把使用到的成员打包到结果中
import { debounce } from 'loadsh'
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
      // debounce函数，参数1：一个函数   参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
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
    },
    // 参数 source：原始字符串
    // 参数 keyword：需要高亮的关键词
    // 返回值：替换之后的高亮字符串
    highlight (source, keyword) {
      // 这里可以new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生js的内置构造函数
      // 参数1：字符串，注意这里不需要加//
      // 参数2：匹配模式，g表示全局，i表示忽略大小写
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${keyword}</span>`)
    }
  }
}
</script>
<style scoped lang="less">

</style>
