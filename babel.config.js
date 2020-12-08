const prodPlugin = []
if(process.env.NODE_ENV==='prodution'){
  //只在生产模式下执行移除console的插件
  prodPlugin.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugin
  ]
}
