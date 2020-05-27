<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div>
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-add_circle"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </div>
        </div>
        <split v-show="food.info"></split>
        <!--      有food,info这个数据就显示，没有则不显示-->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @change="changing" @toggle="toggleContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length" >
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,i) in food.ratings" :key="rating[i]" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime}}</div>
                <!--  //使用 vue 的 filters 方法，其语法就是在这之后加上 “ | ”，后面在跟上 filters 的名字 formatDate。-->
                <p class="text">
                  <span :class="{'icon-arrow_lift':rating.rateType === 0,'icon-check_circle':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BSscroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import Vue from 'vue';
  import split from '../split/split';
  import ratingselect from '../ratingselect/ratingselect';
  // import {formatDate} from '../../common/js/date';

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
       showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
         all: `全部`,
          positive: `推荐`,
          negative: `吐槽`
        }
      };
    },
    methods: {
      //  子组件更新的值
      change(type) {
        this.selectType = type;
      },
      toggle(val) {
        this.onlyContent = val;
      },
      //  子组件更新的值==结束
      show() {
        this.showFlag = true;
        // 在每次show的时候 初始化ratingselect组件
        this.selectType = ALL;
        this.onlyContent = false;
        // 使用BSscroll前使用$next Tick以保证DOM已渲染
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BSscroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        // this.$dispatch('cart.add', event.target); 小球动画 没做
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      // 实现选择不同的评价类型时 使better scroll 重新计算高度
      changing(type) {
        this.selectType = type;
        this.$nextTick(() => {
           this.scroll.refresh();
        });
      },
      toggleContent(type) {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index: 30
    width 100%
    background: #fff
    &.move-enter,  &.move-leave-to/*过渡开始进入以及离开后的状态*/
      transform translate3d(100%,0,0)
    &.move-enter-active/*定义过渡从开始到完全进入的持续时间*/
      transition all 0.2s linear
    &.move-leave-active/*定义过渡从开始到完全进入的持续时间*/
      transition all 0.2s linear
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-add_circle
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        font-size 0
        height 10px
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240,20,20)
        .old
          text-decoration line-through
          font-size 10px
          color rbg(147,153,159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index: 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #fff
        background rgb(0,160,220)
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            top 16px
            right 0
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
          .icon-arrow_lift,.icon-check_circle
            margin-right 4px
            line-height 16px
            font-size 12px
          .icon-arrow_lift
            color rgb(0,160,220)
          .icon-check_circle
            color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
</style>
