# table-extend-iview

## 安装使用

```
npm install table-extend-iview
```

## 例子

```html
<template>
  <table-extend2 ref="extend" class="tableExtend" :api="api" :config="config">
  </table-extend2>
</template>

<script>
  import Min from "./mixin";
  export default {
    mixins: [Min],
  };
</script>
```

## Min

```js
import { contractsLists, contractsListConfig } from "./service";
export default {
  data() {
    return {
      api: {
        handle: contractsLists,
        auto: true,
        path: { data: "list", "pagination.total": "page.total" },
        req: ({ current, pageSize: size }, filter) => ({
          page: { current, size },
          filter,
        }),
      },
      config: {
        form: {
          attr: {
            labelWidth: 120,
            btn: true,
          },
          formItem: [
            {
              formItemCi: { label: "审批编号" },
              prop: "Input",
              id: "last_workflow_number",
            },
            {
              formItemCi: { label: "甲方名称" },
              prop: "Input",
              id: "merchant_name",
            },
            {
              formItemCi: { label: "提交时间" },
              prop: "DatePicker",
              id: "create_date",
              strategy: ([start_time, end_time]) => ({ start_time, end_time }),
              attrs: {
                type: "daterange",
                options: {
                  disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                  },
                },
                clearable: true,
                editable: false,
              },
            },
            {
              formItemCi: { label: "状态" },
              prop: "Select",
              options: {
                initialValue: "",
              },
              attrs: {
                clearable: true,
                immediate: true,
                placeholder: "请选择",
                remoteMethod: null,
                options: [
                  contractsListConfig,
                  { data: "contract_status_list" },
                ],
              },
              id: "contract_status",
            },
            {
              formItemCi: { label: "区域" },
              prop: "Cascader",
              options: {
                initialValue: [],
              },
              strategy: ([big_district, province, city]) => ({
                big_district,
                province,
                city,
              }),
              attrs: {
                clearable: true,
                options: ["GetDistrictArea"],
              },
              id: "approval_user",
            },
            {
              formItemCi: { label: "合同类型" },
              prop: "Select",
              options: {
                initialValue: "",
              },
              attrs: {
                clearable: true,
                immediate: true,
                remoteMethod: null,
                placeholder: "请选择",
                options: [contractsListConfig, { data: "contract_cate_list" }],
              },
              id: "contract_category",
            },
            {
              formItemCi: { label: "申请人" },
              prop: "Select",
              options: {
                initialValue: "",
              },
              attrs: {
                options: ["SearchUserListByName", {}],
                remote: true,
                clearable: true,
                filterable: true,
                immediate: true,
              },
              id: "signed_user",
            },
          ],
        },
        table: {
          attrs: {
            columns: [
              {
                title: "审批编号",
                key: "number",
                align: "center",
                minWidth: 150,
                render: (h, { row }) => {
                  return h("div", row.last_workflow_number);
                },
              },
              {
                title: "",
                key: "merchant_name",
                minWidth: 150,
                align: "center",
                renderHeader: () => {
                  return (
                    <div>
                      <div>大区</div>
                      <div>省/市</div>
                    </div>
                  );
                },
                render: (h, { row }) => {
                  return h("div", [
                    h("div", row.big_district || "--"),
                    h("div", row.province + "/" + row.city),
                  ]);
                },
              },
              {
                title: "甲方名称",
                key: "merchant_name",
                minWidth: 200,
                align: "center",
              },
              {
                title: "门店数量",
                key: "store_cnt",
                minWidth: 120,
                align: "center",
                render: (h, { row }) => {
                  const Tag = "Tag";
                  return <Tag color="primary">{row.store_cnt}</Tag>;
                },
              },
              {
                title: "合同编号",
                key: "contract_number",
                align: "center",
                minWidth: 250,
              },
              {
                title: "最高分成比例",
                key: "share_ratio",
                minWidth: 120,
                align: "center",
              },
              {
                title: "特殊付款",
                key: "have_special",
                minWidth: 120,
                align: "center",
              },
              {
                title: "合同类型",
                key: "contract_category_chs",
                minWidth: 120,
                align: "center",
              },
              {
                title: "",
                key: "submit_time_format",
                align: "center",
                width: 155,
                renderHeader: (h) => {
                  return h("div", [h("div", "申请人"), h("div", "提交时间")]);
                },
                render: (h, { row }) => {
                  let submitTime =
                    row.create_time != "" ? row.create_time : "--";
                  let badge = h("span", "");
                  if (row.user_job_badge != "") {
                    let badgeCalss =
                      row.user_job_badge == "KA"
                        ? "badge badge_ka"
                        : "badge badge_channel";
                    badge = h(
                      "span",
                      { class: badgeCalss },
                      row.user_job_badge
                    );
                  }
                  return h("div", [
                    h("div", [h("span", row.signed_user_name), badge]),
                    h("div", submitTime),
                  ]);
                },
              },
              {
                title: "状态",
                key: "status_text",
                align: "center",
                minWidth: 100,
                render: (h, { row }) => {
                  return h("div", row.contract_status_chs);
                },
              },
              {
                title: "操作",
                key: "operate",
                minWidth: 200,
                align: "center",
                fixed: "right",
                render: (h, { row }) => {
                  let btns = [];
                  const { id } = row;
                  // 商户分成审批页面 + 我的分成审批
                  btns.push(
                    h(
                      "a",
                      {
                        props: { type: "text", size: "small" },
                        on: {
                          click: () => {
                            window.open(
                              `#/new_contract_detail?contractId=${id}`
                            );
                          },
                        },
                      },
                      "查看"
                    )
                  );
                  return h("div", btns);
                },
              },
            ],
          },
          on: {
            "on-select": (selection, row) => {
              console.log(selection, row);
            },
          },
        },
      },
    };
  },
};
```
