<template>
    <validate :state="state" :custom="{'custom-validators': field.validators}" :class="{'required-field': required }">

        <label :for="field.id">{{ field.label }}</label>

        <div class="form-group">
            <div :class="['form-check', {'form-check-inline': options.length < 4}]"
                 v-for="option in options" :aria-describedby="field.id + '-description'">
                <label class="form-check-label">
                    <input type="radio"
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

            <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
                <div class="invalid-message" slot="custom-validators">Your custom validator says no</div>
            </field-messages>
        </div>

    </validate>
</template>


<script>
  export default {
    name: 'radios-field',
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
        if (this.field.options.constructor === Array) {
          return this.field.options
        } else {
          // We have an object retrieved from the server by using field.options.uri
          // api.get
          return [
            {id: '1', value: '1', label: 'Option 1'},
            {id: '2', value: '2', label: 'Option 2'},
            {id: '3', value: '3', label: 'Option 3'},
            {id: '4', value: '4', label: 'Option 4'},
          ]
        }
      }
    }
  }
</script>