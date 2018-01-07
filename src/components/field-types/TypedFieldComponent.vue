<template>
  <div class="form-group">
    <label :for="field.id">{{ field.label }}</label>

    <input
      v-validate="{'required': field.required, 'email': field.type === 'email','url': field.type === 'url',['validate-' + field.id]: true}"
      :id="field.id"
      v-model="localValue"
      :type="field.type"
      :name="field.id"
      class="form-control form-control-lg"
      :class="{'is-invalid': errors.has(field.id)}"
      :aria-describedby="field.id + '-description'"
      :disabled="field.disabled">

    <div v-if="errors.has(field.id)" class="invalid-feedback">
      {{ errors.first(field.id) }}
    </div>

    <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
  </div>
</template>

<script>
  export default {
    name: 'TypedFieldComponent',
    props: ['value', 'field'],
    // Inject validator state to enable form wide validation on submit
    inject: ['$validator'],
    data () {
      return {
        // Store a local value to prevent changing the parent state
        localValue: this.value
      }
    },
    watch: {
      localValue (value) {
        // Emit value changes to the listening v-model
        this.$emit('input', value)

        // Emit value changes to trigger the hooks.onValueChange
        // Do not use input event for this to prevent unwanted behavior
        this.$emit('dataChange')
      }
    }
  }
</script>
