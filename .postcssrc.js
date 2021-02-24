/**
 * PostCSS配置文件
 */
module.exports = {
  // 配置要使用的PostCSS插件
    plugins: {
      // 配置使用autoprefixer插件
      // 作用：生成浏览器CSS样式规则前缀
      // CueCLI内部已经配置了autoprefixer插件的配置
      // 'autoprefixer': { // autoprefixer插件的配置
      //   // 配置要兼容到的环境信息
      //   browsers: ['Android >= 4.0', 'iOS >= 8']
      // },
      // 配置使用postcss-pxtorem插件
      // 作用：将px转为rem
      'postcss-pxtorem': {
        // lib-flexible的REM适配方案：把一行分为10分，每份就是1/10
        // 所以rootValue应该设置为设计稿宽度的1/10
        // 我们的设计稿是750，所以应该设计为750 / 10 = 75
        // 但是Vant建议设置为37.5，因为Vant是基于375设计的
        // 所以此处必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须 / 2
        // 通过查阅文档发现rootValue支持Number和Function两种类型
        // function可以动态处理返回，可以使用这个达到如果是Vant就按照37.5来转换；如果是自己的样式，就按照75来转换
        // rootValue: 37.5,
        // PostCSS处理每个CSS文件的时候都会来调用这个函数，它会把被处理的CSS文件相关的信息通过参数传递给该函数
        rootValue({ file }) {
          return file.indexOf('vant') !== -1 ? 37.5 : 75
        },
        // 配置要转换的css属性
        // * 表示所有
        propList: ['*'],
        // 配置不要转换的样式资源
        exclude: 'github-markdown'
      }
    }
}