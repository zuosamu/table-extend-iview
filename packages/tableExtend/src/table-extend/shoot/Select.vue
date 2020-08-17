<template>
  <Select
    :value="val"
    :loading="loading"
    :remote-method="remoteMethod"
    v-bind="$attrs"
    @on-change="handlerValue"
    v-on="$listeners">
    <Option
      v-for="item in option"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </Option>
  </Select>
</template>
<script>
import { getHandle, flatMap } from "../utils/util";
import { isArray, isString, isEmptyObject, isObject } from "../utils/dataType";
import api from "../api";
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value"],
  data() {
    return {
      loading: false,
      option: []
    };
  },
  computed: {
    val() {
      return this.value;
    }
  },
  async created() {
    const { options, immediate } = this.$attrs;
    const handle = options && options[0];
    if (isArray(handle)) {
      // feature
      // this.option = handle;
      this.$nextTick(()=>{
        this.option = handle;
      })
    } else {
      if (immediate) this.option = await this.getOption("", options);
    }
  },
  methods: {
    handlerValue(val) {
      this.$emit("change", val);
    },
    async getOption(param, option) {
      const { handle, path, fn } = getHandle(option);
      if (isArray(handle)) {
        return handle;
      }
      let data = isString(handle)
        ? await api[handle](param)
        : await handle(param);
      //后端无法处理空数组转空对象问题
      if (isEmptyObject(data)) return [];
      if (isEmptyObject(path) && isObject(data)) {
        data = Object.entries(data).map(([value, label]) => ({ label, value }));
      }
      if (Array.isArray(data)) {
        return data.map(fn);
      }
      const dataCache = flatMap(data,path);
      // 解决多重结果的对象  2019-9-2(优化点，后端优化)
      if (isObject(dataCache.data)) {
        return Object.entries(dataCache.data).map(fn);
      }
      return dataCache.data.map(fn);
    },
    async remoteMethod(param) {
      const { options } = this.$attrs;
      this.loading = true;
      this.option = await this.getOption(param, options);
      this.loading = false;
    }
  }
};
</script>
