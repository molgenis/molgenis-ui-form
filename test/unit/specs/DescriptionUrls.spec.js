import DescriptionUrls from '@/components/DescriptionUrls'
import { shallow } from 'vue-test-utils'

const wrapper = shallow(DescriptionUrls, {
  propsData: {
    description: [{ text: 'text', url: 'www.molgenis.com' }, { text: ' text', url: 'http://www.molgenis.com' }, { text: ' text', url: undefined }]
  }
})
describe('DescriptionUrls unit tests', () => {
  it('it should transfrom urls to be clickable', () => {
    const links = wrapper.findAll('a')
    expect(links.length).to.equal(2)
  })
})
