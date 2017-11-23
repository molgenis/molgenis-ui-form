<template>
    <validate :custom="{'custom-validators': field.validators}" :class="{'required-field': required }">
        <label :for="field.id">{{ field.label }}</label>

        <div class="form-group">
            <multiselect v-model="localValue"
                         :id="field.id"
                         :name="field.id"
                         :options="options"
                         :searchable="true"
                         :multiple="field.options.multiple"
                         :required="required"
                         :disabled="field.disabled"
                         :readonly="field.readOnly"
                         @search-change="query"
                         deselect-label=""
                         select-label=""
                         track-by="id"
                         label="label">
            </multiselect>

            <small v-if="field.description" :id="field.id + '-description'" class="form-text text-muted">
                {{ field.description }}
            </small>

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
                <div class="invalid-message" slot="custom-validators">Your custom validator says no</div>
            </field-messages>
        </div>

    </validate>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
  import Multiselect from 'vue-multiselect'
  // import api from '@molgenis/molgenis-api-client'

  export default {
    name: 'select-field',
    props: ['value', 'field', 'required'],
    data () {
      return {
        localValue: this.value,
        options: this.field.options.options
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    },
    methods: {
      query (query) {
        if (this.field.options.uri) {
          // Call API for data
          // get(this.field.options.uri + '?q=*=q=' + query).then(response => {
          //    return response.items
          // })
          this.options = [
            {id: '1', value: '1', label: 'Option 1'},
            {id: '2', value: '2', label: 'Option 2'},
            {id: '3', value: '3', label: 'Option 3'},
            {id: '4', value: '4', label: 'Option 4'}
          ]
        }
      }
    },
    components: {
      Multiselect
    }
  }
</script>