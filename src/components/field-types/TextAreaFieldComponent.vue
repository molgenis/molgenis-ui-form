<template>
    <div class="form-group">
      <label :for="field.id">{{ field.label }}</label>

      <textarea
        v-validate="{'required': field.required, ['validate-' + field.id]: true}"
        :id="field.id"
        v-model="localValue"
        :name="field.id"
        class="form-control form-control-lg"
        :class="{'is-invalid': errors.has(field.id)}"
        :aria-describedby="field.id + '-description'"
        :disabled="field.disabled">
      </textarea>

      <div v-if="errors.has(field.id)" class="invalid-feedback">
        {{ errors.first(field.id) }}
      </div>

      <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
    </div>
</template>

<script>
  export default {
    name: 'TextAreaFieldComponent',
    props: ['value', 'field'],
    inject: ['$validator'],
    data () {
      return {
        localValue: this.value
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
        this.$emit('dataChange')
      }
    }
  }
</script>
