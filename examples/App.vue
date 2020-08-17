<template>
  <div id="app">
    <Extend></Extend>
  </div>
</template>

<script>
import { Extend } from "../packages/tableExtend";

export default {
  name: "App",
  components: {
    Extend,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
