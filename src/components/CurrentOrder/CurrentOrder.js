import OrderInfo from '../OrderInfo/index'

export default {
  name: 'CurrentOrder',
  components: [
    OrderInfo,
  ],
  props: ['order'],

  data() {
    return {}
  },
}
