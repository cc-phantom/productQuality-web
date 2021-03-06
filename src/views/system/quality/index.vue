<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              @sort-change="onSortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="pqProduct.productName" label="产品名称" sortable="custom"/>
      <el-table-column prop="dept.name" label="团队" sortable="custom"/>
      <el-table-column prop="productQualityComprehensiveScore" label="产品质量综合得分" sortable="custom"/>
      <el-table-column prop="voteScore" label="产品质量投票得分" sortable="custom"/>
      <el-table-column prop="productQualityFinalScore" label="产品质量最终得分" sortable="custom"/>
      <el-table-column prop="createTime" label="创建日期" sortable="custom"/>
      <el-table-column prop="updateTime" label="修改日期" sortable="custom"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','pqQuality:get','pqQuality:edit','pqQuality:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :show-del="false"
            :show-detail="true"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :job-status="dict.job_status" />
  </div>
</template>

<script>
import getAllQuality from '@/api/system/quality'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
let defaultQualitySort = "createTime,desc"
export default {
  name: 'quality',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '产品质量',
      url: 'api/pqQuality',
      sort: [defaultQualitySort],
      crudMethod: { ...getAllQuality },
      optShow: {
        add: false,
        edit: true,
        del: false,
        download: true,
        reset: true
      }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        get: ['admin', 'pqQuality:get'],
        add: ['admin', 'pqQuality:add'],
        edit: ['admin', 'pqQuality:edit'],
        del: ['admin', 'pqQuality:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '产品质量, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudJob.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    onSortChange({ prop, order }) {
      let sortItem=defaultQualitySort;
      if(order){
        sortItem = prop+","+(order==="ascending"?"asc":"desc")
      }
      this.crud.sort=[sortItem]
      this.crud.toQuery()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
