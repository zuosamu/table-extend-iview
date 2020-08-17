<template>
  <Cascader :value="val"
            v-bind="$attrs"
            :data="area"
            v-on="$listeners"
            @on-change="changeHandle"></Cascader>
</template>

<script>
import api from '../api'
import { isArray, isString } from '../utils/dataType'
import { getHandle } from '../utils/util';
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  data() {
    return {
      area: []
    }
  },
  computed: {
    val() {
      return this.value;
    }
  },
  created() {
    this.getArea()
  },
  methods: {
    changeHandle(val) {
      this.$emit('change', val)
    },
    async getArea() {
      const { options } = this.$attrs;
      const handle = options && options[0];
      if (isArray(handle)) {
        this.area = handle;
      } else if (isString(handle)) {
        this.area = await api[handle]()
      } else {
        this.area = await this.getPromiseArea()
      }
    },
    async getPromiseArea() {
      const { options } = this.$attrs;
      const { handle } = getHandle(options);
      return await handle()
    }
  }
}
</script>
