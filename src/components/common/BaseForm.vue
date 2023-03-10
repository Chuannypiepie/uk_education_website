<template>
  <div class="base-form-container">
    <el-form
      ref="form"
      :label-position="config.labelPosition || 'right'"
      :label-width="(config.labelWidth || 80) + 'px'"
      :size="config.size || 'small'"
    >
      <el-form-item
        v-for="(item, i) of innerFormItems"
        :key="i"
        :label="item.label"
      >
        <el-col :span="24">
          <el-input
            v-if="item.type === 'input' && !item.hidden"
            v-model="item.value"
            :placeholder="item.placeholder || '请输入内容'"
            :size="config.size || 'small'"
            clearable
            :type="item.inputType || ''"
            :maxlength="item.maxLength"
            :rows="item.rows || 5"
            class="form-item"
          />
          <el-select
            v-else-if="item.type === 'select' && !item.hidden"
            v-model="item.value"
            :placeholder="item.placeholder || '请选择条目'"
            :size="config.size || 'small'"
            :filterable="item.filterable ? true : false"
            clearable
            style="width: 100%"
            class="form-item"
            @change="
              item.onChange
                ? item.onChange(item.value, item.associatedOption || '')
                : () => {}
            "
          >
            <el-option
              v-for="optionItem in item.selectOptions"
              :key="optionItem.value"
              :value="optionItem.value"
              :label="optionItem.label"
            />
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date-range' && !item.hidden"
            v-model="item.value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="form-item"
            style="width: 100%"
            :size="config.size || 'small'"
          />
          <el-date-picker
            v-else-if="item.type === 'date' && !item.hidden"
            v-model="item.value"
            type="date"
            range-separator="-"
            :placeholder="item.placeholder || '请选择日期'"
            class="form-item"
            :size="config.size || 'small'"
          />
          <el-date-picker
            v-else-if="item.type === 'datetime' && !item.hidden"
            v-model="item.value"
            type="datetime"
            :placeholder="item.placeholder || '请选择日期'"
            class="form-item"
            :size="config.size || 'small'"
          />
          <el-time-picker
            v-else-if="item.type === 'time' && !item.hidden"
            v-model="item.value"
            arrow-control
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
            }"
            :placeholder="item.placeholder || '请选择时间'"
            class="form-item"
            :size="config.size || 'small'"
          />
          <el-radio-group
            v-if="item.type === 'radio-group' && !item.hidden"
            v-model="item.value"
            :size="config.size || 'small'"
            @change="
              item.onChange
                ? item.onChange(item.value, item.associatedOption || '')
                : () => {}
            "
          >
            <component
              :is="item.style === 'button' ? 'el-radio-button' : 'el-radio'"
              v-for="optionItem of item.radioOptions"
              :key="optionItem.value"
              :label="optionItem.value"
            >
              {{ optionItem.label }}
            </component>
          </el-radio-group>
          <el-checkbox-group
            v-if="item.type === 'check-group' && !item.hidden"
            v-model="item.value"
            :size="config.size || 'small'"
            @change="
              item.onChange
                ? item.onChange(item.value, item.associatedOption || '')
                : () => {}
            "
          >
            <component
              :is="
                item.style === 'button' ? 'el-checkbox-button' : 'el-checkbox'
              "
              v-for="optionItem of item.checkOptions"
              :key="optionItem.value"
              :label="optionItem.value"
            >{{ optionItem.label }}</component>
          </el-checkbox-group>
        </el-col>
      </el-form-item>
      <slot name="extra"></slot>
    </el-form>
  </div>
</template>

<script>
import FormMixin from '@/mixins/FormMixin';
export default {
  name: 'BaseForm',
  mixins: [ FormMixin, ],
  props: {
    config: {
      type: Object,
      default: function () {
        return {
          size: 'small',
          labelWidth: '80',
          labelPosition: 'right',
        };
      },
    },
    formItems: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {
    formItems: {
      handler() {
        this.refreshItems();
      },
      deep: true,
    },
  },
  mounted() {
    this.refreshItems();
  },
};
</script>
