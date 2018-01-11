<template>
  <validate :state="state" :custom="{'validate': validate(field)}" v-if="options.length > 0">
    <div class="form-group">
      <label :for="field.id">{{ field.label }}</label>

      <select v-model="localValue" :name="field.id" class="form-control" :id="field.id">
        <!-- Add a dummy option to make it work on iOS -->
        <!-- https://vuejs.org/v2/guide/forms.html#Select -->
        <option disabled value="">Select an option...</option>
        <option v-for="(option, index) in options" :value="option.value">
          {{ option.value }}
        </option>
      </select>

      <small :id="field.id + '-description'" class="form-text text-muted">
        {{ field.description }}
      </small>

      <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
        <div slot="required">This field is required</div>
        <div slot="validate">Validation failed</div>
      </field-messages>
    </div>
  </validate>
</template>

<script>
  import VueForm from 'vue-form'

  export default {
    name: 'SingleSelectFieldComponent',
    mixins: [VueForm],
    props: ['value', 'field', 'state', 'validate'],
    data () {
      return {
        // Store a local value to prevent changing the parent state
        localValue: this.value,
        options: []
      }
    },
    watch: {
      localValue (value) {
        // Emit value changes to the parent (form)
        this.$emit('input', value)
        // Emit value changes to trigger the hooks.onValueChange
        // Do not use input event for this to prevent unwanted behavior
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