<template>
  <div id="app">
    <OrderForm v-if="!currentOrder"></OrderForm>
    <Map></Map>
  </div>
</template>

<script>
  import Map from './components/Map/index'
  import OrderForm from './components/OrderForm/index'
  import * as event from './utilities/event/event'
  import LocalStorage from './utilities/localStorage/LocalStorage'

  export default {
    name: 'App',
    components: {
      OrderForm,
      Map,
    },

    data() {
      return {
        currentOrder: null,
      };
    },

    mounted() {
      this.currentOrder = LocalStorage.getCurrentOrder();
      event.eventBus.$on(event.EVENT_ORDER_CREATED, order => {
        this.currentOrder = order;
        LocalStorage.setCurrentOrder(order);
      });
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
