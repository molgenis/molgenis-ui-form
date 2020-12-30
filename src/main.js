// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import ExamplePage from './example/ExamplePage'
import UpdateEntityExample from './example/entity/UpdateEntityExample'
import CreateEntityExample from './example/entity/CreateEntityExample'
import IntegerExample from './example/number-field/IntegerExample'
import LongExample from './example/number-field/LongExample'
import DecimalExample from './example/number-field/DecimalExample'
import UniqueExample from './example/unique/UniqueExample'
import DateTimeExample from './example/date/DateTimeExample'
import FileExample from './example/file/FileExample'
import AgeExample from './example/validation-functions/AgeExample'
import RadioExample from './example/radio/RadioExample'
import MaxLengthExample from './example/max-length/MaxLengthExample'
import SingleSelectExample from './example/single-select/SingleSelectExample'
import MultiSelectExample from './example/multi-select/MultiSelectExample'
import CompoundExample from './example/compound/CompoundExample'
import ErrorExample from './example/validation-functions/ErrorExample'
import MapperErrorExample from './example/validation-functions/MapperErrorExample'
import i18n from '@molgenis/molgenis-i18n-js'

Vue.config.productionTip = false

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/update-entity',
      component: UpdateEntityExample
    },
    {
      path: '/create-entity',
      component: CreateEntityExample
    },
    {
      path: '/integer/',
      component: IntegerExample
    },
    {
      path: '/long/',
      component: LongExample
    },
    {
      path: '/decimal/',
      component: DecimalExample
    },
    {
      path: '/unique/',
      component: UniqueExample
    },
    {
      path: '/date-time/',
      component: DateTimeExample
    },
    {
      path: '/file/',
      component: FileExample
    },
    {
      path: '/age/',
      component: AgeExample
    },
    {
      path: '/radio/',
      component: RadioExample
    },
    {
      path: '/max-length/',
      component: MaxLengthExample
    },
    {
      path: '/single-select/',
      component: SingleSelectExample
    },
    {
      path: '/multi-select/',
      component: MultiSelectExample
    },
    {
      path: '/compound/',
      component: CompoundExample
    },
    {
      path: '/',
      redirect: '/update-entity'
    },
    {
      path: '/eval-error/',
      component: ErrorExample
    },
    {
      path: '/mapper-error/',
      component: MapperErrorExample
    }]
})

Vue.use(i18n, {
  lng: 'en',
  fallbackLng: 'en',
  namespace: ['ui-form'],
  callback () {
    /* eslint-disable no-new */
    new Vue({
      el: '#form-demo',
      router,
      template: '<ExamplePage/>',
      components: { ExamplePage }
    })
  }
})
