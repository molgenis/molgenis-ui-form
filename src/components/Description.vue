<template>
  <small :id="id + '-description'" class="form-text text-muted">
    <div v-if="description.length == 1" v-html="description"></div>
    <div v-else>
      <div><span v-html="description[0]" /> <a v-if="!showMore" href="#showmore" @click.prevent="showMore=true">(show more)</a></div>
      <div v-if="showMore"><span v-html="description[1]" />  <a href="#showless" @click.prevent="showMore=false">(show less)</a></div>
    </div>
  </small>
</template>

<script>
// TODO: add show more
// TODO: add automatic url to link
export default {
  name: 'Description',
  props: {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMore: false
    }
  },
  methods: {
    addLinks (text) {
      // based on: https://www.labnol.org/code/20294-regex-extract-links-javascript
      return (text || '').replace(
        /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
        function (match, space, url) {
          let hyperlink = url
          if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink
          }
          return space + '<a target="_blank" href="' + hyperlink + '">' + url + '</a>'
        }
      )
    }
  },
  computed: {
    description () {
      return this.text.split('\n', 2).map(item => this.addLinks(item))
    }
  }
}
</script>
