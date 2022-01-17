import Description from '@/components/Description'
import { mount, shallow } from 'vue-test-utils'

describe('Description unit tests', () => {
  it('description should be able to return all the text without splitting it', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test test'
      }
    })
    expect(wrapper.vm.description).to.deep.equal({ normal: 'test test', long: '', info: '' })
  })

  it('description should split a string on a \\n', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test\ntest'
      }
    })
    expect(wrapper.vm.description).to.deep.equal({ normal: 'test', long: 'test', info: '' })
  })
  it('description should split a string on a \\n and not brake on escaped \\ characters', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test\\ntest'
      }
    })
    expect(wrapper.vm.description).to.deep.equal({ normal: 'test\\ntest', long: '', info: '' })
  })

  it('description should split a string on a \\n and select the text in the information tags', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test\ntest{i}info{/i}'
      }
    })
    expect(wrapper.vm.description).to.deep.equal({ normal: 'test', long: 'test', info: 'info' })
  })

  it('it should show a read more button', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test\ntest'
      }
    })
    const linkButton = wrapper.find('small a[href="#"]')
    expect(linkButton.html()).to.contain('(show more)')
  })

  it('it should have a read less text after clicking "read more"', () => {
    const wrapper = shallow(Description, {
      propsData: {
        id: 'testId',
        text: 'test\ntest'
      }
    })
    const linkButton = wrapper.find('small a[href="#"]')
    // Assert that the button is actually in the show more state
    expect(linkButton.html()).to.contain('(show more)')
    linkButton.trigger('click')
    expect(linkButton.html()).to.contain('(show less)')
  })

  it('should not render description html if the description text is empty', () => {
    const undefinedTextWrapper = mount(Description, {
      propsData: {
        id: 'testId',
        text: ''
      }
    })
    // eslint-disable-next-line no-unused-expressions
    expect(undefinedTextWrapper.html()).to.be.undefined
  })
})
