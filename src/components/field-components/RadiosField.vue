<template>
    <validate class="form-group row" :class="{'required-field': required}">
        <label class=" col-sm-2 col-md-3 col-lg-3 col-form-label">
            {{ field.label }}
        </label>

        <div class="col-sm-10 col-md-9 col-lg-9">
            <div :class="['form-check', {'form-check-inline': options.length < 4}]"
                 v-for="option in options" :aria-describedby="field.id + '-description'">
                <label class="form-check-label">
                    <input type="radio"
                           v-model.lazy="localValue"
                           :class="['form-check-input', fieldClassName(formState[field.id])]"
                           :id="field.id"
                           :name="field.id"
                           :value="option.value"
                           :required="required"
                           :disabled="field.disabled"
                           :readonly="field.readOnly"
                           :aria-describedby="field.id + '-description'"> {{ option.label }}
                </label>
            </div>

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
            </field-messages>

            <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
        </div>
    </validate>
</template>


<script>
  /**
   * Generates a form field for radio group inputs
   *
   * @param field A Field object containing all information to generate a HTML input e.g. disabled
   * @param value The value of the field. Can be set if molgenis-form was called with a data instance.
   * @param formState The formState used by vue-form to register form changes and the validity of the form
   * @param fieldClassName A function used to compute whether a the class on an input should be changed to is-invalid
   */
  export default {
    name: 'radios-field',
    props: ['field', 'value', 'formState', 'fieldClassName', 'required'],
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