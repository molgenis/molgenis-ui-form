import MultiSelectFieldComponent from '@/components/field-types/MultiSelectFieldComponent'
import { mount } from 'vue-test-utils'
import td from 'testdouble'
import Vue from 'vue'

describe('MultiSelectFieldComponent unit tests', () => {
  let propsData
  const mockEmit = td.function()

  beforeEach(() => {
    propsData = {
      field: {
        id: 'mref',
        label: 'MREF Field',
        type: 'multi-select',
        disabled: false,
        options: (search) => {
          if (!search) {
            return Promise.resolve([
              {
                id: 'ref1',
                label: 'label1',
                value: 'ref1'
              },
              {
                id: 'ref2',
                label: 'label2',
                value: 'ref2'
              },
              {
                id: 'ref3',
                label: 'label3',
                value: 'ref3'
              }])
          } else if (search === 'ref1') {
            return Promise.resolve([
              {
                id: 'ref1',
                label: 'label1',
                value: 'ref1'
              }
            ])
          } else if (Array.isArray(search) && search[0] === 'ref10') {
            return Promise.resolve([
              {
                id: 'ref10',
                label: 'label10',
                value: 'ref10'
              }
            ])
          } else if (search === 'non existing option') {
            return Promise.resolve([])
          }
        },
        isAddOptionAllowed: () => Promise.resolve(true)
      },
      fieldState: {
        $touched: false,
        $submitted: false,
        $invalid: false,
        $dirty: false,
        $pristine: true,
        $untouched: true,
        _addControl: () => null
      },
      isRequired: true,
      isValid: true,
      eventBus: {
        $emit: mockEmit
      }
    }
  })

  it('should fetch with empty search param when no initial value is present', done => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })

    Vue.nextTick(() => {
      Vue.nextTick(() => {
        expect(wrapper.vm.options).to.deep.equal([
          {
            id: 'ref1',
            label: 'label1',
            value: 'ref1'
          },
          {
            id: 'ref2',
            label: 'label2',
            value: 'ref2'
          },
          {
            id: 'ref3',
            label: 'label3',
            value: 'ref3'
          }
        ])
        done()
      })
    })
  })

  it('should show all options on create with a search query when initial value is set', async () => {
    propsData.value = ['ref1', 'ref2']
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })

    await Vue.nextTick()
    expect(wrapper.vm.options).to.deep.equal([
      { id: 'ref1', label: 'label1', value: 'ref1' },
      { id: 'ref2', label: 'label2', value: 'ref2' },
      { id: 'ref3', label: 'label3', value: 'ref3' }
    ])
  })

  it('should fetch a value that is outside the first range on creation', async () => {
    propsData.value = ['ref1', 'ref2', 'ref10']
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })

    await Vue.nextTick() // await the initial request
    await Vue.nextTick() // await the additional search

    expect(wrapper.vm.options).to.deep.equal([
      { id: 'ref1', label: 'label1', value: 'ref1' },
      { id: 'ref2', label: 'label2', value: 'ref2' },
      { id: 'ref3', label: 'label3', value: 'ref3' },
      { id: 'ref10', label: 'label10', value: 'ref10' }
    ])
  })

  it('should set the list of options when searched', done => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    wrapper.vm.fetchOptions('ref1')
    Vue.nextTick(() => {
      Vue.nextTick(() => {
        expect(wrapper.vm.options).to.deep.equal([{
          id: 'ref1', label: 'label1', value: 'ref1'
        }])
        done()
      })
    })
  })

  it('should set an empty option list when search returns nothing', done => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })

    wrapper.vm.fetchOptions('non existing option')
    Vue.nextTick(() => {
      Vue.nextTick(() => {
        expect(wrapper.vm.options).to.deep.equal([])
        done()
      })
    })
  })

  it('should emit an updated value on change', () => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })

    expect(wrapper.vm.fieldState.$dirty).to.equal(false)
    expect(wrapper.vm.fieldState.$pristine).to.equal(true)
    expect(wrapper.vm.fieldState.$touched).to.equal(false)
    expect(wrapper.vm.fieldState.$untouched).to.equal(true)

    wrapper.setData({ localValue: [{ id: 'ref1' }] })

    expect(wrapper.emitted().input[0]).to.deep.equal([['ref1']])

    wrapper.setData({ localValue: [] })
    expect(wrapper.emitted().input[1]).to.deep.equal([[]])

    expect(wrapper.vm.fieldState.$dirty).to.equal(true)
    expect(wrapper.vm.fieldState.$pristine).to.equal(false)
    expect(wrapper.vm.fieldState.$touched).to.equal(true)
    expect(wrapper.vm.fieldState.$untouched).to.equal(false)
  })

  it('should emit an "addOption" event when the "addOptionClicked" function is called', () => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    wrapper.vm.addOptionClicked('myEvent')
    td.verify(mockEmit('addOption', td.matchers.isA(Object), 'myEvent', td.matchers.isA(Object)))
  })

  it('should add the new option to the options list when "afterOptionCreation" is invoked ', () => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    const myOption = {
      id: 'id',
      label: 'label',
      value: 'value'
    }
    wrapper.vm.afterOptionCreation(myOption)
    expect(wrapper.vm.options.pop()).to.deep.equal(myOption)
  })

  it('should set the new option as the selected option when "afterOptionCreation" is invoked ', () => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    const myOption = {
      id: 'id',
      label: 'label',
      value: 'value'
    }
    wrapper.vm.afterOptionCreation(myOption)
    expect(wrapper.vm.localValue.pop()).to.deep.equal(myOption)
  })

  it('should not render the add btn when the field is disabled ', () => {
    propsData.field.disabled = true

    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    expect(wrapper.findAll('.input-group-append').exists()).to.equal(false)
  })

  it('should not render the add btn when the allowAddingOptions property is set to false ', () => {
    propsData.allowAddingOptions = false

    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    expect(wrapper.findAll('.input-group-append').exists()).to.equal(false)
  })

  it('should render the add btn when the allowAddingOptions property is set to true ', async () => {
    propsData.allowAddingOptions = true

    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: { fieldMessages: '<div>This field is required</div>' }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.mg-select-add-btn').exists()).to.equal(true)
  })

  it('should not throw an error if isAddOptionAllowed function is missing from field', async () => {
    propsData.allowAddingOptions = true
    propsData.field.isAddOptionAllowed = undefined

    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: propsData,
      stubs: ['fieldMessages']
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.mg-select-add-btn').exists()).to.equal(true)
  })

  it('should clear selection when clear button is pressed', async () => {
    const wrapper = mount(MultiSelectFieldComponent, {
      propsData: {
        ...propsData,
        value: ['ref2', 'ref3']
      },
      stubs: ['fieldMessages']
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.multiselect__tag').length).to.equal(2)
    wrapper.find('.multiselect__clear').trigger('click')
    expect(wrapper.findAll('.multiselect__tag').length).to.equal(0)
    expect(wrapper.emitted('input')).to.deep.equal([[['ref2', 'ref3']], [[]]])
  })
})
