<template>
    <section>
        <el-col :span="24" style="padding: 18px 2px;">
            <el-button type="primary" icon="el-icon-circle-plus" @click="newCard()" round>添加</el-button>
        </el-col>
        <div>
            <el-col class="on-off-card" v-for="(device, index) in cardData" :key="index">
                <el-card class="on-off-box-card">
                    <div slot="header" class="clearfix">
                        <i class="el-icon-close" @click="delCard(device.Id)" style="float: right; position: relative; top: -10px; right: -10px"></i>
                        <el-input v-model="device.Name" placeholder="开关名称" style="left: 10px; width: 60%"></el-input>
                        <el-button type="text" icon="el-icon-refresh" style="margin-right: 2px; float:right"
                                   @click="updateCard(index)"><strong>更 新</strong></el-button>
                    </div>
                    <div>
                        <el-autocomplete class="autocomplete"
                              popper-class="my-autocomplete"
                              v-model="device.Code"
                              :fetch-suggestions="querySearch"
                              placeholder="设备名称"
                              @select="handleSelect">
                          <i class="el-icon-edit el-input__icon" slot="suffix"
                            @click="handleIconClick(device)">
                          </i>
                          <template slot-scope="props">
                            <div class="name">{{ props.item.value }}</div>
                          </template>
                        </el-autocomplete>
                    </div>
                    <div style="padding: 20px 0px; text-align: center;">
                        <template>
                          <el-radio style="margin-right: 90px" v-model="device.Status" label="ON">开</el-radio>
                          <el-radio v-model="device.Status" label="OFF">关</el-radio>
                        </template>
                    </div>
                    <div>
                        <el-button type="primary" icon="el-icon-success" style="float:right; margin-right: 5px; width: 95%" @click="pushCard(device)"><strong>确 认</strong></el-button>
                    </div>
                </el-card>
            </el-col>
        </div>
    </section>
</template>

<style>
    .on-off-card {
        padding: 15px 4px;
        width: 305px
    }
    .on-off-box-card {
        width: 280px;
        height: 280px;
    }
    .autocomplete {
        width: 93%; padding: 2px 0px; margin-left: 10px
    }
</style>

<script>

    import {createSwitch, getSwitchIndex, controlSwitch} from '../../api/api';

    export default {
        data() {
            return {
                cardData: {},
                from: {},
                switchList: [],
                selectSwitch: [],
                devices: [],
                restaurants: []
            };
        },
        methods: {
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                // 调用 callback 返回建议列表的数据
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                  return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            },
            handleIconClick(device) {
                this.$message({
                    message: "控制码: CONTROL/:"+device.Code+"/:"+device.Status
                });
            },
            randomString(e) {  
                e = e || 32;
                var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
                a = t.length,
                n = "";
                for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
                return n
            },
            newCard() {
                let newCard = {
                    "Id": (new Date()).valueOf(),
                    "Name": "Switch_"+this.randomString(5),
                    "Code": "",
                    "Status": "OFF",
                    "CreatedAt": "0000-00-00 00:00:00",
                    "UpdatedAt": "0000-00-00 00:00:00"
                }
                this.cardData.push(newCard);
                this.from = this.cardData;
                this.addSwitch();
            },
            updateCard(index) {
                if (this.cardData[index].Name == "" || this.cardData[index].Code == "") {
                    this.$message({
                        message: "请填写",
                        type: 'error'
                    });
                    return
                }
                this.from = this.cardData;
                this.addSwitch();
            },
            pushCard(device) {
                if (device.Name == "" || device.Code == "") {
                    this.$message({
                        message: "请填写",
                        type: 'error'
                    });
                    return
                }
                let code = "CONTROL/:"+device.Code+"/:"+device.Status;
                controlSwitch({data:code}).then((res) => {
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
            },
            getSwitch() {
                getSwitchIndex().then((res) => {
                    if (res.data.code == "SUCCESS") {
                        this.devices = [];
                        this.cardData = JSON.parse(res.data.data);
                        res.data.info.split(',').map((data) => {
                            if (data != "") {
                                this.devices.push({"value":data})
                            }
                        })
                        this.restaurants = this.devices
                    }
                });
            },
            changeWitch(index) {
                this.updateCard(index);
            },
            addSwitch() {
                let data = {data: JSON.stringify(this.from)}
                createSwitch(data).then((res) => {
                    if (res.code == "SUCCESS") {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 600
                        });
                        this.getSwitch();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 600
                        });
                    }
                });
            },
            delCard(id) {
                this.$confirm('确定要删除吗？', '提示', {}).then(() => {
                    this.cardData.map((_,key) => {                    
                        if (_.Id == id) {
                            this.cardData.splice(key,1)
                        }
                    })
                    this.from = this.cardData;
                    this.addSwitch();
                });
            }
        },
        mounted() {
            this.getSwitch();
        }
    }
</script>