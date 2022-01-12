<template>
  <small :id="id + '-description'" class="form-text text-muted" v-if="description.normal.length">
    <description-urls :description="description.normal"/>
    <information-icon v-if="description.info">{{description.info}}</information-icon>
    <div v-if="description.long">
      <description-urls v-if="showMore" :description="description.long"/>
      <small><a href="#" @click.prevent="showMore = !showMore">{{ descriptionToggleText }}</a></small>
    </div>
  </small>
</template>

<script>
import DescriptionUrls from './DescriptionUrls'
import InformationIcon from './InformationIcon'

export default {
  name: 'Description',
  components: { DescriptionUrls, InformationIcon },
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
        const info = getInformation(this.text)

        const items = info.text.split('\n', 2).map(item => this.textURLSplit(item))
        return { normal: items[0], long: items[1], info: info.information }
      } else {
        return { normal: [], long: [], info: '' }
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
function getInformation (text) {
  // TODO: multiple i's
  if (text.search('{i}') === -1) {
    return { text, information: '' }
  }
  const firstSplit = text.split('{i}')
  const secondSplit = firstSplit[1].split('{/i}')
  return { text: firstSplit[0] + secondSplit[1], information: secondSplit[0] }
}

</script>
