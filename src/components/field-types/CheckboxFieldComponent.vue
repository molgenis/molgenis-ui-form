<template>
  <div class="form-group">
    <label :for="field.id">{{ field.label }}</label>

    <!-- Hardcode input type to prevent compile time errors with dynamic value + v-model on same input  -->
    <div v-for="(option, index) in options" class="form-check" :aria-describedby="field.id + '-description'">
      <input
        v-validate="{'required': field.required, ['validate-' + field.id]: true}"
        :id="field.id + '-' + index"
        v-model="localValue"
        :value="option.value"
        type="checkbox"
        :name="field.id"
        class="form-check-input"
        :class="{'is-invalid': errors.has(field.id)}"
        :disabled="field.disabled">

      <label :for="field.id + '-' + index" class="form-check-label">{{ option.label }}</label>
    </div>

    <!-- Errors not shown: https://github.com/twbs/bootstrap/issues/23454 -->
    <div v-if="errors.has(field.id)" class="invalid-feedback">
      {{ errors.first(field.id) }}
    </div>

    <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
  </div>
</template>

<script>
  export default {
    name: 'CheckboxFieldComponent',
    props: {
      value: {
        type: Array,
        required: false,
        default: () => []
      },
      field: {
        type: Object,
        required: true
      }
    },
    inject: ['$validator'],
    data () {
      return {
        localValue: this.value,
        options: []
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
        this.$emit('dataChange')
      }
    },
    created () {
      this.field.options().then(response => {
        this.options = response
      })
    }
  }
</script>
