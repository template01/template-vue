<template>
<div id="templateIndex" class="">
  <div v-bind:class="{ splashActive: splash }" id="splashPlate"></div>
  <div class="swiper-container swiper-container-outer">
    <div class="swiper-wrapper">
      <div v-bind:class="{ aboutExpandedActive: aboutExpanded }" id="about" class="swiper-slide">
        <templateAbout></templateAbout>

        <div id="aboutExpandWrapper" v-bind:class="{ showAboutToggleFade: showAboutToggleExpanded }">
          <button v-if="aboutExpanded" v-on:click="toggleExpandAbout()" type="button" class="toggleAbout" name="button">Close</button>
          <button v-else v-on:click="toggleExpandAbout()" type="button" class="toggleAbout" name="button">Expand</button>
        </div>

      </div>
      <div class="swiper-slide content">
        <!-- content slide -->
        <div class="swiper-container swiper-container-inner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="project in projects" v-bind:style="{background:sanitizeHash(project.acf.backgroundcolor)}">
              <div class="slideInner" v-bind:style="{backgroundImage:'url('+ project.acf.customfeaturedimage.url+')'}"></div>
              <!-- <div v-bind:src="project.acf.customfeaturedimage.url"></div> -->
            </div>
          </div>

          <div class="swiper-pagination"></div>
        </div>

      </div>

      <div class="swiper-slide openedProject">
        <div class="openedProjectInner" v-html="projectContent"></div>
      </div>

    </div>

  </div>
  <router-view></router-view>
</div>
</template>

<script>
import templateAbout from './templateAbout'

export default {
  components: {
    templateAbout,
  },
  name: 'templateIndex',
  props: ['mainSlide', 'mainAboutExpanded', 'mainInitQueryValue'],
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      currentSlideInner: 0,
      projects: [],
      projectContent: '',
      initialSlide: 0,
      aboutExpanded: this.mainAboutExpanded,
      showAboutToggleExpanded: true,
      splash: true
    }
  },

  filters: {
    red: function (value) {
      return 'red'
    }
  },

  created: function() {

    this.$http.get('http://api.template-studio.nl/wp-json/wp/v2/posts').then(function(response) {
      this.projects = response.body
        // console.log(this.projects)
      this.initIndexSwiper()

    })

  },
  watch: {

    '$route': function(newRoute, oldRoute) {
      // console.log(this.$route)
    },

    'aboutExpanded': function(newVal, oldVal) {
      // do something
      // if (!this.aboutExpanded) {
        // this.$el.querySelector("#about").scrollTop = 0

        this.scrollToAboutTop()

      // }

    }


  },

  methods: {
    sanitizeHash:function(input){
      return input.substr(input.indexOf(":") + 1);
    },

    scrollToAboutTop: function() {

      var timeoutTotal = 200
      this.showAboutToggleExpanded = false

      scrollTo(this.$el.querySelector("#about"), 0, timeoutTotal);

      var vm = this

      setTimeout(function() {
        vm.showAboutToggleExpanded = true
      }, timeoutTotal);

      function scrollTo(element, to, duration) {
        var start = element.scrollTop,
          change = to - start,
          increment = 20;

        var animateScroll = function(elapsedTime) {
          elapsedTime += increment;
          var position = easeInOut(elapsedTime, start, change, duration);
          element.scrollTop = position;
          if (elapsedTime < duration) {
            setTimeout(function() {
              animateScroll(elapsedTime);
            }, increment);
          }
        };

        animateScroll(0);
      }

      function easeInOut(currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
          return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
      }
    },

    toggleExpandAbout: function() {
      this.aboutExpanded = !this.aboutExpanded
      if (this.aboutExpanded) {
        this.$emit('setRouteAboutExpanded', this.mainSlide)

      } else {
        this.$emit('setRouteAbout')
      }

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
        onInit: function(swiper) {
          vm.splash = false
        },
        onSlideChangeStart: function(swiper) {

          if (swiper.realIndex == 0) {
            vm.$emit('setRouteAbout')

          }
          if (swiper.realIndex == 1) {
            vm.$emit('setRouteMainSlide', vm.mainSlide)
          }

          if (swiper.realIndex == 2) {
            vm.$emit('setRouteExpanded', vm.mainSlide)
          }

          if (vm.aboutExpanded) {
            window.setTimeout(function() {
              swiper.updateSlidesSize()
              swiper.slideTo(1);

              // match timeout to transition value in #about
            }, 200)
          }

          vm.aboutExpanded = false

        }

      })

      var swiper = new Swiper('.swiper-container-inner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        initialSlide: 0,
        // loop: true,
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
#splashPlate {
    -webkit-transition: opacity 1s;
    -moz-transition: opacity 1s;
    transition: opacity 1s;
    -webkit-transition-delay: 1s;
    -moz-transition-delay: 1s;
    transition-delay: 1s;
    opacity: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 9999999999;

    background: #fffae5;

    overflow: hidden;
    -webkit-user-select: none;
    /* Chrome all / Safari all */
    -moz-user-select: none;
    /* Firefox all */
    -ms-user-select: none;
    /* IE 10+ */
    user-select: none;
    /* Likely future */
    pointer-events: none;

    &.splashActive {
        opacity: 1;
        -webkit-user-select: default;
        /* Chrome all / Safari all */
        -moz-user-select: default;
        /* Firefox all */
        -ms-user-select: default;
        /* IE 10+ */
        user-select: default;
        /* Likely future */
        pointer-events: default;

    }
}

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

    .slideInner{
      width: 100%;
      height: 100%;
      background-repeat:no-repeat;
      background-size:contain;
      background-position: center;
    }
}

.openedProject {}

.openedProjectInner {
    margin-top: 32px;
    overflow-y: auto;
    position: absolute;
    height: calc(100% - 32px);
}

#about {
    /*min-width: 100px;*/
    -webkit-transition: height 0.2s;
    -moz-transition: height 0.2s;
    transition: height 0.2s;
    position: relative;

    width: 100%;
    height: 75%;
    /*max-width: 320px;*/
    background-color: #fffae5;
    color: slategrey;
    overflow-x: hidden;
    overflow-y: hidden;

    #aboutExpandWrapper {
        opacity: 0;
        &.showAboutToggleFade {
            -webkit-transition: opacity 0.2s;
            -moz-transition: opacity 0.2s;
            transition: opacity 0.2s;
            -webkit-transition-delay: 0.1s;
            -moz-transition-delay: 0.1s;
            transition-delay: 0.1s;
            opacity: 1;
        }
    }

    .toggleAbout {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        margin: 0;
        padding: 0;
        border: 0;
        background: #fffae5;
        color: slategrey;
        &:focus {
            outline: none;
        }
    }

    &.aboutExpandedActive {
        height: 100%;
        overflow-y: auto;
        .toggleAbout {
            position: fixed;
        }
    }

}

.content {
    width: 100%;
}
</style>
