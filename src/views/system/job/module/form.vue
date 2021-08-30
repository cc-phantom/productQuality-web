<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="600px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="210px"
    >
      <el-form-item
        label="单元测试用例是否运行成功"
        prop="unitTestStatus"
      >
        <el-radio v-model="form.unitTestStatus" :label=1>是</el-radio>
        <el-radio v-model="form.unitTestStatus" :label=2>否</el-radio>
      </el-form-item>

      <el-form-item
        label="有断言且运行成功的用例数"
        prop="successNumWithAssert"
      >
        <el-input
          v-model.number="form.successNumWithAssert"
          :disabled="inputDis"
          placeholder="请输入有断言且运行成功的用例数"
          controls-position="right"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="没有断言但运行成功的用例数"
        prop="successNumWithoutAssert"
      >
        <el-input
          v-model.number="form.successNumWithoutAssert"
          :disabled="inputDis"
          placeholder="请输入没有断言但运行成功的用例数"
          controls-position="right"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="比对断言运行失败的用例数"
        prop="failNumWithAssert"
      >
        <el-input
          v-model.number="form.failNumWithAssert"
          :disabled="inputDis"
          placeholder="请输入比对断言运行失败的用例数"
          controls-position="right"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="异常失败的用例数"
        prop="failNumWithException"
      >
        <el-input
          v-model.number="form.failNumWithException"
          controls-position="right"
          placeholder="请输入异常失败的用例数"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="单元测试用例个数"
        prop="testNum"
      >
        <el-input
          v-model.number="form.testNum"
          controls-position="right"
          placeholder="请输入单元测试用例个数"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="单元测试用例质量"
        prop="unitTestQualityScore"
      >
        <el-input
          v-model.number="form.unitTestQualityScore"
          controls-position="right"
          placeholder="请输入单元测试用例质量"
          :min=0
          :max=100
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="单元测试有效性"
        prop="unitTestEffectivenessScore"
      >
        <el-input
          v-model.number="form.unitTestEffectivenessScore"
          controls-position="right"
          placeholder="请输入单元测试有效性"
          :min=0
          :max=100

          type="number"
        />
      </el-form-item>
      <el-form-item
        label="被评审产品代码行数"
        prop="codeLineNum"
      >
        <el-input
          v-model.number="form.codeLineNum"
          controls-position="right"
          placeholder="请输入被评审产品代码行数"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="千行代码单元测试用例密度"
        prop="unitTestDensity"
      >
        {{this.form.unitTestDensity}}
      </el-form-item>
      <el-form-item
        label="单元测试行覆盖率"
        prop="lineCoverageRate"
      >
        <el-input
          v-model.number="form.lineCoverageRate"
          controls-position="right"
          placeholder="请输入单元测试行覆盖率"
          style="width: 300px"
          type="number"
        /> %
      </el-form-item>
      <el-form-item
        label="单元测试分支覆盖率"
        prop="branchCoverageRate"
      >
        <el-input
          v-model.number="form.branchCoverageRate"
          controls-position="right"
          placeholder="请输入单元测试分支覆盖率"
          style="width: 300px"
          type="number"
        /> %
      </el-form-item>
      <el-form-item
        label="产品质量打分"
        prop="productQualitySubjectiveScore"
      >
        <el-input
          v-model.number="form.productQualitySubjectiveScore"
          controls-position="right"
          placeholder="请输入产品质量打分"
          style="width: 300px"
          type="number"
        /> %
      </el-form-item>
      <el-form-item
        label="产品质量投票得分"
        prop="voteScore"
      >
        <el-input
          v-model.number="form.voteScore"
          controls-position="right"
          placeholder="请输入产品质量投票得分"
          style="width: 300px"
          type="number"
        />
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          accept=".xlsx,.xls"
          >
          <el-button size="small" type="primary" style="margin-top: 10px;">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传Excel文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="产品质量综合得分"
        prop="productQualityComprehensiveScore"
      >
        {{productQualityComprehensiveScore}}
      </el-form-item>
      <el-form-item
        label="产品质量最终得分"
        prop="productQualityFinalScore"
      >
        {{productQualityFinalScore}}
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'

