projectSingleAll<template>
<div id="templateIndex" class="">
  <!-- <div v-bind:class="{ splashActive: splash }" id="splashPlate"></div> -->
  <div class="swiper-container swiper-container-outer">
    <div class="swiper-wrapper">
      <div v-bind:class="{ aboutExpandedActive: aboutExpanded }" id="about" class="swiper-slide">
        <templateAbout v-bind:isMobileSize="isMobileSize" v-bind:isMidSize="isMidSize" v-on:goToProjectSection="function(slide){goToProjectSection(slide)}" v-on:expandAbout="expandAbout()" v-bind:aboutExpanded="aboutExpanded"></templateAbout>


        <button v-if="!aboutExpanded" v-on:click="toggleExpandAbout()" type="button" class="toggleAboutClosed toggleAboutButton" id="expandAboutButton" name="button">Read More</button>

      </div>
      <div class="swiper-slide content">
        <!-- content slide -->
        <div class="grid grid-pad ignoreMarginTop" id="triggerAboutMenu">
          <div>

            <p v-if="inAboutSection" class="triggerAboutSlide" @click="toggleAboutSlideON()">
              <span>Template</span>
            </p>
          </div>
          <div>

            <p v-if="!inAboutSection" class="triggerAboutSlide" @click="toggleAboutSlideOFF()">
              <span>Back</span>
            </p>
          </div>
        </div>


        <div class="swiper-container swiper-container-inner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="project in projects" v-bind:style="{background:sanitizeHash(project.acf.backgroundcolor)}">
              <div class="slideInner" v-bind:style="{backgroundImage:'url('+ project.acf.customfeaturedimage.url+')'}"></div>
              <!-- <div v-bind:src="project.acf.customfeaturedimage.url"></div> -->


              <div id="triggerProject" @click="toggleProject()">
                <div>

                  <p v-if="inAboutSection" class="triggerAboutSlide">
                    <span v-html="project.title.rendered"></span>
                  </p>
                </div>
              </div>


            </div>
          </div>


          <!-- <div class="swiper-pagination"></div> -->
        </div>

      </div>

      <div class="swiper-slide openedProject">
        <button v-on:click="goToProjectSection('getFromRoute')" type="button" class="goBackToProjectButton" name="button">Back to top</button>

        <div v-if="typeof projectSingleAll === 'object'" class="openedProjectInner grid grid-pad">
          <div class="col-1-3">
            <p v-html="projectSingleAll.title.rendered"></p>
            <p v-html="projectSingleAll.acf.item_type[0]"></p>
            <p v-html="projectSingleAll.acf.item_year"></p>
            <p v-html="projectSingleAll.acf.item_link"></p>
            <div v-html="projectSingleAll.acf.item_text"></div>

          </div>
          <!-- <div class=" grid no-pad"> -->
          <div class="openedProjectMediaItem" v-for="item in projectSingleAll.acf.item_media" v-bind:class="returnProjectMediaAlign(item.align)">
            <img v-if="item.image" v-lazy="item.image.url" :srcset="item.image.sizes.medium + ' 480w, ' + item.image.sizes.medium_large + ' 768w, ' + item.image.sizes.large +' 840w,' + item.image.url +' 1440w'" />
            <div v-if="item.textarea" v-html="item.textarea"></div>
            <div class="iframeWrapper" v-if="item.iframe">
              <div class="iframeWrapperHeader">LIVE PREVIEW</div>
              <iframe @load="setIframeHeight()" style="width:100%" v-bind:src="item.iframe"></iframe>
            </div>
          </div>
          <!-- </div><br> -->

        </div>

      </div>

      <button v-if="aboutExpanded" v-on:click="toggleExpandAbout()" type="button" class="toggleAboutExpanded toggleAboutButton" name="button">Too much - take me back!</button>


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
      projectSingleAll: '',
      initialSlide: 0,
      aboutExpanded: this.mainAboutExpanded,
      showAboutToggleExpanded: true,
      splash: true,
      swiperOuterObject: Object,
      swiperInnerObject: Object,
      inAboutSection: true,
      isMobileSize: false,
      breakpointMobile: 767,
      isMidSize: false,
      breakpointMid: 1023
    }
  },

  filters: {
    red: function(value) {
      return 'red'
    }
  },

  created: function() {
    this.checkScreenSize()

    this.$http.get('http://api.template-studio.nl/wp-json/wp/v2/posts').then(function(response) {
      this.projects = response.body
        // console.log(this.projects)
      this.initIndexSwiper()

    })

    if (this.$route.query.about) {
      this.inAboutSection = false
    }

  },
  watch: {

    '$route': function(newRoute, oldRoute) {
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      //
      // console.log(newRoute.query.main)
      // console.log(newRoute.query.about)
      // console.log(newRoute.query.project)
      // console.log(newRoute.query.about)

      // if (newRoute.query.main && newRoute.query.about != null || this.$route.query.aboutexp != null || newRoute.query.main === 0 || newRoute.query.main && newRoute.query.project != null) {
      if (newRoute.query.about != null || this.$route.query.aboutexp != null || newRoute.query.project != null) {

        if (newRoute.query.about != null) {
          this.swiperOuterObject.slideTo(0)
          if (this.$route.query.aboutexp != null) {
            this.aboutExpanded = true
            this.swiperOuterObject.lockSwipes()
            this.swiperOuterObject.disableTouchControl()
          } else {

            this.aboutExpanded = false
            this.scrollToAboutTop()
            this.swiperOuterObject.updateSlidesSize()
            this.swiperOuterObject.unlockSwipes()
            this.swiperOuterObject.enableTouchControl()
          }
        }

        if (newRoute.query.project != null) {
          this.swiperOuterObject.slideTo(2)
          this.swiperOuterObject.lockSwipes()
          this.swiperOuterObject.disableTouchControl()
        }


      } else {

        // console.log('only manu')
        if (this.swiperOuterObject.realIndex != 1) {
          this.swiperOuterObject.unlockSwipes()
          this.swiperOuterObject.enableTouchControl()
          this.swiperOuterObject.updateSlidesSize()
          this.swiperOuterObject.slideTo(1)
          var vm = this
          setTimeout(function() {
            vm.swiperOuterObject.updateSlidesSize()
            vm.swiperOuterObject.slideTo(1)
            vm.swiperOuterObject.updateSlidesSize()

          }, 200)
          setTimeout(function() {
            vm.swiperOuterObject.updateSlidesSize()
          }, 500)
          setTimeout(function() {
            vm.swiperOuterObject.slideTo(1)
          }, 600)
        }
        this.swiperInnerObject.slideTo(newRoute.query.main)

      }

      if (newRoute.query.about != null) {
        this.inAboutSection = false

      } else {
        this.inAboutSection = true

      }


    },



  },

  methods: {

    setIframeHeight() {
      console.log(this.$el.clientHeight)
      console.log(this.$el)
      this.$el.querySelectorAll('iframe').forEach(function(iframe) {
        iframe.style.height= iframe.clientWidth*0.6666+'px'
        console.log(iframe.clientWidth)

      });


    },
    returnProjectMediaAlign(alignInput) {
      if (alignInput === 'full') {
        return 'col-1-1'

      }
      if (alignInput === 'leftSmall') {
        return 'col-1-3'
      }

      if (alignInput === 'leftLarge') {
        return 'col-2-3'
      }

      if (alignInput === 'rightSmall') {
        return 'push-1-3 col-1-3'
      }
      if (alignInput === 'rightLarge') {
        return 'push-1-3 col-1-2'
      }

    },

    checkScreenSize() {

      var windowWidth = window.innerWidth

      if (windowWidth < this.breakpointMobile) {
        this.isMobileSize = true
      } else {
        this.isMobileSize = false
      }

      if (windowWidth >= this.breakpointMobile && windowWidth <= this.breakpointMid) {
        this.isMidSize = true
        console.log('mid')
      } else {
        this.isMidSize = false
        console.log('not mid')

      }

    },


    goToProjectSection: function(slide) {
      if (slide === 'getFromRoute') {
        console.log(this.$route.query.main)
        this.$emit('setRouteMainSlide', this.$route.query.main)

      } else {
        this.$emit('setRouteMainSlide', slide)

      }

    },
    sanitizeHash: function(input) {
      return input.substr(input.indexOf(":") + 1);
    },

    expandAbout: function() {
      this.aboutExpanded = true
      this.$emit('setRouteAboutExpanded', true)
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

      console.log('gogogogogog')

      this.aboutExpanded = !this.aboutExpanded

      if (this.aboutExpanded) {
        this.$emit('setRouteAboutExpanded', true)
      } else {
        this.$emit('setRouteAboutExpanded', false)
      }

      this.swiperOuterObject.updateSlidesSize()
      this.swiperOuterObject.slideTo(0);

      var vm = this
      setTimeout(function() {
        vm.swiperOuterObject.updateSlidesSize()
        vm.swiperOuterObject.slideTo(0)
      }, 200)


    },

    toggleProject: function() {
      this.swiperOuterObject.slideTo(2);
    },

    toggleAboutSlideON: function() {
      this.swiperOuterObject.slideTo(0);
    },

    toggleAboutSlideOFF: function() {
      this.swiperOuterObject.slideTo(1);
    },

    initIndexSwiper: function() {

      var vm = this
      var vmrouter = this.router

      this.swiperOuterObject = new Swiper('.swiper-container-outer', {
        slidesPerView: 'auto',
        initialSlide: vm.mainInitQueryValue,
        direction: 'vertical',
        resistanceRatio: .00000000000001,
        observer: true,
        onInit: function(swiper) {
          vm.splash = false
          if (vm.aboutExpanded) {
            swiper.lockSwipes()
            swiper.disableTouchControl()
          }
        },

        onSlideChangeStart: function(swiper) {

          if (swiper.realIndex == 0) {
            vm.$emit('setRouteAbout')


          }
          if (swiper.realIndex == 1) {
            vm.$emit('setRouteMainSlide', vm.mainSlide)

            swiper.updateSlidesSize()

          }

          if (swiper.realIndex == 2) {
            vm.$emit('setRouteExpanded', vm.mainSlide)

          }

          vm.aboutExpanded = false

        }

      })

      this.swiperInnerObject = new Swiper('.swiper-container-inner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        initialSlide: 0,
        // loop: true,
        observer: true,
        onInit: function(swiper) {

          if (vm.mainSlide == null) {
            vm.projectSingleAll = vm.projects[0]
            swiper.slideTo(0);
          } else {
            vm.projectSingleAll = vm.projects[vm.mainSlide]
            swiper.slideTo(vm.mainSlide);
          }

        },
        onTransitionEnd: function(swiper) {
          vm.currentSlideInner = swiper.realIndex

          setTimeout(function() {
            vm.projectSingleAll = vm.projects[swiper.realIndex]


          }, 200)
        },
        onSlideChangeStart: function(swiper) {

          vm.$emit('setRouteMainSlide', swiper.realIndex)
        }


      });
    }
  },

  mounted: function() {

    var vm = this
    window.addEventListener('resize', debounce(function() {
      vm.checkScreenSize()
    }, 100));

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">@import '../assets/globalVars.scss';

body,
html {
    position: relative;
    height: 100%;
    background: $globalLightYellow;
}

body {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    /*color: #000;*/
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    // display: none;
}

#app,
#templateIndex {
    position: relative;
    height: 100%;
}
</style>

