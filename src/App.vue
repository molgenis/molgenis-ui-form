<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <hr>
                <blockquote class="blockquote text-center">
                    <h1 class="display-3">MOLGENIS Forms</h1>
                    <footer class="blockquote-footer">Powered by<cite title="Source Title">Vue.js</cite></footer>
                </blockquote>
                <hr>
                <div class="card">
                    <div class="card-header">
                        <h5>{{ schema.label }} Form</h5>
                    </div>
                    <div class="card-body text-centre">
                        <molgenis-form
                                id="form"
                                type="molgenis-entity"
                                :schema="schema"
                                :data="data"
                                :readOnlyForm="false"
                                :onSubmit="onSubmit"
                                :onCancel="onCancel">
                        </molgenis-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import MolgenisForm from './components/MolgenisForm.vue'
  import data from './data'

  export default {
    name: 'app',
    data () {
      return {
        schema: data.schema,
        data: data.data
      }
    },
    methods: {
      onSubmit (content) {
        console.log('This is the form content ', content)
      },
      onCancel () {
        console.log('You canceled my form :(')
      }
    },
    components: {
      MolgenisForm
    }
  }
</script>