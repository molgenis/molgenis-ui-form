<template>
    <validate class="form-group row" :class="{'required-field': required}">
        <label class=" col-sm-2 col-md-3 col-lg-3 col-form-label">
            {{ field.label }}
        </label>

        <div class="col-sm-10 col-md-9 col-lg-9">
            <flat-pickr v-model="localValue"
                        :class="['form-control', fieldClassName(formState[field.id])]"
                        :config="config"
                        :id="field.id"
                        :name="field.id"
                        :required="required"
                        :disabled="field.disabled"
                        :readonly="field.readOnly"
                        :aria-describedby="field.id + '-description'"></flat-pickr>

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
            </field-messages>

            <small :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>
        </div>
    </validate>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

  /**
   * Generates a form field for date-time inputs with flatPickr (https://github.com/ankurk91/vue-flatpickr-component)
   *
   * @param field A Field object containing all information to generate a HTML input e.g. disabled
   * @param value The value of the field. Can be set if molgenis-form was called with a data instance.
   * @param formState The formState used by vue-form to register form changes and the validity of the form
   * @param fieldClassName A function used to compute whether a the class on an input should be changed to is-invalid
   */
  export default {
    name: 'date-time-field',
    props: ['field', 'value', 'formState', 'fieldClassName', 'required'],
    data () {
      return {
        localValue: this.value,
        config: {
          allowInput: true,
          enableTime: true
        }
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    },
    components: {
      flatPickr
    }
  }
</script>