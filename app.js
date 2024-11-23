App({
  globalData: {
    messageBuilder: null,
  },
  onCreate(options) {
    console.log("app on create invoke");
    this.globalData.messageBuilder = null;
  },

  onDestroy(options) {
    console.log("app on destroy invoke");
  },
});
