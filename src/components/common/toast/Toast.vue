<template>
  <div class='toast' v-show='show'>
    <div>{{message}}</div>
  </div>
</template>

<script>
    export default {
        name: "Toast",
        data() {
            return {
                message:'',
                show:false
            };
        },
        components: {},
        methods: {
            isshow(message='默认文字',duration=2000){
                this.show=true;
                this.message=message

                setTimeout(()=>{
                    this.show=false;
                    this.message=''
                },duration)
            }
        },
    };
</script>

<style scoped>
  .toast{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      padding: 8px 10px;
      
      
      color: #fff;
      background-color:rgba(0,0,0,.75);

      z-index: 999;
  }
</style>
