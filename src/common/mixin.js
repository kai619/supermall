import {debounce} from 'common/utils'
import {BACK_POSITION} from 'common/const'
import BackTop from 'components/content/backTop/BackTop';
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    //对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  data() {
    return {
      
      isShowBackTop:false,
    };
  },
  components:{
    BackTop
  },
  methods: {
    // 回到顶部
    backTop() {
      // 调用子组件里面封装的scrollTo方法即可
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShowBackTop(position){
      //判断BackTop是否显示
      this.isShowBackTop=(-position.y)>BACK_POSITION
    }
  }
};
