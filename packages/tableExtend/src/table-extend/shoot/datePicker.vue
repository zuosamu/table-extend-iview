<template>
  <DatePicker
    :value="time"
    :options="options"
    v-bind="$attrs"
    @on-change="formatTimePicker"
    v-on="$listeners" />
</template>

<script>
import moment from 'moment';
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  data() {
    return {};
  },
  computed: {
    options() {
      return this.disabledDateHandle();
    },
    time() {
      return Array.isArray(this.value)
        ? this.value.map(t => new Date(+t))
        : this.value && new Date(this.value);
    }
  },
  methods: {
    formatTimePicker(value) {
      this.$emit(
        'change',
        Array.isArray(value)
          ? value.filter(i=>i).map(timeStr => new Date(timeStr).getTime())
          : new Date(value).getTime()
      );
    },
    disabledDateHandle() {
      const { disabledDate: time, options = {} } = this.$attrs;
      return {
        disabledDate: Array.isArray(time)
          ? date => !moment(date).isBetween(moment(time[0]), moment(time[1]))
          : date => !moment(date).isBefore(moment(time)),
        ...options
      };
    }
  }
};
</script>
