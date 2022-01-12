<template>
    <span>
        <BIconInfoCircleFill variant="primary" id="popover-target-1"/>
        <b-popover target="popover-target-1" triggers="hover" placement="top">
            <template #title>More information</template>
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
    text: {
      type: String,
      required: false
    }
  }
}
</script>
