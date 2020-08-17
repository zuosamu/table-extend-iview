<template>
  <div>
    <div style="overflow-x: auto;">
      <Tag v-for="item in cascaderList"
           :key="item"
           style="white-space: nowrap;"
           :name="item"
           closable
           @on-close="handleCloseTagList">
        {{ item }}
      </Tag>
    </div>
    <Cascader v-model="modelVal"
              :value="val"
              v-bind="$attrs"
              :data="area"
              v-on="$listeners"
              @on-change="changeHandle"></Cascader>
  </div>
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
      area: [],
      cascader_list: [],
      length: 0,
      modelVal: []
    }
  },
  computed: {
    val() {
      return this.value;
    },
    cascaderList(){
      return this.cascader_list.map(item=>JSON.parse(item).join('>'))
    }
  },
  watch: {
    value(val) {
      if (val && !val.length) {
        this.cascader_list = [];
        this.modelVal = [];
      }
    }
  },
  created() {
    this.getArea()
  },
  methods: {
    handleCloseTagList(evt, name) {
      const _name = JSON.stringify(name.split('>'));
      this.cascader_list = this.cascader_list.filter((i) => _name !== i);
      if (_name === JSON.stringify(this.modelVal)) {
        this.modelVal = [];
      }
      this.$emit('change', this.cascader_list)
    },
    changeHandle(val) {
      if (val.length && !this.cascader_list.find((i) => JSON.stringify(val) === i)) {
        if (val.length > this.length) {
          this.cascader_list.pop();
          this.length++;
        }
        if (val.length < this.length) {
          this.length = 0;
        }
        this.cascader_list.push(JSON.stringify(val));
      }
      this.$emit('change', this.cascader_list)
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
