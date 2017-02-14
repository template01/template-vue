<template>
<div id="archiveWrapper" class="templateArchive">

  <div class="col-1-3">

    <p class="aboutHeader" id="aboutArchive">Archive</p>
    <table>
      <tr>
        <td>Title</td>
        <td>Year</td>
        <td>Type</td>
      </tr>
      <br>
      <tr v-on:click="loadArchive(archiveItem)" v-for="archiveItem in aboutArchiveObject">
        <td>{{archiveItem.item_name}}</td>
        <td>{{archiveItem.item_year}}</td>
        <td>{{archiveItem.item_type[0]}}</td>
      </tr>
    </table>
  </div>


  <div v-if="typeof this.activeArchiveItem != Object" class="col-2-3">
    <p v-html="activeArchiveItem.item_name"></p>
    <p v-html="activeArchiveItem.item_text"></p>
    <div>
      <img v-for="image in activeArchiveItem.item_media" v-bind:src="image.sizes.medium_large" />
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'templateArchive',
  props: ['aboutArchiveObject'],

  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      activeArchiveItem: Object,
    }
  },
  methods: {
    loadArchive: function(active_item) {
      this.activeArchiveItem = active_item
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import '../assets/globalVars.scss';

#archiveWrapper{
  table{
    width: 100%;
    // background: red
    tr:first-of-type{
      td{
        border-bottom: 1px solid slategray;
        // border-top: 1px solid slategray;

      }
    }
    td{
      border-bottom: 1px solid slategray;

    }
  }
}

</style>
