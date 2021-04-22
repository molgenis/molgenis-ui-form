<template>
  <small :id="id + '-description'" class="form-text text-muted">
    <div v-if="!description.long">
      <description-urls :description="description.normal"/>
    </div>
    <div v-else>
      <div>
        <description-urls :description="description.normal"/>
        <small><a v-if="!showMore" href="#showmore" @click.prevent="showMore=true">(show more)</a></small>
      </div>
      <div v-if="showMore">
        <description-urls :description="description.long"/>
        <small><a href="#showless" @click.prevent="showMore=false">(show less)</a></small>
      </div>
    </div>
  </small>
</template>

<script>
import DescriptionUrls from './DescriptionUrls'

export default {
  name: 'Description',
  components: { DescriptionUrls },
  props: {
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
    // Returns an array of structure [{text, url}, {text, url}, ...]
    // Note: it may be [{text}] if no url is found
    textURLSplit (text) {
      const split = text.split(/(?:[^\S]|^)((?:(?:https?:\/\/)|(?:www\.))(?:\S+))/gi)
      const res = split.reduce((accumulator, current, index, array) => {
        if (index % 2) {
          return accumulator
        } else {
          return [...accumulator, { text: current, url: array[index + 1] }]
        }
      }, [])
      return res
    }
  },
  computed: {
    description () {
      const items = this.text.split('\n', 2).map(item => this.textURLSplit(item))
      return { normal: items[0], long: items[1] }
    }
  }
}
</script>
