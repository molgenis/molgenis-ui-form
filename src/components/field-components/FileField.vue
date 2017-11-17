<template>
    <validate :state="state" :custom="{'custom-validators': field.validators}" :class="{'required-field': required }">

        <label :for="field.id">{{ field.label }}</label>

        <div class="form-group">
            <label class="custom-file">
                <input type="file"
                       @change="updateValue"
                       :class="['form-control', 'custom-file-input', { 'is-invalid' : state && (state.$touched || state.$submitted) && state.$invalid}]"
                       :id="field.id"
                       :name="field.id"
                       :required="required"
                       :disabled="field.disabled"
                       :readonly="field.readOnly"
                       :aria-describedby="field.id + '-description'">

                <span class="custom-file-control"></span>
            </label>

            <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>

            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
                <div class="invalid-message" slot="custom-validators">Your custom validator says no</div>
            </field-messages>
        </div>

    </validate>
</template>

<script>
  /**
   * Generates a form field for file inputs
   *
   * @param field A Field object containing all information to generate a HTML input e.g. disabled
   * @param value The value of the field. Can be set if molgenis-form was called with a data instance.
   * @param formState The formState used by vue-form to register form changes and the validity of the form
   * @param fieldClassName A function used to compute whether a the class on an input should be changed to is-invalid
   */
  export default {
    name: 'file-field',
    props: ['value', 'field', 'required', 'state'],
    data () {
      return {
        localValue: this.value
      }
    },
    methods: {
      updateValue (e) {
        // TODO Is this how we store files?
        this.localValue = e.target.files || e.dataTransfer.files;
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>