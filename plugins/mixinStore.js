import { Cart } from '~/models/Cart'

const mixinStore = {
  computed: {
    cart () {
      return new Cart(this.$store.getters['cart/cart'])
    }
  },
  watch: {
    cart: {
      handler (newValue) {
        console.log(newValue)
      },
      deep: true
    }
  },
  methods: {
    addToCart (product, quantity = 1) {
      this.cart.addItem(product, quantity)
      this.$store.commit('cart/updateCart', this.cart)
    },
    removeFromCart (cartItem) {
      this.cart.remove(cartItem, true)
      this.$store.commit('cart/updateCart', this.cart)
    },
    showSnackbar (text, type = 'info') {
      this.snackbar.show = true
      this.snackbar.text = text
    },
    updateCart () {
      this.$store.commit('cart/updateCart', this.cart)
    }
  },
  data () {
    return {
      snackbar: {
        show: false,
        timeout: 2000000,
        text: '',
        color: '#2bbb28',
        style: {
          borderRight: '5px solid rgba(0, 0, 0, 0.15)'
        }
      }
    }
  }
}

export default mixinStore
