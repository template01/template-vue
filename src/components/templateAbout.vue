<template>
<div class="templateAbout">
  <!-- <h1>{{ aboutText }}</h1> -->


  <div class="grid grid-pad">
    <div id="aboutMenuWrapper" class="col-1-3">
      <div class="" v-bind:class="{ showAboutMenuNotScrolling: showAboutMenu }" id="aboutMenu">
        <div id="aboutMenuHeader" class="ignoreMarginTop">
          <p>Template</p>

          <p class="floatRight" v-if="isMobileSize">EN/NL</p>

        </div>
        <div class="ignoreMarginTop">
          <p>
            <span v-on:click="expandAbout(), goToAboutSection('#aboutStudio')">Studio</span>
            <span v-on:click="expandAbout(), goToAboutSection('#aboutContact')">Contact</span>
            <span v-on:click="expandAbout(), goToAboutSection('#aboutProjects')">Projects</span>
            <span v-on:click="expandAbout(), goToAboutSection('#aboutClients')">Clients</span>
            <span v-on:click="expandAbout(), goToAboutSection('#aboutArchive')">Archive</span>
          </p>
        </div>
        <div v-if="!isMobileSize" class="ignoreMarginTop">
          <p>EN/NL</p>
        </div>


      </div>
    </div>
    <div class=" col-1-3">
      <div class="ignoreMarginTop" v-html="aboutText.indexblurb"></div>
      <div class="col-1-1">
        <div class="aboutSection" id="aboutContact">
          <p class="aboutHeader">Contact</p>
          <div v-html="aboutText.indexcontact"></div>
        </div>
      </div>
    </div>
    <div class="col-1-3">
      <div><img src="http://3.design-milk.com/images/2016/03/Masquespacio-Workspace-interior-1.jpg" /></div>
    </div>
  </div>



  <div id="showTheRestAbout" v-bind:class="{ showTheRestAboutActive: aboutExpanded }">

    <div class="grid grid-pad">
      <div class="col-1-3 push-1-3">
        <div class="aboutSection" id="aboutStudio">
          <p class="aboutHeader">Studio</p>
          <div v-html="aboutText.indexblurb"></div>
        </div>
      </div>
      <div class="col-1-3">

        <div class="aboutSection" id="aboutProjects">
          <p class="aboutHeader">Featured Projects</p>
          <ul>
            <li v-on:click="goToProjectSection(project.slide)" v-for="project in aboutProjectsObject">{{project.project_name}}</li>
          </ul>
        </div>
        <div class="aboutSection" id="aboutClients">
          <p class="aboutHeader">Clients</p>

          <div v-html="aboutText.indexclients"></div>
        </div>
      </div>


    </div>



    <div class="grid grid-pad">
      <div class="aboutSection" id="aboutArchive">

        <templateArchive v-bind:aboutSmoothScroll="aboutSmoothScroll" v-bind:aboutArchiveObject="aboutArchiveObject"></templateArchive>
      </div>
    </div>



  </div>
  <!-- <div><img src="https://www.placecage.com/600/800"/></div> -->


</div>
</template>

<script>
import templateArchive from './templateArchive'


