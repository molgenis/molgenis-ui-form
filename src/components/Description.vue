<template>
  <small :id="id + '-description'" class="form-text text-muted" v-if="description.normal.length">
      <description-urls :description="description.normal"/>
      <div class=" d-inline" v-if="description.long">
        <description-urls v-if="showMore" :description="description.long"/>
        <small><a href="#" @click.prevent="showMore = !showMore">{{ descriptionToggleText }}</a></small>
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
      required: false
    },
    id: {
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
      if (this.text !== null && this.text !== undefined) {
        const items = this.text.split('\n', 2).map(item => this.textURLSplit(item))
        return { normal: items[0], long: items[1] }
      } else {
        return { normal: [], long: [] }
      }
    },
    descriptionToggleText () {
      // check if i18n exists and string has been key-e-fied
      if (this.$t && this.$t('ui-form:form_show_more') !== 'form_show_more') {
        return this.showMore ? this.$t('ui-form:form_show_less') : this.$t('ui-form:form_show_more')
      } else {
        return this.showMore ? '(show less)' : '(show more)'
      }
    }
  }
}
</script>
