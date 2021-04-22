import Description from '@/components/Description'
import { shallow } from 'vue-test-utils'

const wrapper = shallow(Description, {
  propsData: {
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
  it('it should generate a read more button', () => {
    const more = wrapper.findAll('small a[href="#showmore"]')
    expect(more.length).to.equal(1)
  })
  it('it should generate a read less button after clicking "read more"', () => {
    const more = wrapper.findAll('small a[href="#showmore"]')
    let less = wrapper.findAll('small a[href="#showless"]')
    expect(less.length).to.equal(0)
    more.trigger('click')
    less = wrapper.findAll('small a[href="#showless"]')
    expect(less.length).to.equal(1)
  })
})
