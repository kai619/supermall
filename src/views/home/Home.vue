<template>
 
  <div id='home'>
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                    @tabClick='tabClick' 
                    ref="tabControl1"
                    class="tab-control"
                    v-show="isTabFixed"></tab-control>
    <scroll class="content" 
                ref="scroll" 
                :probe-type='3' 
                @scroll="contentScroll"
                :pull-up-load='true'
                @pullingUp='loadMore'>
      <home-swiper :banners='banners' @swiperImageLoad='swiperImageLoad'></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" 
                    @tabClick='tabClick' 
                    ref="tabControl2"></tab-control>
      <good-list :goods="showGoods"></good-list>
    </scroll>
    <back-top @click.native='backTop' v-show='isShowBackTop'></back-top>
  </div>
  
  
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  // import BackTop from 'components/content/backTop/BackTop';

  import {getHomeMultidata,getHomeGoods} from "network/home";
  // import {debounce} from 'common/utils'
  import {itemListenerMixin,backTopMixin} from 'common/mixin'
  // import {BACK_POSITION} from 'common/const'


  
  
export default {
  name:'Home',
  components:{
    HomeSwiper,
    RecommendView,
    FeatureView,
    GoodList,
    Scroll,
    // BackTop,

    NavBar,
    TabControl
  },
  mixins:[itemListenerMixin,backTopMixin],
  data(){
    return{
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]}
      },
      currentType:'pop',
      
      tabOffsetTop:0,
      isTabFixed:false,
      //切换页面时记录位置
      saveY:0,

    }

  },
  computed: {
    showGoods(){
      // console.log(this.goods[this.currentType].list);
      return this.goods[this.currentType].list
    }
    
  },
  activated() {
    //设置记录位置
    this.$refs.scroll.scrollTo(0,this.saveY)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //记录位置
    this.saveY=this.$refs.scroll.getScrollY()
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },

  created(){
    //1.请求多个数据
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


    

    },
    //改用mixin(混入)技术实现
  // mounted() {
  //   const refresh =debounce(this.$refs.scroll.refresh,200)
  //   //对监听的事件进行保存
  //   this.itemImgListener=()=>{
  //     refresh()
  //   }
  //   // 监听item中的图片加载完成--解决一个BUG：滑动到最下面时，图片没加载好
  //   this.$bus.$on('itemImageLoad',this.itemImgListener)

  // },
  methods: {
    
    tabClick(index){
      console.log(index);
      switch(index){
        case 0:
          this.currentType='pop'
          break
        case 1:
          this.currentType='new'
          break
        case 2:
          this.currentType='sell'
          break
      }
      if(this.$refs.tabControl1){
      this.$refs.tabControl1.currentIndex=index
      this.$refs.tabControl2.currentIndex=index
      }
      },
    // backClick(){
    //   // console.log(this.$refs.scroll.scroll);
    //   // this.$refs.scroll.scroll.scrollTo(0,0,500)
    //   this.$refs.scroll.scrollTo(0,0,500)
    // },
    contentScroll(position){
      // console.log(position);
      this.listenShowBackTop(position)
      

      //  决定tabControl是否吸顶（position:fixed）
      this.isTabFixed=(-position.y)>this.tabOffsetTop
      
    },
    // 加载更多的fangfa
    loadMore(){
    //   console.log(111111);
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      //让“流行，新款，精选”向上滚动能够确定固定位置
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop;
    },
    getHomeMultidata(){
      getHomeMultidata().then((res) =>{
      // console.log(res);
      this.banners=res.data.banner.list;
      this.recommends=res.data.recommend.list;
    })
    },
    getHomeGoods(type){
      const page =this.goods[type].page+1
      getHomeGoods(type,page).then(res=>{
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page+=1
        
        this.$refs.scroll.finishPullUp()
    })
    }
  },
  }

</script>

<style scoped>
  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color:#ffff;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  /* .tab-control{
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  .content{
    position:absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
  /* .fixed{
    position: fixed;
    left: 0;
    right: 0;
    top: 44px
  } */
  /* .content{
    height: calc(100%-93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>