<style scoped lang="scss">@import '../assets/globalVars.scss';

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

    background: $globalLightYellow;

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

#triggerAboutMenu {
    position: absolute;
    top: 0;
    z-index: 999999999;
    color: $globalBlack;

    .triggerAboutSlide {
        display: inline;
    }

}

#triggerProject {
    position: absolute;
    bottom: $globalPadding;
    z-index: 999999999;
    color: $globalBlack;
    width: 100%;
    text-align: center;
    height: 40px;
    bottom: 0;
    .triggerAboutSlide {
        display: inline;
    }

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
    background: $globalLightYellow;
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

    .slideInner {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
}

.openedProject {

    .openedProjectInner {
        .openedProjectMediaItem {
            display: block;
            padding-bottom: $globalPadding;
            margin: 0;
        }
        img {
            width: 100%;
            display: block;

        }

        .iframeWrapper{
          background: $globalBlack;
          display: flex;
          padding-top: 30px;
          border-radius: 4px;
          position: relative;
          .iframeWrapperHeader{
            position: absolute;
            top:0;
            color: $globalLightYellow;
            right: 10px;
            height: 30px;
            line-height: 30px;
          }
        }

        iframe{
          border: 1px solid $globalBlack;
          border-radius: 2px;
          margin: 0;
        }
    }
}

