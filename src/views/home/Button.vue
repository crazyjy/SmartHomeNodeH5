<template>
    <section>
        <div>
            <el-col class="button-card" v-for="(device, index) in cardData" :key="index">
                <el-card class="button-box-card">
                    <div slot="header" class="clearfix">
                        <el-input v-model="aliasName[index]"></el-input>
                    </div>
                    <div>
                        <div class="cow-container" @change="pushButton(device, index)">
                            <div class="cow-toggle">
                                <input type="checkbox" v-model="device.Status">
                                <span class="cow-button">
                                    <div class="button-status-point" v-bind:style="{background: device.Status==1?'#E6A23C':'#67C23A'}"></div>
                                </span>
                                <span class="cow-label">{{device.Status?'开':'关'}}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </div>
    </section>
</template>

<style>
    .button-card {
        padding: 5px 5px;
        width: 200px
    }
    .button-box-card {
        width: 190px;
        height: 265px;
    }
    .button-status-point {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
</style>

<script>

    import "@/assets/css/cow-button.css";

    import {getButtonIndex, controlButton} from '../../api/api';

    export default {
        data() {
            return {
                cardData: [],
                aliasName: []
            };
        },
        methods: {
            getButton() {
                getButtonIndex().then((res) => {
                    if (res.data.code == "SUCCESS") {
                        let mid = "";
                        let dataList = res.data.data.split(',');
                        // 排序
                        for (let i=0; i < dataList.length-1; i++) {
                            for (let j=0; j < dataList.length-1-i; j++) {
                                if (dataList[j] > dataList[j+1]) {
                                   mid = dataList[j];
                                   dataList[j] = dataList[j+1];
                                   dataList[j+1] = mid;
                                }
                            }
                        }
                        let list = [];
                        // 分割
                        dataList.map((status, s1) => {
                            if (status != "") {
                                let device = status.split(":");
                                this.aliasName[s1] = device[0];
                                if (device.length == 2) {
                                    // 显示别名
                                    res.data.info.split(',').map((alias, s2) => {
                                        let name = alias.split(":");
                                        if (name.length == 2 && device[0] == name[0] && name[0] != name[1]) {
                                            this.aliasName[s1] = name[1]
                                        }
                                    })
                                    list[s1] = {Name: device[0], Status: (device[1]=="ON")?true:false}
                                }
                            }
                        })
                        this.cardData = list;
                    }
                });
            },
            pushButton(device, index) {
               let code = "CONTROL/:"+device.Name+"/:"+(device.Status?"ON":"OFF");
                controlButton({data:code, name:device.Name, alias: this.aliasName[index]}).then((res) => {
                    if (res.code == "SUCCESS") {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 600
                        });
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 600
                        });
                    }
                });
            }
        },
        mounted() {
            this.getButton();
        }
    }
</script>