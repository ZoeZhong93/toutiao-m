<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
        :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false // 是否加载失败
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        // if (Math.random() > 0.5) {
        //   JSON.parse('jsdsdg')
        // }
        // 1、请求获取数据
        const params = {
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 查询关键词
        }
        const { data } = await getSearchResult(params)
        // 2、把请求结果数据放到list数组中
        const { results } = data.data
        this.list.push(...results)

        // 3、本次数据加载结束之后，要把加载状态设置为结束
        // loading关闭以后才能触发下一次的加载更多
        this.loading = false

        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.page++
        } else {
          // 如果没有数据了，把finished设置为true，之后不在触发加载更多
          this.finished = true
        }
      } catch (err) {
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    }
  }
}
</script>
<style scoped lang="less">

</style>
