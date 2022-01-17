import DescriptionUrls from '@/components/DescriptionUrls'
import { shallow } from 'vue-test-utils'

const wrapper = shallow(DescriptionUrls, {
  propsData: {
    description: 'text www.molgenis.com text http://www.molgenis.com text'
  }
})

describe('DescriptionUrls', () => {
  describe('textURLSplit', () => {
    it('should split text from url parts, also for multiple urls with and without protocol', () => {
      var inputText = 'text www.molgenis.com text http://www.molgenis.com text'
      expect(wrapper.vm.textURLSplit(inputText))
        .to.deep.equal([{ text: 'text', url: 'www.molgenis.com' },
          { text: ' text', url: 'http://www.molgenis.com' },
          { text: ' text', url: undefined }])
    })

    it('should also work without a url', () => {
      var inputText = 'text text text'
      expect(wrapper.vm.textURLSplit(inputText))
        .to.deep.equal([{ text: 'text text text', url: undefined }])
    })

    it('should transform urls to be clickable', () => {
      const links = wrapper.findAll('a')
      expect(links.length).to.equal(2)
    })
  })

  describe('ExternalURL', () => {
    it('should add a protocol to url if it has none', () => {
      expect(wrapper.vm.ExternalURL('www.molgenis.com'))
        .to.equal('https://www.molgenis.com')
    })

    it('should not change the url if it already has a protocol', () => {
      expect(wrapper.vm.ExternalURL('http://www.molgenis.com'))
        .to.equal('http://www.molgenis.com')
    })
  })
})
