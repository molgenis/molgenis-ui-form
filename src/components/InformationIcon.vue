<template>
    <span>
        <BIconInfoCircleFill variant="primary" :id="`popover-target-${id}`" ref="InformationIcon"/>
        <b-popover :target="`popover-target-${id}`" triggers="hover" placement="top">
            <template #title>{{title}}</template>
            <slot></slot>
        </b-popover>
    </span>
</template>

<script>
import { BIconInfoCircleFill } from 'bootstrap-vue'

export default {
  name: 'InformationIcon',
  components: { BIconInfoCircleFill },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  }
}
</script>
