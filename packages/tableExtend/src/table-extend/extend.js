import Form from "./Form";
import Table from "./Table";
import { Card } from "iview";
export default {
  components: { Form, Table, Card },
  data() {
    return {
      form: {}
    };
  },
  props: {
    api: {
      type: Object,
      default: {}
    },
    config: {
      type: Object,
      default: {
        form: {},
        table: {},
        pagnition: {}
      }
    }
  },
  methods: {
    handleSearch(formdata) {
      if (formdata === "init") {
        this.$refs.Form.handleSearch();
      } else {
        formdata && (this.form = formdata);
        this.$refs.table.refresh("", this.form);
      }
    },
    handleReset(formdata) {
      formdata && (this.form = formdata);
      this.$refs.table.refresh({}, this.form);
    }
  },
  render() {
    return (
      <Card bordered={false}>
        <div className="slot">
          {this.$slots.prefix}
          {this.$scopedSlots.prefix &&
            this.$scopedSlots.prefix({ form: this.form })}
        </div>
        {this.config.form && (
          <div className="formWrap">
            <Form
              ref="Form"
              {...{
                props: { ...this.config.form },
                scopedSlots: { ...this.$scopedSlots }
              }}
              onHandleSearch={this.handleSearch}
              onHandleReset={this.handleReset}
            ></Form>
          </div>
        )}
        <div className="slot">
          {this.$slots.default}
          {this.$scopedSlots.default &&
            this.$scopedSlots.default({ form: this.form })}
        </div>
        <div className="tableWrap">
          <Table
            ref="table"
            {...{
              props: { table: this.config.table, api: this.api },
              scopedSlots: { ...this.$scopedSlots }
            }}
          ></Table>
        </div>
        <div name="suffix" className="slot">
          {this.$slots.prefix}
          {this.$scopedSlots.suffix &&
            this.$scopedSlots.suffix({ form: this.form })}
        </div>
      </Card>
    );
  }
};