export default {


  name: 'templateAbout',
  props: ['aboutExpanded'],
  components: {
    templateArchive
  },

  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      aboutText: Object,
      aboutProjectsObject: Object,
      aboutArchiveObject: [],
      aboutSmoothScroll: true,
      isMobileSize: false,
      breakpointMobile: 767,
      showAboutMenu: true
        // aboutActiveSection: false,

    }
  },

  methods: {

    loadArchive: function(active_item) {
      this.activeArchiveItem = active_item
    },
    expandAbout: function() {
      this.$emit('expandAbout')
    },
    goToProjectSection: function(projectSlide) {
      // alert(projectSlide)
      // this.$emit('expandAbout')
      this.$emit('goToProjectSection', projectSlide)

    },

    goToAboutSection: function(section) {
      console.log(this.aboutExpanded)


      if (!this.aboutExpanded) {
        setTimeout(function() {
          if (this.aboutSmoothScroll) {
            document.querySelector(section).scrollIntoView({
              behavior: 'smooth'
            });
          } else {
            document.getElementById('about').scrollTop = document.querySelector(section).offsetTop;
          }
        }, 200);
      } else {
        if (this.aboutSmoothScroll) {
          document.querySelector(section).scrollIntoView({
            behavior: 'smooth'
          });
        } else {
          document.getElementById('about').scrollTop = document.querySelector(section).offsetTop;
        }
      }

      this.$el.querySelectorAll('.aboutSectionActive').forEach(function(entry) {
        entry.classList.remove("aboutSectionActive");
      });

      var vm = this

      setTimeout(function() {
        vm.$el.querySelector(section).classList.add('aboutSectionActive')
      }, 1)

    },

    scrollAbout: function() {

      var distanceFromTop = document.getElementById("about").scrollTop
      var menuScrollTop = document.getElementById("about").scrollTop
      var offsetHeight = document.getElementById("aboutMenu").clientHeight
      var archiveOffsetTop = document.getElementById("archiveWrapper").offsetTop
        // console.log('yo')

      if (distanceFromTop + offsetHeight > archiveOffsetTop) {
        document.getElementById("aboutMenu").style.top = document.getElementById("archiveWrapper").offsetTop - offsetHeight + 20 + 'px';
        // this.showAboutMenu = false


      } else {
        document.getElementById("aboutMenu").style.top = document.getElementById("about").scrollTop + 20 + 'px';

      }




    },

    checkIsMobile() {


      if (window.innerWidth < this.breakpointMobile) {
        this.isMobileSize = true
      } else {
        this.isMobileSize = false
      }

    }
  },
  created: function() {

    // determain browser

    if (bowser.firefox) {
      this.aboutSmoothScroll = false
    } else {
      this.aboutSmoothScroll = true

    }

    this.checkIsMobile()


    this.$http.get('http://api.template-studio.nl/wp-json/wp/v2/pages?filter[name]=index&fields=acf').then(function(response) {
      this.aboutText = response.body[0].acf
      this.aboutProjectsObject = response.body[0].acf.indexprojects;
      this.aboutArchiveObject = response.body[0].acf.indexarchive;

    })

  },

  mounted: function() {
    var vm = this

    var delayedExec = function(after, fn) {
      var timer;
      return function() {
        timer && clearTimeout(timer);
        timer = setTimeout(fn, after);
      };
    };

    var scrollStopper = delayedExec(100, function() {

      if (vm.aboutSmoothScroll) {
        vm.showAboutMenu = true
        setTimeout(function() {
          vm.scrollAbout()
        }, 100);

      } else {
        vm.scrollAbout()
      }
    });

    var initScrollStopper = function() {
      if (vm.aboutSmoothScroll) {
        vm.showAboutMenu = false
      }
      scrollStopper()
    }

    if (!this.isMobileSize) {
      document.getElementById("about").addEventListener("scroll", initScrollStopper);
    } else {
      document.getElementById("about").removeEventListener("scroll", initScrollStopper);
    }

    var vm = this
    window.addEventListener('resize', debounce(function() {
      vm.checkIsMobile()
      console.log('init')

      if (!vm.isMobileSize) {
        console.log('add')

        document.getElementById("about").addEventListener("scroll", initScrollStopper);
      } else {
        console.log('remove')
        document.getElementById("about").removeEventListener("scroll", initScrollStopper);
      }
    }, 100));

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">@import '../assets/globalVars.scss';
@import '../assets/aboutSectionStyle.scss';

.templateAbout {
    margin-bottom: 40px;
}
h1,
h2 {
    font-weight: normal;
}

a {
    color: #42b983;
}

img {
    max-width: 100%;
}

#aboutMenuWrapper {
  // }
  @media handheld, only screen and (max-width: 767px) {

      width: 100%;
  }
}

#aboutMenu {
    position: absolute;
    opacity: 0;
    -webkit-transition: opacity 0.2s;
    /* Safari */
    transition: opacity 0.2s;
    transition-delay: 0.1s;
    -webkit-transition-delay: 0.1s;
    &.showAboutMenuNotScrolling {
        opacity: 1;
    }

    #aboutMenuHeader{
      p{
        width: 50%;
        float: left;
        margin-top: 0;
      }
      .floatRight{
        text-align: right;
      }
    }


    span {
        clear: both;
        display: block;
    }
    // div {
    //     float: left;
    // }
    @media handheld, only screen and (max-width: 767px) {

        width: 100%;
        position: relative;
        display: block;
        div {
            // float: left;
        }
        span {
            clear: none;
            display: inline-block;
            padding-right:$globalPadding/2;
            // display: block;
        }

    }
}

#showTheRestAbout {
    opacity: 0;
    margin-bottom: $globalPadding*8;

    &.showTheRestAboutActive {
        opacity: 1;
    }

}
</style>
