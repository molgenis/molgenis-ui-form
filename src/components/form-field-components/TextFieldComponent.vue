<template>
  <validate :state="state">
    <div class="form-group">
      <label for="text-field">Text example</label>

      <input id="text-field"
             v-model="localValue"
             type="text"
             name="text-field"
             class="form-control form-control-lg"
             :class="{ 'is-invalid' : state && (state.$touched || state.$submitted) && state.$invalid}"
             aria-describedby="text-description"
             required>

      <small id="text-description" class="form-text text-muted">
        This is the description for 'Test example'
      </small>

      <field-messages name="text-field" show="$touched || $submitted" class="form-control-feedback">
        <div slot="required">This field is required</div>
      </field-messages>
    </div>
  </validate>
</template>

<script>
  export default {
    name: 'text-field-component',
    props: ['value', 'state'],
    data () {
      return {
        // Store a local value to prevent changing the parent state
        localValue: this.value
      }
    },
    watch: {
      localValue (value) {
        // Emit value changes to the parent (form)
        this.$emit('input', value)
      }
    }
  }
</script>
