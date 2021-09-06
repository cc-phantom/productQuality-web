<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <div class="head-container">
      <el-input
        v-model="deptName"
        clearable
        size="small"
        placeholder="输入部门名称搜索"
        prefix-icon="el-icon-search"
        class="filter-item"
        @input="getDeptDatas"
      />
    </div>
    <el-tree
      :data="deptDatas"
      :load="getDeptDatas"
      :props="defaultProps"
      :expand-on-click-node="false"
      lazy
      @node-click="handleNodeClick"
    />
<!--    <el-input v-model="query.name" clearable size="small" placeholder="输入产品名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->

<!--    <date-range-picker v-model="query.createTime" class="date-item" />-->
<!--    <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.job_status" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>-->
<!--    <rrOperation />-->
  </div>
</template>

<script>
import CRUD, { header } from '@crud/crud'
import {getDepts, getDeptSuperior} from "@/api/system/dept";
import {LOAD_CHILDREN_OPTIONS} from "@riophae/vue-treeselect";
export default {
  components: {},
  mixins: [header()],
  props: {
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' }
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
      form.enabled = form.enabled.toString()
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = {sort: sort}
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
      getDepts({enabled: true}).then(res => {
        this.depts = res.content.map(function (obj) {
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
    // 获取弹窗内部门数据
    loadDepts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
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
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
  }
}
</script>
