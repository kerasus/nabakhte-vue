<template>
  <div>
    <productCard1 v-if="type <= 4" :product="product" :type="type">
      {{ product.name }}
    </productCard1>
    <ProductCard2 v-else-if="type === 5" :product="product">
      {{ product.name }}
    </ProductCard2>
    <ProductCard5 v-else-if="type === 8" :product="product" :box-shadow="boxShadow">
      {{ product.name }}
    </ProductCard5>
    <ProductCard6 v-else-if="type === 9" :product="product">
      {{ product.name }}
    </ProductCard6>
  </div>
</template>

<script>
import { Product } from '~/models/Product'
import { CartItem } from '~/models/Cart'

export default {
  name: 'ProductCard',
  components: {
    ProductCard1: () => import('./ProductCard1'),
    ProductCard2: () => import('./ProductCard2'),
    ProductCard5: () => import('./ProductCard5'),
    ProductCard6: () => import('./ProductCard6')
  },
  props: {
    cartItem: {
      type: CartItem,
      default () {
        return new CartItem()
      }
    },
    product: {
      type: Product,
      default () {
        return new Product({
          price: {
            base: 100000,
            discount: 20000,
            final: 80000
          },
          image: {
            url: 'https://media.chibekhoonam.net/2020/09/golbarg-olom6.jpg'
          },
          name: 'اسم محصول',
          link: '#'
        })
      }
    },
    type: {
      type: Number,
      default: 1
    },
    boxShadow: {
      type: Boolean,
      default: false,
      required: false
    }
  }
}
</script>
