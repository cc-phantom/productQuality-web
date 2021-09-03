<!--表单组件-->
<template>
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

</template>
