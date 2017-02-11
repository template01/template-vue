<template>
<div class="templateAbout">
  <!-- <h1>{{ aboutText }}</h1> -->
  <div v-html="aboutText.indexblurb"></div>
  <div v-html="aboutText.indexcontact"></div>
  <div v-html="aboutText.indexclients"></div>
  <!-- <div><img src="https://www.placecage.com/600/800"/></div> -->

</div>
</template>

<script>
export default {
  name: 'templateAbout',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      aboutText: Object
    }
  },

  created: function() {

    this.$http.get('http://api.template-studio.nl/wp-json/wp/v2/pages?filter[name]=index&fields=acf').then(function(response) {
      this.aboutText = response.body[0].acf
        // console.log(this.projects)
      // this.initIndexSwiper()

    })

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

img{
  max-width: 100%;
}
</style>
