import IconsRenderer from '../../utilities/icons/IconsRenderer'

export default {
  name: 'Icon',
  props: ['icon'],
  data() {
    return {
      iconHTML: IconsRenderer.getIconHTML('ei-' + this.icon),
    }
  }
}