const defaultForm = {
  id: null,
  name: '',
  jobSort: 999,
  enabled: true
}
export default {
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  watch: {
    "form.unitTestStatus": function(val){
      if (val === 2) {
        this.form.successNumWithAssert = 0;
        this.form.failNumWithAssert = 0;
        this.form.successNumWithoutAssert = 0;
        this.inputDis = true;
      } else {
        // this.form.successNumWithAssert = this.form.successNumWithAssert;
        // this.form.failNumWithAssert =  this.form.failNumWithAssert;
        // this.form.successNumWithoutAssert = this.form.successNumWithoutAssert ;
        this.inputDis = false;
      }
    }/*,
    "successNumWithAssert": function () {
      this.form.unitTestDensity = this.form.successNumWithAssert / this.form.codeLineNum * 1000
    },
    "successNumWithAssert1": function () {
      this.form.unitTestDensity = this.form.successNumWithAssert / this.form.codeLineNum * 1000
    }*/
  },
  computed: {
    // 千行代码单元测试用例密度=有断言且运行成功的用例数/被评审产品代码行数*1000）,结果保留2位小数
    unitTestDensity: function(){
      var numReg = /^[0-9]*$/;

      var numRe = new RegExp(numReg);
      var result = 0;
      if (numRe.test(this.form.successNumWithAssert) && numRe.test(this.form.codeLineNum)){
        result = this.form.successNumWithAssert / this.form.codeLineNum * 1000
      } else {
        result = 0;
      }
      this.form.unitTestDensity = result
      return result.toFixed(2);
    },
    // 产品质量综合得分, 自动计算产品质量综合得分,公式是：单元测试用例质量*20%+单元测试有效性*10%+千行代码单元测试用例密度*30%+行覆盖率*20%+分支覆盖率*10%+产品代码质量打分*10%
    productQualityComprehensiveScore: function() {
      var numReg = /^[0-9]*$/;

      var numRe = new RegExp(numReg);
      var result = 0;
      /*if (numRe.test(this.form.unitTestQualityScore)
        && numRe.test(this.form.unitTestEffectivenessScore)
        && numRe.test(this.form.unitTestDensity)
        && numRe.test(this.form.lineCoverageRate)
        && numRe.test(this.form.branchCoverageRate)
        && numRe.test(this.form.productQualitySubjectiveScore)){
        result = this.form.unitTestQualityScore * 0.2 /!*+ this.form.unitTestEffectivenessScore * 0.1 + this.form.unitTestDensity * 0.3
          + this.form.lineCoverageRate * 0.2 + this.form.branchCoverageRate * 0.1 + this.form.productQualitySubjectiveScore * 0.1*!/;
      } else {
        result = 0;
      }*/
      result = this.form.unitTestQualityScore * 0.2 + this.form.unitTestEffectivenessScore * 0.1 + this.form.unitTestDensity * 0.3
      /*+ this.form.lineCoverageRate * 0.2 + this.form.branchCoverageRate * 0.1 + this.form.productQualitySubjectiveScore * 0.1*/;
      return result;
    },
    // 产品质量最终得分=产品质量综合得分+产品质量投票得分
    productQualityFinalScore: function () {
      var numReg = /^[0-9]*$/

      var numRe = new RegExp(numReg)
      var result = 0;
      if (numRe.test(this.form.productQualityComprehensiveScore)
        && numRe.test(this.form.voteScore)){
        result = this.form.productQualityComprehensiveScore + this.form.voteScore;
      } else {
        result = 0;
      }
      return result;
    }
  },
  data() {
    return {
      rules: {
        unitTestStatus: [
          { required: true, message: '请选择单元测试运行状态', trigger: 'blur' }
        ],
        successNumWithAssert: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        successNumWithoutAssert: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        failNumWithAssert: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        failNumWithException: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        testNum: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        unitTestQualityScore: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        unitTestEffectivenessScore: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        codeLineNum: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        unitTestDensity: [
          { required: true, trigger: 'blur', type: 'number' }
        ],
        lineCoverageRate: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        branchCoverageRate: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        productQualitySubjectiveScore: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        voteScore: [
          { required: true, message: '请输入0-100之间的整数', trigger: 'blur', type: 'number' }
        ],
        productQualityComprehensiveScore: [
          { required: true, trigger: 'blur', type: 'number' }
        ],
        productQualityFinalScore: [
          { required: true, trigger: 'blur', type: 'number' }
        ]
      },
      inputDis: false
    }
  },
  mounted() {
    // console.log(this.form)
  },
  methods: {

  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
