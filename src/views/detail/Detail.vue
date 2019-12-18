<template>
  <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick='titleClick' ref="nav"></detail-nav-bar>
      <scroll class="content" ref="scroll" @scroll='contentScroll' :probe-type='3'>
        <detail-swiper :top-images='topImages'></detail-swiper>
        <detail-base-info :goods='goods'></detail-base-info>
        <detail-shop-info :shop='shop'></detail-shop-info>
        <detail-goods-info :detail-info='detailInfo' @imgLoad='imageLoad'></detail-goods-info>
        <detail-param-info :param-info='paramInfo' ref="params"></detail-param-info>
        <detail-comment-info :comment-info='commentInfo' ref="comment"></detail-comment-info>
        <goods-list :goods='recommends' ref="recommend"></goods-list>
      </scroll>
      <detail-bottom-bar @addToCart='addToCart'></detail-bottom-bar>
      <back-top @click.native='backTop' v-show='isShowBackTop'></back-top>
      <!-- <toast message='哈哈哈' ></toast> -->
  </div>
  
</template>

<script>
import DetailNavBar from './chileComps/DetailNavBar'
import DetailSwiper from './chileComps/DetailSwiper'
import DetailBaseInfo from './chileComps/DetailBaseInfo'
import DetailShopInfo from './chileComps/DetailShopInfo'
import DetailGoodsInfo from './chileComps/DetailGoodsInfo'
import DetailParamInfo from './chileComps/DetailParamInfo'
import DetailCommentInfo from './chileComps/DetailCommentInfo'
import DetailBottomBar from './chileComps/DetailBottomBar'


import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {itemListenerMixin,backTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'
import {mapActions} from 'vuex'

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,
      
    };
  },
  mixins:[itemListenerMixin,backTopMixin],
  created() {
    //保存传入的iid
    this.iid = this.$route.params.iid;
    //根据iid请求详情数据
    getDetail(this.iid).then(res=>{
      //获取顶部轮播图信息
      console.log(res)
      const data=res.result
      this.topImages=data.itemInfo.topImages
      //获取商品信息
      this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //获取店铺信息
      this.shop=new Shop(data.shopInfo)

      //保存商品的详细信息
      this.detailInfo=data.detailInfo

      //获取参数信息
      this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

      //获取评论信息
      if (data.rate.cRate!==0){
        this.commentInfo=data.rate.list[0]
      }
    })

    //请求推荐数据
    getRecommend().then(res=>{
      this.recommends=res.data.list
      console.log(res)
    })
    //给getThemeTopY赋值
    this.getThemeTopY=debounce(()=>{
      this.themeTopYs=[]
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
    },100)
    
  },
  methods: {
    //把addCart方法映射到methods里，就可以直接使用
    ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    addToCart(){
      // console.log("addToCart");
      const product={}
      product.image=this.topImages[0];
      product.title=this.goods.title;
      product.desc=this.goods.desc;
      product.price=this.goods.realPrice;
      product.iid=this.iid;
      //将商品添加到购物车里
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart',product)

      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res);
      // })
      this.addCart(product).then(res=>{
        //添加到购物车成功
        // console.log(res);
        this.$toast.isshow(res)
      })
      

    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
    },
    //导航条
    contentScroll(position){
      //获取y值
      const positionY=-position.y
      
      //positionY和主题中的值做对比
      let length=this.themeTopYs.length

      for (let i =0;i<length-1;i++){
        if(this.currentIndex!==i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
          this.currentIndex=i;
          console.log(this.currentIndex)
          this.$refs.nav.currentIndex=this.currentIndex
        }
      }
      //回到顶部
      this.listenShowBackTop(position)
      // this.isShowBackTop=-position.y>BACK_POSITION
    },
    
    

  },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
  },
  
};
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    position:absolute;
    overflow: hidden;
    top: 44px;
    bottom: 58px;
    right: 0;
    left: 0;
  }
  /* .content{
    height: calc(100% - 44px - 58px);
  } */
</style>
