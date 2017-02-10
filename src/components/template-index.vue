<template>
<div id="templateIndex" class="">
  <div class="swiper-container swiper-container-outer">
    <div class="swiper-wrapper">
      <div v-bind:class="{ aboutExpandedActive: aboutExpanded }" class="swiper-slide menu">
        {{msg}}
        <button v-on:click="toggleExpandAbout()" type="button" name="button">Expand</button>
      </div>
      <div class="swiper-slide content">
        <!-- content slide -->
        <div class="swiper-container swiper-container-inner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="project in projects">{{project.title.rendered}}</div>
          </div>

          <div class="swiper-pagination"></div>
        </div>

      </div>

      <div class="swiper-slide openedProject">
        <div class="openedProjectInner" v-html="projectContent"></div>

        <!-- projects[currentSlideInner].content.rendered -->

      </div>

    </div>

  </div>
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'templateIndex',
  props: ['mainSlide', 'mainAboutExpanded', 'mainInitQueryValue'],
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      currentSlideInner: 0,
      projects: [],
      projectContent: '',
      initialSlide: 0,
      aboutExpanded: this.mainAboutExpanded

    }
  },

  created: function() {

    this.$http.get('http://api-placeholder.template-studio.nl/wp-json/wp/v2/posts').then(function(response) {
      this.projects = response.body
        // console.log(this.projects)
      this.initIndexSwiper()

    })

  },
  watch: {

    '$route': function(newRoute, oldRoute) {
      // if (this.$route.path.toString() === "/") {
      //   this.showIndex = true
      // } else {
      //   this.showIndex = false
      // }
      console.log(this.$route)

    },
  },
  methods: {
    toggleExpandAbout: function() {
      console.log('lololo')
      this.aboutExpanded = !this.aboutExpanded
      this.$emit('setRouteAboutExpanded', this.mainSlide)

    },

    initIndexSwiper: function() {

      var vm = this
      var vmrouter = this.router

      var swiperOuter = new Swiper('.swiper-container-outer', {
        slidesPerView: 'auto',
        initialSlide: vm.mainInitQueryValue,
        direction: 'vertical',
        resistanceRatio: .00000000000001,
        slideToClickedSlide: true,
        observer: true,
        onSlideChangeStart: function(swiper) {

          if (swiper.realIndex == 0) {
            vm.$emit('setRouteAbout', 'normal')
            console.log('about')

          }
          if (swiper.realIndex == 1) {
            vm.$emit('setRouteMainSlide', vm.mainSlide)
            console.log('default')
            console.log(vm.mainSlide)
          }

          if (swiper.realIndex == 2) {
            vm.$emit('setRouteExpanded', vm.mainSlide)
            console.log('expanded')
          }

          if (vm.aboutExpanded) {
            window.setTimeout(function() {
              swiper.updateSlidesSize()
              swiper.slideTo(1);
            }, 150)
          }

          vm.aboutExpanded = false

        }

      })

      var swiper = new Swiper('.swiper-container-inner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        initialSlide: 0,
        loop: true,
        observer: true,
        onInit: function(swiper) {

          if (vm.mainSlide == null) {
            vm.projectContent = vm.projects[0].content.rendered
            swiper.slideTo(0);
          } else {
            vm.projectContent = vm.projects[vm.mainSlide].content.rendered
            swiper.slideTo(vm.mainSlide);
          }


        },
        onTransitionEnd: function(swiper) {
          vm.currentSlideInner = swiper.realIndex
          vm.projectContent = vm.projects[swiper.realIndex].content.rendered
        },
        onSlideChangeStart: function(swiper) {
          vm.$emit('setRouteMainSlide', swiper.realIndex)
        }


      });
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body,
html {
  position: relative;
  height: 100%;
}

body {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

#app,
#templateIndex {
  position: relative;
  height: 100%;
}
</style>

<style scoped lang="scss">
#templateHeader {
    font-size: 22px;
    position: fixed;
    z-index: 9;
}

.swiper-container-outer {
    width: 100%;
    height: 100%;
}

.swiper-container-inner {
    width: 100%;
    height: 100%;
}

.swiper-container-inner .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    width: 100%;
    height: 100%;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.swiper-slide {
    /*text-align: center;*/
    font-size: 18px;
    background: #fff;
}

.openedProject {}

.openedProjectInner {
    margin-top: 32px;
    overflow-y: auto;
    position: absolute;
    height: calc(100% - 32px);
}

.menu {
    /*min-width: 100px;*/
    -webkit-transition: height 0.25s;
    -moz-transition: height 0.25s;
    transition: height 0.25s;

    width: 100%;
    height: 75%;
    /*max-width: 320px;*/
    background-color: #2C8DFB;
    color: #fff;

    &.aboutExpandedActive {
        height: 100%;
    }
}

.content {
    width: 100%;
}
</style>
