<template>
  <span>
    <span v-for="(item, index) in descriptionSplit" :key="`desc-${index}`">
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
      type: String,
      required: true
    }
  },
  computed: {
    descriptionSplit () {
      return this.textURLSplit(this.description)
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
    },
    ExternalURL (url) {
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        url = 'https://' + url
      }
      return url
    }
  }
}
</script>
