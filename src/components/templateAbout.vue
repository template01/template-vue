<template>
<div class="templateAbout">
  <!-- <h1>{{ aboutText }}</h1> -->

  <div class="grid grid-pad">
    <div class="ignoreMarginTop col-1-3">
      <div>
        <p>Template</p>
        <p>
          <span v-on:click="expandAbout(), goToAboutSection('#aboutStudio')">Studio</span><br/>
          <span v-on:click="expandAbout(), goToAboutSection('#aboutProjects')">Projects</span><br/>
          <span v-on:click="expandAbout(), goToAboutSection('#aboutClients')">Clients</span><br/>
          <span v-on:click="expandAbout(), goToAboutSection('#aboutArchive')">Archive</span>
        </p>
        <p>EN/NL</p>

      </div>
    </div>
    <div class="ignoreMarginTop col-1-3">
      <div v-html="aboutText.indexblurb"></div>
      <p class="aboutHeader">Contact</p>
      <div v-html="aboutText.indexcontact"></div>
    </div>
    <div class="col-1-3">
      <div><img src="http://3.design-milk.com/images/2016/03/Masquespacio-Workspace-interior-1.jpg" /></div>
    </div>
  </div>

  <div v-if="aboutExpanded">
    <div class="grid grid-pad">
      <div class="col-1-3 push-1-3">
        <p class="aboutHeader" id="aboutStudio">Studio</p>
        <div v-html="aboutText.indexblurb"></div>
      </div>
      <div class="col-1-3">

        <p class="aboutHeader" id="aboutProjects">Featured Projects</p>
        <ul>
          <li v-on:click="goToProjectSection(project.slide)" v-for="project in aboutProjectsObject">{{project.project_name}}</li>
        </ul>

        <p class="aboutHeader" id="aboutClients">Clients</p>
        <div v-html="aboutText.indexclients"></div>

      </div>

      <div class="grid grid-pad">
        <templateArchive v-bind:aboutArchiveObject="aboutArchiveObject"></templateArchive>
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
    templateArchive,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      aboutText: Object,
      aboutProjectsObject: Object,
      aboutArchiveObject: Object,
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
          document.querySelector(section).scrollIntoView({
            behavior: 'smooth'
          });
        }, 200);
      } else {
        document.querySelector(section).scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
  },
  created: function() {

    this.$http.get('http://api.template-studio.nl/wp-json/wp/v2/pages?filter[name]=index&fields=acf').then(function(response) {
      this.aboutText = response.body[0].acf
      this.aboutProjectsObject = response.body[0].acf.indexprojects;
      this.aboutArchiveObject = response.body[0].acf.indexarchive;

    })

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

.aboutHeader {
    text-transform: uppercase;
}


</style>
