<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <hr>

                <blockquote class="blockquote text-center">
                    <h1 class="display-3">MOLGENIS Vue Forms</h1>
                    <footer class="blockquote-footer">Powered by<cite title="Source Title">Vue.js</cite></footer>
                </blockquote>

                <hr>

                <div class="card">
                    <div class="card-header">
                        <h5>Example Form</h5>
                    </div>

                    <div class="card-body text-centre">
                        <!-- The magic call to render the form -->
                        <molgenis-vue-form id="example-form"
                                       :fields="fields"
                                       :data="data"
                                       :options="options">
                        </molgenis-vue-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import MolgenisVueForm from './components/MolgenisVueForm.vue'
  import utils from './utils'
  import restResponse from './data'

  // Example data + schema is generated from a MOLGENIS Rest API V2 response
  export default {
    name: 'app',
    data () {
      return {
        fields: utils.generateFormFields(restResponse.schema),
        options: {
          readonly: false,
          onSubmit: (formdata) => console.log('This is the form content ', formdata),
          onCancel: () => console.log('You canceled my form :(')
        }
      }
    },
    computed: {
      data () {
        return utils.generateFormData(this.fields, restResponse.data)
      }
    },
    components: {
      MolgenisVueForm
    }
  }
</script>