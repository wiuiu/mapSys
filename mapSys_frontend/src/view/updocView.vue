<template>
  <div class="docsContainer">
    <h2 style="margin:0; margin-top:20px; margin-left:20px; ">文件上传：</h2>

    <el-form class="formContent" ref="form" :model="form" :action="onSubmit" label-width="80px">
      <div class="outter">
        <div class="selectDiv">
          <el-form-item label="文件类型" required>
            <el-select v-model="form.category" placeholder="请选择文件类型">
              <el-option label="描述文档" value="doc"></el-option>
              <el-option label="文献论文" value="paper"></el-option>
              <el-option label="新闻报道" value="news"></el-option>
              <el-option label="解译标志文档" value="symdoc"></el-option>
              <el-option label="图片文件" value="pic"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="关联设施" required>
          <el-select v-model="form.correfid" placeholder="选择文件关联的设施">
            <el-option v-for="(item) in fidNames" :key="item.fid" :label="item.faciname" :value="item.fid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关联路段">
          <el-select multiple collapse-tags v-model="form.segids">
            <el-option v-for="(item) in segs" :key="item.key" :label="item.segName" :value="item.sid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文件名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="文件描述" required>
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

        <el-form-item label="创建时间" required>
          <div class="timePicker">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 40%;margin-right:5px;"></el-date-picker>
            <el-time-picker placeholder="选择时间" v-model="form.time" style="width: 40%;"></el-time-picker>
          </div>
        </el-form-item>
       

        <el-form-item label="文件上传" required>
          <el-upload
            action=""
            :before-remove="beforeRemove"
            :on-remove="handleRemove"
            :multiple="false" 
            :limit="1"
            :on-change="fileChange"
            :file-list="fileList"
            :auto-upload="false"
            >
            <el-button type="success">选择文件</el-button>   <span>(小于1Mb)</span>
        </el-upload>
        </el-form-item>
        
        <el-form-item class="buttonDiv">
          <el-button type="warning" @click="onReset">重写</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </div>
    </el-form>




  </div>
</template>

<script>
import { postFile, getSidsforfid, getfidNames } from "@/utils/api";

export default {
  data() { 
    return {
      form: {
        category: "",

        name: "",
        description: "",
        date: "",
        time: "",
        file: "",

        correfid:"",
        segids:[],
      },
      
      fileList:[],
      show: true,
      dismissCountDown: 0,
      errordisMissedCount: 0,

      files:'',
      isloading:true,

      // 设施路段关联部分
      fidNames:[],
      segs:[],
    };
  },
  watch:{
    'form.correfid':{
      handler:function(newVal){
        getSidsforfid({"fid":newVal}).then(res=>{
          this.segs = res.data.data
          this.segs.forEach((item)=>{
            item.key = this.$nanoid()
          })
        })
      }
    }
  },
  methods: {
    fileChange(file,fileList) {
      this.form.file = file.raw
    },
    onSubmit(event) {
      event.preventDefault();
      this.form.date = this.$dayjs(this.form.date).format("YYYY-MM-DD")
      this.form.time = this.$dayjs(this.form.time).format("HH:mm:ss")
      this.form.dateTime = this.form.date + " " + this.form.time;
      let formData = new FormData();
      let keys = Object.keys(this.form);
      keys.forEach((key) => {
        if (key !== "date" && key !== "time") {
          formData.append(key, this.form[key]);
        }
      });
      postFile(formData).then(
        (res) => {
          this.$message({message:'上传成功', type:'success'});

          this.$eventBus.$emit("addFile", this.form.correfid)
          this.onReset()
        },
        (error) => {
          this.$message({message:'上传失败', type:'error'});
          console.log(error);
        }
      );
    },
    onReset() {
      this.form = {
        category: "",

        name: "",
        description: "",
        date: "",
        time: "",
        file: "", 
        correfid:"",
        segids:[],
      };
      this.fileList = []
    },
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    chooseFile(params){
      this.form.file = params.file!==null ? params.file.raw : null
    },
    handleRemove(){}
  },
  created() {
    getfidNames().then(res=>{
      this.fidNames = res.data.data
      this.fidNames.forEach((item)=>{
        localStorage.setItem(item.fid.trim(), item.faciname)
      })
    }).catch(err=>{
      console.log(err)
    })

  },
};
</script>

<style lang="scss" scoped>
.formContent{
  display: flex;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
  & > .outter{
    margin: auto;
  }
  .selectDiv{
    display: flex;
    justify-content: space-between;
  }

  .el-form-item{
    margin-bottom: 18px;
  }
}

.filesList{
  width: 100%;
  flex-grow: 1;
}

.buttonDiv{
  display: flex;
  margin-top: 60px;
  flex-direction: row-reverse;
}
</style>
