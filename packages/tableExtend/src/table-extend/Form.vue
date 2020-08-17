<template>
  <div>
    <Form ref="form" :model="form" v-bind="formAttr">
      <Row type="flex">
        <Col
          v-for="item in ItemRender"
          :key="item.id"
          style="min-height: 57px;"
          v-bind="item.col">
        <FormItem v-bind="item.formItemCi" :prop="item.id">
          <component
            :is="item.node"
            v-model="form[item.id]"
            style="width: 100%;"
            v-bind="item.attrs"
            v-on="item.on"></component>
        </FormItem>
        </Col>
        <Col :md="ItemRender.length>2? 24:8">
        <span v-if="formAttr.btn" class="__table-extend_search_btn">
          <slot name="form" v-bind="{ handleSearch, handleReset }">
            <Button type="primary" icon="md-search" @click="handleSearch">
              查询
            </Button>
            <Button icon="md-undo" @click="handleReset">
              重置
            </Button>
          </slot>
        </span>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { form } from "./defaultConfi";
import merge from "lodash.merge";
import mapValues from "lodash.mapvalues";
import { flatter } from "./utils/util";
import "./style.css";
export default {
  props: {
    formItem: {
      type: Array,
      default: () => []
    },
    attr: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      processedForm: {},
      form: {},
      initialForm: {},
      formAttr: form.attr,
      ItemRender: [],
      strategy: {}
    };
  },
  created() {
    this.formAttr = merge({}, form.attr, this.attr);
  },
  mounted() {
    this.ItemRender = this.formItem.map(i => {
      const ret = merge({}, form.formItemMap[i.prop], i);
      this.strategy[ret.id] = ret.strategy;
      return ret;
    });
    this.setInitailForm();
  },
  methods: {
    setInitailForm() {
      this.ItemRender.forEach(e => {
        this.$set(this.form, e.id, e.options.initialValue);
      });
      this.initialForm = merge({}, this.form);
    },
    handleSearch() {
      this.$refs.form.validate(error => {
        if (error) {
          this.processedForm = flatter(
            mapValues(this.form, (val, key) => this.strategy[key](val))
          );
          this.$emit("handleSearch", this.processedForm);
        }
      });
      return this.processedForm;
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.form = { ...this.form, ...this.initialForm };
      this.processedInitialForm = flatter(
        mapValues(this.form, (val, key) => this.strategy[key](val))
      );
      this.$emit("handleReset", this.processedInitialForm);
      return this.processedInitialForm;
    }
  }
};
</script>
<style>
.__table-extend_search_btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.__table-extend_search_btn > button {
  margin-left: 10px;
}

.__table-extend_pagination_wrapper {
  text-align: right;
  margin-top: 15px;
}
</style>
