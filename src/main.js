import Vue from 'vue'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

import swiper from 'swiper'
import '../node_modules/swiper/dist/css/swiper.min.css'


// import bowser from 'bowser'
// import './assets/bowserWebpack.js'


import './assets/simplegrid.css'

import './assets/globalTypo.scss'


// import vueSmoothScroll from 'vue-smoothscroll';
// Vue.use(vueSmoothScroll);


// import smoothScroll from 'smoothscroll-polyfill';
// Vue.use(smoothScroll);
require('smoothscroll-polyfill').polyfill();



import Hello from './components/Hello'
import templateIndex from './components/template-index'
import Hello2 from './components/Hello2'




Vue.use(vueResource)
  // 1. Use plugin.
  // This installs <router-view> and <router-link>,
  // and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 3. Create the router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [{
      path: '/',
      component: templateIndex,
      children: [{
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'profile',
        component: Hello2
      }, {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'posts',
        component: Hello2
      }]
    },
    // { path: '/foo', component: Hello2 },
  ],
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.

// v-on:asshole="asshole()"
new Vue({
  router,
  template: `
    <div id="app">
      <router-view class="view" v-bind:mainSlide="this.mainSlide" v-bind:mainInitQueryValue="this.mainInitQueryValue" v-bind:mainAboutExpanded="this.mainAboutExpanded"
      v-on:setRouteAboutExpanded="function(index){setRouteAboutExpanded(index)}"
      v-on:setRouteExpanded="function(index){setRouteExpanded(index)}" v-on:setRouteMainSlide="function(index){setRouteMainSlide(index)}" v-on:setRouteAbout="function(mode){setRouteAbout(mode)}"></router-view>
    </div>
  `,
  data() {


    return {
      mainSlide: 0,
      mainAboutNormal: 1,
      mainAboutExpanded: false,
      mainProjectExpanded: 0
    }
  },
  methods: {
    setRouteMainSlide: function(index) {

      // console.log('this is index '+index)

      if (index == null) {
        this.mainSlide = 0
        // router.push({
        //   query: {
        //     main: 0
        //   }
        // })
      }else{
        router.push({
          query: {
            main: index
          }
        })
        this.mainSlide = index
      }



    },

    setRouteExpanded: function(index) {
      router.push({
        query: {
          project: 'expanded',
          main: index
        }
      })
      this.mainSlide = index
    },


    setRouteAbout: function(mode) {
        router.push({
          query: {
            about: 'true',
            main: this.mainSlide,
          }
        })
        this.mainAboutNormal = 0
          // console.log(this.$route.query.main)
    },

    setRouteAboutExpanded: function(mode) {

        this.mainAboutExpanded = mode
        console.log('expandeddddd')
        console.log(mode)
        if (this.mainAboutExpanded){
          router.push({
            query: {
              about: 'true',
              main: this.mainSlide,
              aboutexp: 'true'
            }
          })
        }else{
          router.push({
            query: {
              about: 'true',
              main: this.mainSlide,
            }
          })
        }




    },

  },
  computed: {
    returnInitQueryValue: function() {

      if (this.$route.query.about === "true") {
        return 0
      }
      if (this.$route.query.about === "expanded") {
        return 0
      }
      if (this.$route.query.about == null && this.$route.query.project == null) {
        return 1
      }

      if (this.$route.query.project === "expanded") {
        return 2
      }
    }
  },
  created: function() {
    console.log(this.$route.query.about)
    this.mainSlide = this.$route.query.main
    if(this.$route.query.aboutexp === 'true'){
      this.mainAboutExpanded = true
    }else{
      this.mainAboutExpanded = false
    }
    this.mainInitQueryValue = this.returnInitQueryValue
  }
}).$mount('#app')
