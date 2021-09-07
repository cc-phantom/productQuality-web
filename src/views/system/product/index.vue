<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
<!--        <label class="el-form-item-label">产品名称</label>-->
        <el-input v-model="query.productName" clearable placeholder="输入产品名称搜索" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
<!--        <label class="el-form-item-label">团队</label>
        <el-input v-model="query.deptName" clearable placeholder="输入团队名称搜索" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
<!--        <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in dict.dict.product_status" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>-->
        <rrOperation :crud="crud" />
      </div>

<!--      <el-upload-->
<!--        v-permission="permission.add"-->
<!--        :action="productExcelUploadApi"-->
<!--        class="upload-demo"-->
<!--        drag-->
<!--      >-->
<!--        <i class="el-icon-upload" />-->
<!--        <div class="el-upload__text">-->
<!--          拖入产品列表Excel，或-->
<!--          <em>点击上传</em>-->
<!--        </div>-->
<!--      </el-upload>-->

      <!-- 文件上传 -->
      <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body width="500px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="productExcelUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template slot="left">
          <!-- 上传 -->
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="dialog = true">上传</el-button>
        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="团队" prop="dept.id">
            <treeselect
              v-model="form.dept.id"
              :options="depts"
              :load-options="loadDepts"
              style="width: 178px"
              placeholder="选择团队"
            />
          </el-form-item>

          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" style="width: 370px;" placeholder="请输入产品名称" />
          </el-form-item>
<!--          <el-form-item label="是否启用" prop="enabled">
            <el-select v-model="form.enabled" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.product_status"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>-->
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
        <el-table-column prop="dept.name" label="团队" />
<!--        <el-table-column prop="enabled" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>-->
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
import crudProduct from '@/api/system/product'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {LOAD_CHILDREN_OPTIONS} from "@riophae/vue-treeselect";
import {mapGetters} from "vuex";
import crudQiNiu from "@/api/tools/qiniu";
import {getToken} from "@/utils/auth";

const defaultForm = { productName: null, enabled: 1, dept: { id: null} }
// const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }
export default {
  name: 'PqProduct',
  components: {Treeselect, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['product_status'],
  cruds() {
    return CRUD({ title: '产品', url: 'api/pqProduct', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProduct }})
  },
  computed: {
    ...mapGetters(['productExcelUploadApi'])
  },
  data() {
    return {
      deptName: '', depts: [], deptDatas: [],
      permission: {
        get: ['admin', 'pqProduct:get'],
        add: ['admin', 'pqProduct:add'],
        edit: ['admin', 'pqProduct:edit'],
        del: ['admin', 'pqProduct:del']
      },
      rules: {
        dept: [
          { required: true, message: '团队不能为空', trigger: 'blur' }
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
      ],
      url: '', headers: { 'Authorization': getToken() },
      title: '文件',
      dialog: false,
      dialogVisible: false,
      fileList: [], files: [],
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
    },
    // 钩子：在新增和编辑时获取团队数据
    [CRUD.HOOK.beforeToCU]() {
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU]() {

      return true
    },
    // 获取左侧团队数据
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
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内团队数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换团队
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    doConfig() {
      const _this = this.$refs.form
      _this.init()
      _this.dialog = true
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          crudQiNiu.del([this.files[i].id]).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
    },
  }
}
</script>

<style scoped>

</style>