.openedProjectInner {
    // margin-top: 32px;
    overflow-y: auto;
    position: absolute;
    // height: 100%;
    height: calc(100% - 40px);
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
    background-color: $globalLightYellow;
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

    .toggleAboutClosed {

        position: absolute;
        bottom: 0;

    }

    &.aboutExpandedActive {
        height: calc(100% - 40px);
        margin-bottom: 40px;
        overflow-y: auto;
    }

}

.toggleAboutExpanded {
    bottom: 0;
    position: fixed;
    z-index: 9999999999999999;
}
.toggleAboutButton {
    border: 0;

    border-top: 1px solid slategrey;
    border-bottom: 1px solid slategrey;

    // width: calc(100% - 40px);
    width: calc(100%);
    height: 40px;
    margin: 0;
    padding: 0;
    // margin-left: 20px;
    // margin-right: 20px;
    background: $globalLightYellow;
    color: slategrey;
    &:focus {
        outline: none;
    }
}

.goBackToProjectButton {
    border: 0;

    border-bottom: 1px solid slategrey;

    // width: calc(100% - 40px);
    width: calc(100%);
    height: 40px;
    margin: 0;
    padding: 0;
    // margin-left: 20px;
    // margin-right: 20px;
    background: $globalLightYellow;
    color: slategrey;
    &:focus {
        outline: none;
    }
}

.content {
    width: 100%;
}
</style>
