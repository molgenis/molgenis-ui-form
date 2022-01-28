<template>
  <span>
    <span v-for="(item, urlIndex) in textURLSplit(description)" :key="`desc-${urlIndex}`">
      <span v-for="(text, breakIndex) in textBreakSplit(item.text)" :key="`desc-text-${breakIndex}`">
        <br v-if="breakIndex>0">
        {{ text }}
      </span>
      <a
        v-if="item.url"
        :key="`url-${urlIndex}`"
        :href="ExternalURL(item.url)"
        target="_blank">
          {{ item.second }}
      </a>
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
  methods: {
    textURLSplit (text) {
      const splittedText = text.split(/(?:[^\S]|^)((?:(?:https?:\/\/)|(?:www\.))(?:\S+))/gi)
      return getTextAndUrls(splittedText)
    },
    textBreakSplit (text) {
      return text.split('{br}')
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
