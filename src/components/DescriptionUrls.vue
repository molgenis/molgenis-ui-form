<template>
  <span>
    <span v-for="(item, index) in descriptionSplit" :key="`desc-${index}`">
      <span>{{ item.text }}</span>
      <a
        v-if="item.url"
        :key="`url-${index}`"
        :href="ExternalURL(item.url)"
        target="_blank"
        >{{ item.url }}</a
      >
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
    // Note: split may be [{text}] if no url is found
    textURLSplit (text) {
      const splittedText = text.split(/(?:[^\S]|^)((?:(?:https?:\/\/)|(?:www\.))(?:\S+))/gi)
      return getTextAndUrls(splittedText)
    },
    ExternalURL (url) {
      if (!url.match(/^http/gmi)) {
        return 'https://' + url
      } else {
        return url
      }
    }
  }
}

function getTextAndUrls (splittedText) {
  return splittedText.reduce((accumulator, current, index) => {
    if (index % 2) {
      return accumulator
    } else {
      return [...accumulator, { text: current, url: splittedText[index + 1] }]
    }
  }, [])
}
</script>
