<template>
    <validate :custom="{'custom-validators': customValidators}" class="form-group row"
              :class="{'required-field': required}">
        <label class=" col-sm-2 col-md-3 col-lg-3 col-form-label">
            {{ field.label }}
        </label>

        <div class="col-sm-10 col-md-9 col-lg-9">
            <input :type="field.type"
                   v-model.lazy="localValue"
                   :class="['form-control', fieldClassName(formState[field.id])]"
                   :id="field.id"
                   :name="field.id"
                   :required="required"
                   :disabled="field.disabled"
                   :readonly="field.readOnly"
                   :aria-describedby="field.id + '-description'">

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
                <div class="invalid-message" slot="number">The submitted value is not a valid number</div>
                <div class="invalid-message" slot="url">Not a valid URL</div>
                <div class="invalid-message" slot="email">Not a valid email value</div>
                <div class="invalid-message" slot="custom-validators">Your custom validator says no</div>
            </field-messages>

            <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
        </div>
    </validate>
</template>

<script>
    import validators from '../../validators'
  /**
   * Generates a form field for text, number, url, and email input types.
   *
   * @param field A Field object containing all information to generate a HTML input e.g. disabled
   * @param value The value of the field. Can be set if molgenis-form was called with a data instance.
   * @param formState The formState used by vue-form to register form changes and the validity of the form
   * @param fieldClassName A function used to compute whether a the class on an input should be changed to is-invalid
   */
  export default {
    name: 'typed-form-field',
    props: ['field', 'value', 'formState', 'fieldClassName', 'required'],
    data () {
      return {
        localValue: this.value
      }
    },
    methods: {
      customValidators (value) {
//        return validators.run(this.field.validators, value)
//        console.log('test', value)
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>