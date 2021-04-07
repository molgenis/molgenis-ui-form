<template>
  <small :id="id + '-description'" class="form-text text-muted">
    <div v-if="description.length == 1">
      <span>{{description[0][0][0]}}</span>
    </div>
    <div v-else>
      <div>
        <span v-for="(item, index) in description[0]" :key="`short-desc-${index}`">
          <span>{{ item[0] }}</span>
          <a v-if="item[1]" :href="item[1]">{{item[1]}}</a>
        </span>
        <a v-if="!showMore" href="#showmore" @click.prevent="showMore=true">(show more)</a></div>
      <div v-if="showMore">
        <span v-for="(item, index) in description[1]" :key="`long-desc-${index}`">
          <span>{{ item[0] }}</span>
          <a v-if="item[1]" :href="item[1]">{{item[1]}}</a>
        </span>
        <a href="#showless" @click.prevent="showMore=false">(show less)</a></div>
    </div>
  </small>
</template>

<script>
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
    // Returns an array like [[text, url], [text, url], [text, url], ...]
    // Note it may be [[text]] if no url found
    textURLSplit (text) {
      const split = text.split(/(?:[^\S]|^)((?:(?:https?:\/\/)|(?:www\.))(?:\S+))/gi)
      const res = split.reduce((accumulator, current, index, array) => {
        if (index % 2) {
          return accumulator
        } else {
          return [...accumulator, [current, array[index + 1]]]
        }
      }, [])
      return res
    }
  },
  computed: {
    description () {
      return this.text.split('\n', 2).map(item => this.textURLSplit(item))
    }
  }
}
</script>
