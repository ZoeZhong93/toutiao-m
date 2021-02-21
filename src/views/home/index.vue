<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search">搜索</van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!--
      通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过animated属性可以开启切换标签内容时的转场动画
      通过swipeable属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <!-- 频道文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit :my-channels="channels" :active.sync="active" @close-popup="isChannelEditShow = false" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/home'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: true
    }
  },
  created () {
    this.getChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async getChannels () {
      try {
        let channels = []
        if (this.user) {
          // 已登录，请求获取线上数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取用户频道失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    padding-bottom: 100px;
    padding-top: 174px;
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
    /deep/ .channel-tabs {
      .van-tabs__wrap {
        height: 82px;
        position: fixed;
        top: 92px;
        left: 0;
        right: 0;
        z-index: 1;
      }
      .van-tab {
        border-right: 1px solid #edeff3;
        min-width: 200px;
        font-size: 30px;
        color: #777;
      }
      .van-tab--active {
        color: #333;
      }
      .van-tabs__nav {
        padding-bottom: 0;
      }
      .van-tabs__line {
        width: 31px !important;
        height: 6px;
        background-color: #3296fa;
        bottom: 8px;
      }
      .placeholder {
        flex-shrink: 0;
        width: 66px;
        height: 82px;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        width: 66px;
        height: 82px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        opacity: 0.902;
        i.toutiao {
          font-size: 33px;
        }
        &:before {
          content: "";
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background: url('~@/assets/gradient-gray-line.png');
          background-size: contain;
        }
      }
    }
  }
</style>
