<template>
  <span>
    <span v-for="(item, index) in description" :key="`desc-${index}`">
      <span>{{ item.text }}</span>
      <a v-if="item.url" :key="`url-${index}`" :href="ExternalURL(item.url)" target="_blank">{{item.url}}</a>
    </span>
  </span>
</template>

<script>
export default {
  name: 'DescriptionUrls',
  props: {
    description: {
      type: Array,
      required: true
    }
  },
  methods: {
    ExternalURL (url) {
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        url = 'https://' + url
      }
      return url
    }
  }
}
</script>
