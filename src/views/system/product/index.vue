<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">部门</label>
        <el-input v-model="query.deptId" clearable placeholder="部门" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">产品名称</label>
        <el-input v-model="query.productName" clearable placeholder="产品名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in dict.dict.job_status" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="组织" prop="dept.id">

            <el-input v-model="form.deptId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="enabled">
<!--            <el-select v-model="form.enabled" filterable placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in dict.job_status"-->
<!--                :key="item.id"-->
<!--                :label="item.label"-->
<!--                :value="item.value" />-->
<!--            </el-select>-->
            <el-input v-model="form.enabled" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="productName" label="产品" />
        <el-table-column prop="dept.name" label="部门" />
        <el-table-column prop="enabled" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','pqProduct:edit','pqProduct:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudPqProduct from '@/api/system/product'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, deptId: null, productName: null, enabled: null, createTime: null, updateTime: null }
export default {
  name: 'PqProduct',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['job_status'],
  cruds() {
    return CRUD({ title: '产品', url: 'api/pqProduct', idField: 'id', sort: 'id,desc', crudMethod: { ...crudPqProduct }})
  },
  data() {
    return {
      deptName: '', depts: [], deptDatas: [],
      permission: {
        add: ['admin', 'pqProduct:add'],
        edit: ['admin', 'pqProduct:edit'],
        del: ['admin', 'pqProduct:del']
      },
      rules: {
        deptId: [
          { required: true, message: '组织id不能为空', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '是否启用：0 不启用；1 启用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'deptId', display_name: '组织id' },
        { key: 'productName', display_name: '产品名称' },
        { key: 'enabled', display_name: '是否启用：0 不启用；1 启用' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.deptDatas = res.content
          }
        })
      }, 100)
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
  }
}
</script>

<style scoped>

</style>
