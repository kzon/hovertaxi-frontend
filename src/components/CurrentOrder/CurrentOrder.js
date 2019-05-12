import OrderInfo from '../OrderInfo/index'
import Icon from '../Icon/index'

export default {
  name: 'CurrentOrder',
  components: {
    Icon,
    OrderInfo,
  },
  props: ['order'],

  data() {
    return {}
  },
}
