import Select from "./shoot/Select";
import Cascader from "./shoot/cascader";
import CascaderMulti from "./shoot/cascaderMulti";
import DatePicker from "./shoot/datePicker";
export const form = {
  attr: {
    labelWidth: 120,
    btn: true
  },
  formItemMap: {
    Input: {
      formItemCi: { label: "为定义label" },
      col: {
        span: 8
      },
      node: {
        functional: true,
        render(h, context) {
          return <i-input {...context.data}></i-input>;
        }
      },
      options: {
        initialValue: ""
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入"
      },
      on: {}
    },
    Cascader: {
      formItemCi: { label: "自定义" },
      col: {
        span: 8
      },
      node: Cascader,
      options: {
        initialValue: []
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入"
      },
      on: {}
    },
    DatePicker: {
      formItemCi: { label: "自定义" },
      col: {
        span: 8
      },
      node: DatePicker,
      options: {
        initialValue: []
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入"
      },
      on: {}
    },
    CascaderMulti: {
      formItemCi: { label: "自定义" },
      col: {
        span: 8
      },
      node: CascaderMulti,
      options: {
        initialValue: []
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入",
        changeOnSelect: true
      },
      on: {}
    },
    Select: {
      formItemCi: { label: "自定义" },
      col: {
        span: 8
      },
      node: Select,
      options: {
        initialValue: ""
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入"
      },
      on: {}
    },
    Customize: {
      formItemCi: { label: "自定义" },
      col: {
        span: 8
      },
      node: {
        functional: true,
        render(h, context) {
          return <i-input {...context.data}></i-input>;
        }
      },
      options: {
        initialValue: ""
      },
      strategy: value => value,
      attrs: {
        placeholder: "请输入"
      },
      on: {}
    }
  }
};

export const table = {
  attrs: {
    columns: [],
    pagination: {
      pageSize: 20,
      showElevator: true,
      showSizer: true,
      showTotal: true
    }
  },
  on: {}
};

export function req(page, filters, sorter) {
  return { page, filters, sorter };
}
