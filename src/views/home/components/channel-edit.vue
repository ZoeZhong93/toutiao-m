<template>
 <div class="channel-edit">
   <!-- 我的频道 -->
  <van-cell :border="false">
    <div slot="title" class="title-text">我的频道</div>
    <van-button
      class="edit-btn"
      type="danger"
      plain
      round
      size="mini"
      @click="isEditShow = !isEditShow"
    >
      {{ isEditShow ? '完成' : '编辑' }}
    </van-button>
  </van-cell>
  <van-grid class="my-grid" :gutter="10">
    <van-grid-item
      class="grid-item"
      v-for="(channel, index) in myChannels"
      :key="index"
      @click="onMyChannelClick(channel, index)"
    >
      <!--
        v-bind:class语法
        一个对象，对象中的key表示要作用的CSS类名
        对象中的value要计算出布尔值，true则作用该类名，false则不作用该类名
      -->
      <span class="text" :class="{ active: index === active }" slot="text">{{ channel.name }}</span>
      <van-icon v-show="isEditShow && !fixChannels.includes(channel.id)" slot="icon" name="close" />
    </van-grid-item>
  </van-grid>
  <!-- 频道推荐 -->
  <van-cell :border="false">
    <div slot="title" class="title-text">频道推荐</div>
  </van-cell>
  <van-grid class="recommend-grid" :gutter="10">
    <van-grid-item
      class="grid-item"
      icon="plus"
      v-for="(channel, index) in recommendChannels"
      :key="index"
      :text="channel.name"
      @click="onAddChannel(channel)"
    />
  </van-grid>
 </div>
</template>
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 所有频道
      allChannels: [],
      // 控制编辑状态的显示
      isEditShow: false,
      // 固定频道，不允许删除
      fixChannels: [0]
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性辉观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 方法一
      // 数组的filter方法：遍历数组，将符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(item => {
        // 数组的find方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find(myItem => item.id === myItem.id)
      })

      // 方法二
      // const channels = []
      // this.allChannels.forEach(item => {
      //   // find遍历数组，找到满足条件的元素项
      //   const ret = this.myChannels.find(myItem => {
      //     return myItem.id === item.id
      //   })
      //   // 如果我的频道中不包含该频道项，则收集到推荐频道中
      //   if (!ret) {
      //     channels.push(item)
      //   }
      // })
      // // 把计算结果返回
      // return channels
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，数据存储到线上
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 频道的序号
          })
        } catch (error) {
          console.log(error)
          this.$toast('添加频道失败')
        }
      } else {
        // 未登录，数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEditShow) {
        // 如果是编辑状态，则执行删除操作
        if (this.fixChannels.includes(channel.id)) {
          return
        }
        // 如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          this.$emit('update:active', this.active - 1)
        }
        // splice()：参数1表示要删除元素的开始的索引（包括该索引）；参数2表示要删除的个数，若不指定，则从参数1开始删除到最后
        this.myChannels.splice(index, 1)
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 如果是完成状态，则执行切换操作
        this.$emit('update:active', index)
        this.$emit('close-popup')
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        console.log(error)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less">
  .channel-edit {
    padding: 85px 0;
    .title-text {
      font-size: 32px;
      color: #333;
    }
    .edit-btn {
      width: 104px;
      height: 48px;
      font-size: 26px;
      color: #f85959;
      border: 1px solid #f85959;
    }
    /deep/ .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        white-space: nowrap;
        background-color: #f4f5f6;
        .van-grid-item__text, .text {
          font-size: 28px;
          color: #222;
          margin-top: 0;
        }
      }
    }
    /deep/ .recommend-grid {
      .grid-item {
        .van-grid-item__content {
          flex-direction: row;
          .van-icon-plus {
            font-size: 28px;
            margin-right: 6px;
          }
        }
      }
    }
    /deep/ .my-grid {
      .grid-item {
        .van-grid-item__icon-wrapper {
          position: unset;
        }
        .van-icon-close {
          position: absolute;
          right: -15px;
          top: -15px;
          font-size: 30px;
          z-index: 2;
        }
        .active {
          color: #f85959;
        }
      }
    }
  }
</style>
