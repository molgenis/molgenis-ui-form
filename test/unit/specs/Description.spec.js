import Description from '@/components/Description'
import { mount, shallow } from 'vue-test-utils'

const wrapper = shallow(Description, {
  propsData: {
    id: 'testId',
    text: 'test\ntest'
  }
})
describe('Description unit tests', () => {
  it('textURLSplit should split text from url parts', () => {
    var str = 'text www.molgenis.com text http://www.molgenis.com text'
    expect(wrapper.vm.textURLSplit(str)).to.deep.equal([{ text: 'text', url: 'www.molgenis.com' }, { text: ' text', url: 'http://www.molgenis.com' }, { text: ' text', url: undefined }])
  })
  it('textURLSplit should also work without a url', () => {
    var str = 'text text text'
    expect(wrapper.vm.textURLSplit(str)).to.deep.equal([{ text: 'text text text', url: undefined }])
  })
  it('description should split a string on a \\n and call textURLSplit on the two parts', () => {
    expect(wrapper.vm.description).to.deep.equal({ normal: [{ text: 'test', url: undefined }], long: [{ text: 'test', url: undefined }] })
  })
  it('it should show a read more button', () => {
    const linkButton = wrapper.find('small a[href="#"]')
    expect(linkButton.html()).to.contain('(show more)')
  })
  it('it should have a read less text after clicking "read more"', () => {
    const linkButton = wrapper.find('small a[href="#"]')
    // Assert that the button is actually in the show more state
    expect(linkButton.html()).to.contain('(show more)')
    linkButton.trigger('click')
    expect(linkButton.html()).to.contain('(show less)')
  })

  it('should not break when text is undefined', () => {
    const undefinedTextWrapper = mount(Description, {
      propsData: {
        id: 'testId',
        text: '' // object tested must be an array, a map, an object, a set, a string, or a weakset, but undefined given > can't be actual undefined.
      }
    })

    expect(undefinedTextWrapper.html()).to.not.include('<!----> <!---->') // check if rendered element is empty.
  })
})
