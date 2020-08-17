/* eslint-disable */
import { Page } from "iview";
import { table, req as defaultReq } from "./defaultConfi";
import pick from "lodash.pick";
import isEmpty from "lodash.isempty";
import isEqualWith from "lodash/isEqualWith";
import merge from "lodash.merge";
import debounce from "debounce-promise";
import { isObject, isArray, isEmptyObject } from "./utils/dataType";
import { flatMap } from "./utils/util";
import "./style.css";
let columns = [];
export default {
  components: { Page },
  data() {
    return {
      loading: false,
      pageStetus: true,
      localLoading: false,
      initPagination: {
        current: 1,
        pageSize: merge({}, table, this.table).attrs.pagination.pageSize,
      },
      pagination: { ...this.initPagination },
      filters: {},
      sorter: [],
      localTable: {
        attrs: {},
      },
    };
  },
  props: {
    api: { type: Object, default: {} },
    table: { type: Object, default: {} },
  },
  created() {
    // 防止在切换分页数时的错误请求,在antd-vue是多余的,给作者点赞
    this.debounce = debounce((params) => {
      this.getData(params);
    }, 300);
    this.pagination = { ...this.initPagination };
  },
  mounted() {
    const { auto } = this.api;
    auto && this.loadData(null, isObject(auto) ? auto : undefined);
  },
  methods: {
    // 借用vue的对比函数
    isEqual(tar, ori) {
      if (!isArray(tar)) return false;
      if (tar.length !== ori.length) return false;
      return ori.every((i, index) =>
        //eslint-disable-next-line
        isEqualWith(
          i,
          tar[index],
          (
            { __id, children: tarChildren, ...tarVal },
            { __id: oriID, children: oriChildren, ...oriVal }
          ) => {
            if (this._q(tarVal, oriVal)) {
              if (tarChildren && oriChildren) {
                return this.isEqual(tarChildren, oriChildren);
              } else {
                return !!tarChildren !== !!oriChildren ? false : true;
              }
            } else {
              return false;
            }
          }
        )
      );
    },
    refresh(page, extraFilter) {
      this.loadData(page, extraFilter);
    },
    loadingSwitch() {
      this.loading = !this.loading;
    },
    refreshPage() {
      this.pageStetus = false;
      this.pagination = { ...this.pagination, current: 1 };
      this.$nextTick(() => {
        this.pageStetus = true;
      });
    },
    loadData(p, f, s) {
      if (f) {
        this.refreshPage();
        this.filters = {};
      }
      if (isEmptyObject(p)) {
        p = this.initPagination;
      }
      const pagination = p || this.pagination;
      const filters = f || this.filters;
      const sorter = s || this.sorter;
      this.collectReq(pagination, filters, sorter);
      // 如果没有配置处理函数，就使用默认函数
      const { req = defaultReq } = this.api;
      this.debounce(req(pagination, filters, sorter));
    },
    collectReq(pagination, filters, sorter) {
      this.pagination = pick(pagination, ["current", "pageSize"]);
      !isEmpty(sorter) && (this.sorter = sorter.column);
      merge(this.filters, filters);
    },
    currentPageChange(current) {
      this.loadData({ ...this.pagination, current });
    },
    pageSizeChange(pageSize) {
      this.loadData({ ...this.pagination, pageSize });
    },
    async getData(params) {
      this.loadingSwitch();
      const {
        handle,
        path = { dataSource: "list", "pagination.total": "total" },
        fn = (i) => i,
      } = this.api;
      try {
        const data = await handle(params);
        this.localTable.attrs = fn(
          !isEmptyObject(data) ? flatMap(data, path) : {}
        );
        this.$forceUpdate();
      } catch (e) {
        console.error(e);
      } finally {
        this.loadingSwitch();
      }
    },
  },
  render() {
    const tableC = merge({}, table, this.table, this.localTable);
    const { columns: col, pagination } = tableC.attrs;
    // 保存表头状态
    if (!this.isEqual(columns, col)) {
      columns = col;
    }
    let page = { ...pagination, ...this.pagination };
    return (
      <div class="table-wrapper">
        {this.$scopedSlots.table &&
          this.$scopedSlots.table({ ...tableC.attrs, loading: this.loading })}
        <i-table loading={this.loading} {...tableC} columns={columns}>
          {Object.keys(this.$slots).map((name) => (
            <template slot={name}>{this.$slots[name]}</template>
          ))}
        </i-table>
        {this.pageStetus && (
          <div style="text-align:right;margin-top:15px">
            <Page
              {...{
                attrs: { ...page },
                on: {
                  "on-change": this.currentPageChange,
                  "on-page-size-change": this.pageSizeChange,
                },
              }}
            />
          </div>
        )}
      </div>
    );
  },
};
