<template>
  <div class="warpper" ref="warpper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    import BScroll from 'better-scroll';
    export default {
        name: "Scroll",
        props:{
            probeType:{
                type:Number,
                default:0
            },
            pullUpLoad:{
                type:Boolean,
                default:false
            }
        },
        mounted() {
            this.scroll=new BScroll(this.$refs.warpper,{
                click:true,
                probeType:this.probeType,
                pullUpLoad:this.pullUpLoad
            })
            //如果外层还有同样的类名  会找错
            // this.scroll=new BScroll('.warpper',{

            // })
            //监听滚动的位置
            if (this.probeType===2||this.probeType===3){
            this.scroll.on('scroll',(position)=>{
                // console.log(position);
                this.$emit('scroll',position)
            })
            }
            //监听上拉
            if (this.pullUpLoad){
                this.scroll.on('pullingUp',()=>{
                // console.log('加载更多');
                this.$emit('pullingUp')
            })
            }
            
            
            
        },
        data() {
            return {
                scroll:null
            };
        },
        methods: {
            scrollTo(x,y,time=300){
                this.scroll && this.scroll.scrollTo(x,y,time)
            },
            finishPullUp(){
                this.scroll.finishPullUp()
            },
            refresh(){
                
                this.scroll && this.scroll.refresh()
            },
            //获取滚动到的位置
            getScrollY(){
                console.log(this.scroll.y)
                return this.scroll.y ? this.scroll.y :0
            }
        },
        components: {}
        };
</script>

<style scoped>
</style>
