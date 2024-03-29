<template>
  <!-- Tiny debounce to make sure that validation will always flip the fieldState.$pending flag -->
  <validate :state="fieldState" :custom="{'validate': isValid, 'unique': isUnique}" v-if="options.length > 0" :debounce="1">
    <div class="form-group">
      <label :for="field.id">{{ field.label }}</label>

      <div
        v-for="(option, index) in options"
        class="form-check"
        :aria-describedby="field.id + '-description'"
        :key="option.value"
      >
        <!-- Hardcode input type to prevent compile time errors with dynamic value + v-model on same input  -->
        <input
          :id="field.id + '-' + index"
          v-model="localValue"
          :value="option.value"
          type="radio"
          :name="field.id"
          class="form-check-input"
          :class="{ 'is-invalid' : fieldState && (fieldState.$touched || fieldState.$submitted || fieldState.$dirty) && fieldState.$invalid}"
          :required="isRequired"
          :disabled="field.disabled"
          :bool="localValue === true || localValue === false">
        <label :for="field.id + '-' + index" class="form-check-label">{{ option.label }}</label>
      </div>
      <div class="form-check" v-if="!isRequired && field.addNullOption">
        <input
          :id="field.id + '-null'"
          v-model="localValue"
          type="radio"
          class="form-check-input"
          :name="field.id"
          :value="null">
        <label :for="field.id + '-null'" class="form-check-label">{{ nullOptionLabel }}</label>
      </div>

      <description :id="field.id" :text="field.description" />

      <form-field-messages :field-id="field.id" :field-state="fieldState">
      </form-field-messages>

    </div>
  </validate>
</template>

<script>
import VueForm from 'vue-form'
import { FormField } from '../../flow.types'
import FormFieldMessages from '../FormFieldMessages'
import Description from '../Description'

export default {
  name: 'RadioFieldComponent',
  components: {
    FormFieldMessages, Description
  },
  props: {
    value: {
      // ID of select field can be of type: Integer, Long, String etc.
      type: [String, Number, Boolean],
      required: false
    },
    field: {
      type: FormField,
      required: true
    },
    fieldState: {
      type: Object,
      required: false
    },
    isValid: {
      type: Boolean,
      default: true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    isUnique: {
      type: Function,
      default: () => true
    }
  },
  mixins: [VueForm],
  data () {
    return {
      // Store a local value to prevent changing the parent state
      localValue: this.value,
      options: []
    }
  },
  computed: {
    nullOptionLabel () {
      return this.$t ? this.$t('ui-form:form_boolean_missing') : 'form_boolean_missing'
    }
  },
  watch: {
    localValue () {
      this.$emit('input', this.localValue)

      // Fixes #254. For some reason the vue form does not pick up mouse clicks in some browsers.
      this.fieldState.$dirty = true
      this.fieldState.$pristine = false
      this.fieldState.$touched = true
      this.fieldState.$untouched = false
    }
  },
  created () {
    this.field.options().then(response => {
      this.options = response
    })
  }
}
</script>
