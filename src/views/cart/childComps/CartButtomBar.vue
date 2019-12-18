<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="checkAll" @click.native="checkClick" />
      <span>全选</span>
    </div>
    <!-- 合计 -->
    <div class="price">合计:{{totalPrice}}</div>
    <!-- 去结算 -->
    <div class="calculate">去结算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import { mapGetters } from "vuex";
export default {
  name: "CartButtomBar",
  data() {
    return {};
  },
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      return !this.cartList.find(item => !item.checked);
    }
  },
  methods: {
      checkClick(){
          if (this.isSelectAll){
              this.cartList.forEach(item=>item.checked=false)
          } else{
              this.cartList.forEach(item=>item.checked=true)

          }
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择要购买的商品',2000)
        }
      }
  },
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  position: relative;
  /* bottom: 40px; */
  line-height: 40px;
  display: flex;
  font-size: 14px;
}
.checkAll {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-left: 10px;
  margin-right: 5px;
}
.check-content {
  display: flex;
  align-items: center;
  width: 90px;
}
.price {
  margin-left: 25px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: red;
  color: #eee;
  text-align: center;
}
</style>
