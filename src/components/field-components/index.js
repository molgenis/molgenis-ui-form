import CheckboxField from './CheckboxField.vue'
import DateTimeField from './DateTimeField.vue'
import FileField from './FileField.vue'
import TypedFormField from './TypedFormField.vue'
import RadiosField from './RadiosField.vue'
import SelectField from './SelectField.vue'
import TextAreaField from './TextAreaField.vue'

export default {
  /**
   * Generates a form field for checkbox group inputs
   */
  CheckboxField,
  /**
   * Generates a form field for date and date-time inputs with flatPickr (https://github.com/ankurk91/vue-flatpickr-component)
   */
  DateTimeField,
  /**
   * Generates a form field for file inputs
   */
  FileField,
  /**
   * Generates a form field for radio group inputs
   */
  RadiosField,
  /**
   * Generates a form field for select inputs with Vue Multiselect (https://github.com/monterail/vue-multiselect)
   */
  SelectField,
  /**
   * Generates a form field with a textarea element
   */
  TextAreaField,
  /**
   * Generates a form field for text, number, url, and email input types.
   */
  TypedFormField
}