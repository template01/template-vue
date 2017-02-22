<template>
<div id="archiveWrapper" class="templateArchive">
  <div class="col-1-3">

    <p class="aboutHeader">Archive</p>
    <table>
      <tr>
        <td v-bind:class="{ sortDirectionClassActive: sortDirectionClass[0] }" @click="sortByInput('item_name',0)">Title</td>
        <td v-bind:class="{ sortDirectionClassActive: sortDirectionClass[2] }" @click="sortByInput('item_type',2)">Type</td>
        <td v-bind:class="{ sortDirectionClassActive: sortDirectionClass[1] }" @click="sortByInput('item_year',1)">Year</td>

      </tr>
      <br>
      <tr v-on:click="loadArchive(item)" v-for="(item, index) in orderBy(aboutArchiveObjectImported, this.sortBy, this.sortDirection)">
        <td class="itemname">{{item.item_name}}</td>
        <td class="itemtype">{{item.item_type[0]}}</td>
        <td class="itemyear">{{item.item_year}}</td>
        <!-- {{sortDirection[0]}} -->
      </tr>
    </table>
  </div>
  <div id="aboutArchiveLoadedItem" class="col-2-3">
    <div v-if="this.archiveItemLoaded">

      <div v-if="typeof this.activeArchiveItem != Object" class="col-1-2">
        <p>
          <span v-html="activeArchiveItem.item_name"></span> (<span v-html="activeArchiveItem.item_year"></span>,
          <span v-html="activeArchiveItem.item_type[0]"></span>)
        </p>
        <p v-html="activeArchiveItem.item_text"></p>

      </div>

      <img v-for="image in activeArchiveItem.item_media" v-bind:src="image.sizes.large" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'templateArchive',
  props: ['aboutArchiveObject', 'aboutSmoothScroll'],

  data() {

    return {
      activeArchiveItem: {
        "item_name": '',
        "item_year": '',
        "item_text": '',
        "item_type": ['']
      },
      archiveItemLoaded: false,
      archiveList: Object,
      sortDirection: -1,
      sortDirectionClass: [true, true, true],
      aboutArchiveObjectImported: [],
      firstDirection: true,
      sortBy: 'item_year'
    }
  },
  methods: {
    loadArchive: function(input) {
      this.archiveItemLoaded = true
      this.activeArchiveItem = input
      if (this.aboutSmoothScroll) {
        document.querySelector('#aboutArchiveLoadedItem').scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        setTimeout(function() {
          document.getElementById('about').scrollTop = document.querySelector('#aboutArchiveLoadedItem').offsetTop;
          
        },1)
      }
    },
    sortByInput: function(sortByInput, index) {
      this.$set(this.sortDirectionClass, index, !this.sortDirectionClass[index])
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
      if (this.aboutArchiveObjectImported.length === 0) {
        this.aboutArchiveObjectImported = this.aboutArchiveObject
      }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">@import '../assets/globalVars.scss';
@import '../assets/aboutSectionStyle.scss';
#archiveWrapper {
    table {

        table-layout: fixed;
        width: 100%;
        tr:first-of-type {
            td {
                border-bottom: 1px solid slategray;
                &:hover {
                    font-weight: bold;
                }
                cursor: n-resize;
                &.sortDirectionClassActive {
                    cursor: s-resize;

                }
            }
        }
        td:nth-of-type(1) {
            width: 40%;
            max-width: 40%;
        }
        td:nth-of-type(2) {
            width: 40%;
            max-width: 40%;

        }
        td:nth-of-type(3) {
            width: 20%;
            max-width: 20%;
        }
        tr:not(:first-of-type) {
            cursor: pointer;
            td {
                border-bottom: 1px solid slategray;

            }
            td:nth-of-type(1) {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

            }
            td:nth-of-type(2) {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

            }
            td:nth-of-type(3) {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            &:hover {
                font-weight: bold;
            }
        }

    }

    img {
        max-width: 100%;
    }

}
</style>
