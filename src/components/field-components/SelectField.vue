<template>
    <validate :custom="{'custom-validators': field.validators}" :class="{'required-field': required }">
        <label :for="field.id">{{ field.label }}</label>

        <div class="form-group">
            <multiselect
                    v-model="localValue"
                    :id="field.id"
                    :name="field.id"
                    interalSearch="false"
                    :options="options"
                    :searchable="true"
                    :multiple="field.options.multiple"
                    :required="required"
                    :disabled="field.disabled"
                    :readonly="field.readOnly"
                    @search-change="getOptions"
                    deselect-label=""
                    select-label=""
                    track-by="id"
                    label="label"
            ></multiselect>

            <small v-if="field.description" :id="field.id + '-description'" class="form-text text-muted">{{ field.description }}</small>

            <!-- Field message shown when input is invalid -->
            <field-messages :name="field.id" show="$touched || $submitted" class="form-control-feedback">
                <div class="invalid-message" slot="required">{{ field.label }} is required</div>
                <div class="invalid-message" slot="custom-validators">Your custom validator says no</div>
            </field-messages>
        </div>

    </validate>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  // import api from '@molgenis/molgenis-api-client'

  export default {
    name: 'select-field',
    props: ['value', 'field', 'required'],
    data () {
      return {
        localValue: this.value,
        options: []
      }
    },
    watch: {
      localValue (value) {
        this.$emit('input', value)
      }
    },
    methods: {
      getOptions (query) {
        // Use this.field.options.uri to query the server
        // api.get(`${this.field.options.uri}?q=*=q=${query}`).then(response => {
        //  return response.items.map(item => {
        //   return {
        //    id:
        //    label:
        //    value:
        //   }
        //  }
        // }
        this.options = [
          {id: '1', label: 'option 1'},
          {id: '2', label: 'option 2'},
          {id: '3', label: 'option 3'}
        ]
      }
    },
    components: {
      Multiselect
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
    .multiselect__tag {
        background-color: #007bff;
    }
</style>