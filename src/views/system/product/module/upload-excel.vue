<template>
  <div class="app-container" v-permission="permission.add">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import UploadExcelComponent from "@/views/system/product/module/UploadExcel/index";

export default {
  props: {
    permission: {
      type: Object,
      default: () => { return {} }
    },
    hiddenColumns: {
      type: Array,
      default: () => { return [] }
    },
    ignoreColumns: {
      type: Array,
      default: () => { return [] }
    }
  },
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传大于10m的文件.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
