<template>
  <small :id="id + '-description'" class="form-text text-muted" v-if="description.normal.length">
    <description-urls :description="description.normal"/>
    <information-icon :id="id" v-if="description.info" title="More information">
      <description-urls :description="description.info"/>
    </information-icon>
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
  computed: {
    description () {
      if (this.text !== null && this.text !== undefined) {
        const info = getInformation(this.text)
        const enterLocation = info.text.indexOf('\n')
        if (enterLocation !== -1) {
          return { normal: info.text.substring(0, enterLocation), long: info.text.substring(enterLocation + 1), info: info.information }
        } else {
          return { normal: info.text, long: '', info: info.information }
        }
      } else {
        return { normal: '', long: '', info: '' }
      }
    },
    descriptionToggleText () {
      if (useInternationalisation(this.$t)) {
        return this.showMore ? this.$t('ui-form:form_show_less') : this.$t('ui-form:form_show_more')
      } else {
        return this.showMore ? '(show less)' : '(show more)'
      }
    }
  }
}
function useInternationalisation ($t) {
  return $t &&
    $t('ui-form:form_show_more') !== 'form_show_more' &&
    $t('ui-form:form_show_less') !== 'form_show_less'
}
function getInformation (text) {
  const firstSplit = text.split('{i}')
  if (firstSplit.length === 2 && text.search('{/i}') !== -1) {
    const secondSplit = firstSplit[1].split('{/i}')
    return { text: firstSplit[0] + secondSplit[1], information: secondSplit[0] }
  } else {
    return { text, information: '' }
  }
}
</script>
