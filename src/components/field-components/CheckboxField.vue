<template>
    <validate :state="state" :custom="{'custom-validators': field.validators}" :class="{'required-field': required }">

        <label :for="field.id">{{ field.label }}</label>

        <div class="form-group">
            <div class="form-check" v-for="option in options" :aria-describedby="field.id + '-description'">
                <label class="form-check-label">
                    <input type="checkbox"
                           v-model.lazy="localValue"
                           :class="['form-check-input', { 'is-invalid' : state && (state.$touched || state.$submitted) && state.$invalid}]"
                           :id="field.id"
                           :name="field.id"
                           :value="option.value"
                           :required="required"
                           :disabled="field.disabled"
                           :readonly="field.readOnly"
                           :aria-describedby="field.id + '-description'"> {{ option.label }}
                </label>
            </div>

            <small v-if="field.description" :id="field.id + '-description'" class="form-text text-muted">
                {{ field.description }}
            </small>
        </div>

    </validate>
</template>

<script>
  export default {
    name: 'checkbox-field',
    props: ['value', 'field', 'required', 'state'],
    data () {
      return {
        localValue: this.value
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    },
    computed: {
      options () {
        if (this.field.options.uri) {
          return [
            {id: '1', value: '1', label: 'Option 1'},
            {id: '2', value: '2', label: 'Option 2'},
            {id: '3', value: '3', label: 'Option 3'},
            {id: '4', value: '4', label: 'Option 4'}
          ]
        } else {
          return this.field.options.options
        }
      }
    }
  }
</script>