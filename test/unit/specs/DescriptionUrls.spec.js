import DescriptionUrls from '@/components/DescriptionUrls'
import { shallow } from 'vue-test-utils'

const wrapper = shallow(DescriptionUrls, {
  propsData: {
    description: 'text www.molgenis.com text http://www.molgenis.com text'
  }
})
describe('DescriptionUrls unit tests', () => {
  it('textURLSplit should split text from url parts', () => {
    var str = 'text www.molgenis.com text http://www.molgenis.com text'
    expect(wrapper.vm.textURLSplit(str)).to.deep.equal([{ text: 'text', url: 'www.molgenis.com' }, { text: ' text', url: 'http://www.molgenis.com' }, { text: ' text', url: undefined }])
  })
  it('textURLSplit should also work without a url', () => {
    var str = 'text text text'
    expect(wrapper.vm.textURLSplit(str)).to.deep.equal([{ text: 'text text text', url: undefined }])
  })
  it('should transform urls to be clickable', () => {
    const links = wrapper.findAll('a')
    expect(links.length).to.equal(2)
  })
})
