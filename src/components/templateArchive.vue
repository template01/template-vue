<template>
<div id="archiveWrapper" class="templateArchive">
  <div class="col-1-3">

    <p class="aboutHeader" id="aboutArchive">Archive</p>
    <table>
      <tr>
        <td @click="sortByInput('item_name',0)">Title</td>
        <td @click="sortByInput('item_year',1)">Year</td>
        <td @click="sortByInput('item_type',2)">Type</td>
      </tr>
      <br>
        <tr v-on:click="loadArchive(item)" v-for="(item, index) in orderBy(aboutArchiveObjectImported, this.sortBy, this.sortDirection)">
          <td class="itemname">{{item.item_name}}</td>
          <td class="itemyear">{{item.item_year}}</td>
          <td class="itemtype">{{item.item_type[0]}}</td>
          <!-- {{sortDirection[0]}} -->
        </tr>
    </table>
  </div>
  <div v-if="typeof this.activeArchiveItem != Object" class="col-2-3">

  <div v-if="typeof this.activeArchiveItem != Object" class="col-1-2">
    <p v-html="activeArchiveItem.item_name"></p>
    <p v-html="activeArchiveItem.item_text"></p>

  </div>

    <img v-for="image in activeArchiveItem.item_media" v-bind:src="image.sizes.large" />
  </div>
</div>
</template>

<script>
export default {
  name: 'templateArchive',
  props: ['aboutArchiveObject'],

  data() {

    return {
      activeArchiveItem: Object,
      archiveList: Object,
      sortDirection: -1,
      aboutArchiveObjectImported: [],
      firstDirection: true,
      sortBy: 'item_year'
    }
  },
  methods: {
    loadArchive: function(input) {
      this.activeArchiveItem = input
    },
    sortByInput: function(sortByInput, index) {
      var oldSortby = this.sortBy
      this.sortBy = sortByInput
      if (oldSortby === this.sortBy) {
        switch (this.sortDirection) {
          case 1:
            this.sortDirection = -1
            break;
          case -1:
            this.sortDirection = 1
          default:
            break;
        }
      }
    }

  },

  watch: {
    aboutArchiveObject: function() {
      console.log(this.aboutArchiveObject)
      this.aboutArchiveObjectImported = this.aboutArchiveObject

    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/globalVars.scss';

#archiveWrapper {
    table {

      table-layout: fixed;

        width: 100%;
        // background: red
        tr:first-of-type {
            td {
                border-bottom: 1px solid slategray;
                // border-top: 1px solid slategray;

            }
        }
        td {
            border-bottom: 1px solid slategray;

        }

        td:nth-of-type(1){
          width: 50%;
          max-width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }
        td:nth-of-type(2){
          width: 20%;
          max-width: 20%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }
        td:nth-of-type(3){
          width: 30%;
          max-width: 30%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        tr:hover{
          font-weight: bold;
        }

    }

    img{
      max-width: 100%;
    }

}
</style>
