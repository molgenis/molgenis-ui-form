  <template>
  <!-- Tiny debounce to make sure that validation will always flip the fieldState.$pending flag -->
  <validate :state="fieldState" :custom="{'validate': isValid}" :debounce="1">
    <div class="form-group">
      <label :for="field.id">{{ field.label }}</label>

      <div class="input-group">
        <multiselect
          :id="field.id"
          :name="field.id"
          :required="isRequired"
          :disabled="field.disabled"
          :class="{
            'is-invalid': fieldState && (fieldState.$touched || fieldState.$submitted || fieldState.$dirty) && fieldState.$invalid,
            'multiselect--clearable': isClearable
          }"
          v-model="localValue"
          openDirection="below"
          :options="options"
          :multiple="true"
          :searchable="true"
          :loading="isLoading"
          :internal-search="false"
          :clear-on-select="true"
          :close-on-select="true"
          :hide-selected="true"
          label="label"
          trackBy="id"
          @search-change="fetchOptions"
        >
          <template slot="clear">
            <button class="multiselect__clear" name="Clear All Values" @click.prevent="clearValue"></button>
          </template>
          <div slot="noOptions">
            <small>{{ noOptionsMessage }}</small>
          </div>
        </multiselect>

        <div v-if="!field.disabled && allowAddingOptions && isAddOptionAllowed" >
          <button @click="addOptionClicked($event)" class="btn btn-outline-secondary mg-select-add-btn" type="button">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>

      </div>
      <description :id="field.id" :text="field.description" />

      <form-field-messages :field-id="field.id" :field-state="fieldState">
      </form-field-messages>

    </div>
  </validate>
</template>

<script>
import VueForm from 'vue-form'
import Multiselect from 'vue-multiselect'
import FormFieldMessages from '../FormFieldMessages'
import Description from '../Description'
import { FormField } from '../../flow.types'

export default {
  name: 'MultiSelectFieldComponent',
  mixins: [VueForm],
  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
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
    eventBus: {
      type: Object,
      required: true
    },
    allowAddingOptions: {
      type: Boolean,
      required: false,
      default: false
    },
    noOptionsMessage: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      // Store a local value to prevent changing the parent state
      localValue: this.value,
      options: [],
      isLoading: false,
      isAddOptionAllowed: true // init as true to allow for backward compatibility
    }
  },
  computed: {
    isClearable () {
      return this.localValue.length
    }
  },
  methods: {
    clearValue () {
      this.localValue = []
    },
    fetchOptions (search) {
      if (search === '') {
        search = undefined
      }
      this.isLoading = true
      this.field.options(search)
        .then(response => { this.options = response })
        .finally(() => { this.isLoading = false })
    },
    addOptionClicked (event) {
      this.eventBus.$emit('addOption', this.afterOptionCreation, event, this.field)
    },
    afterOptionCreation (newOption) {
      this.options = this.options.concat(newOption)
      this.localValue = this.localValue.concat(newOption)
    }
  },
  watch: {
    localValue (newValues) {
      this.fieldState.$dirty = true
      this.fieldState.$pristine = false
      this.fieldState.$touched = true
      this.fieldState.$untouched = false

      // Emit value changes to the parent (form)
      this.$emit('input', newValues.map(value => value.id))
      this.$emit('focus')
      this.$emit('blur')
    }
  },
  created () {
    // Fetch an initial list of options
    this.field.options().then(response => { // Make sure the initial search value is empty
      this.options = response
      // Replace localValue with the entire object so vue-select can use the label property
      // Filter the list of the options based on the actual selected IDs
      // a like query can return more then just your IDs
      if (this.value.length > 0) {
        this.localValue = this.options.filter(option => this.value.includes(option.id))
      }
    })

    if (this.field.isAddOptionAllowed) {
      this.field.isAddOptionAllowed(this.value).then(response => {
        this.isAddOptionAllowed = response
      })
    }
  },
  components: {
    Multiselect,
    FormFieldMessages,
    Description
  }
}
</script>
<style scoped>
  .multiselect {
    width: 1%;
    flex: 1 1 auto;
  }
</style>
