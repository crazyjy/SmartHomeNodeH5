<template>
    <section>
        <el-row :span="24" style="padding: 18px 2px;">
            <el-button type="primary" icon="el-icon-circle-plus" @click="newCard()" round>添加</el-button>
        </el-row>
        <el-row>
            <el-col style="width: 335px; padding: 10px 0; margin-right: 75px" v-for="(value, key) in cardData" :key="key">
                <el-card class="time-box-card">
                    <div slot="header">
                        <i class="el-icon-close" @click="deleteClock(value, key)" style="float: right; position: relative; top: -10px; right: -10px"></i>
                        <el-input v-model="value['Name']" style="width: 75%;"></el-input>
                        <el-switch
                            v-model="homeSwitch[key]"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            style="float: right; margin-top: 8px"
                            @change="changeSwitch(value, key)"
                        >
                        </el-switch>
                    </div>
                    <div>
                        <span style="line-height: 38px; margin-left: 2px">时间</span>
                        <template>
                            <el-time-select
                                    v-model="value['Time']"
                                    style = "width: 59%; padding: 15px 4px; margin-left: 7px"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '0:01',
                                        end: '23:59'
                                    }"
                                    placeholder="选择时间">
                            </el-time-select>
                        </template>
                    </div>
                    <div>
                        <span style="line-height: 38px; margin-left: 2px">设备</span>
                        <el-select
                                v-model="deviceList[key]"
                                multiple
                                collapse-tags
                                style="padding: 10px 4px; margin-left: 7px; width: 79%"
                                placeholder="请选择设备"
                        >
                            <el-option
                                    v-for="item in devices"
                                    :key="item.Id"
                                    :label="item.Name"
                                    :value="item.Id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="week">
                        <el-checkbox style="margin-right: 5px;" v-model="weekDay[key][0]" @change="weekClick(key)" border>周日</el-checkbox>
                        <el-checkbox style="margin-right: 5px" v-model="weekDay[key][1]" @change="weekClick(key)" border>周一</el-checkbox>
                        <el-checkbox v-model="weekDay[key][2]" @change="weekClick(key)" border>周二</el-checkbox>
                    </div>
                    <div class="week">
                        <el-checkbox style="margin-right: 5px" v-model="weekDay[key][3]" @change="weekClick(key)" border>周三</el-checkbox>
                        <el-checkbox style="margin-right: 5px" v-model="weekDay[key][4]" @change="weekClick(key)" border>周四</el-checkbox>
                        <el-checkbox v-model="weekDay[key][5]" @change="weekClick(key)" border>周五</el-checkbox>
                    </div>
                    <div class="week">
                        <el-checkbox style="margin-right: 15px" v-model="weekDay[key][6]" @change="weekClick(key)" border>周六</el-checkbox>
                        <el-button type="primary" icon="el-icon-edit" style="float: right; width: 62%; margin-right: 5px" 
                        @click="updateClock(value, key)">确认</el-button>    
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<style>
    .week {
        padding: 10px;
    }
    .time-box-card {
        width: 360px;
        height: 430px;
    }
</style>

<script>

    import Vue from 'vue';
    import {getTimeIndex, updateTime, controlTime} from '../../api/api';

    export default {
        data() {
            return {
                cardData: {},
                deviceList: [],
                homeSwitch: [],
                weekDay: [],
                form: {},
                devices: []
            };
        },
        methods: {
            init() {
                getTimeIndex().then((res) => {
                    this.cardData = JSON.parse(res.data.data);
                    this.devices = JSON.parse(res.data.info);
                    this.cardData.map((_, index) => {
                        this.homeSwitch[index] = _.Status == '1' ? true:false;
                        this.weekDay[index] = [];
                        let dList = _.DeviceList.split(',')
                        this.deviceList[index] = (dList == "") ? [] : dList.map(_=>parseInt(_));
                        let weekList = _.Week.split(',')
                        for (var y=0; y < weekList.length; y++) {
                            this.weekDay[index][y] = weekList[y] == '1' ? true:false;
                        }
                    });
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
                    "Name": "Time_"+this.randomString(5),
                    "DeviceList": "",
                    "Week": "0,0,0,0,0,0,0",
                    "Time": "00:00",
                    "Status": "0",
                    "CreatedAt": "0000-00-00 00:00:00",
                    "UpdatedAt": "0000-00-00 00:00:00"
                }
                this.from = this.cardData;
                this.from.push(newCard);
                this.weekDay[this.from.length-1] = [];
                for (var y=0; y < 7; y++) {
                    this.weekDay[this.from.length-1][y] = false;
                }
                this.addTime();
            },
            addTime() {
                let data = {data: JSON.stringify(this.from)}
                updateTime(data).then((res) => {
                    if (res.code == "SUCCESS") {                        
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 600
                        });
                        this.init();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 600
                        });
                    }
                });
            },
            deleteClock(device, key) {
                this.$confirm('确定要删除吗？', '提示', {}).then(() => {
                    this.cardData[key]['Status'] = "0";
                    this.controlClock(device, key);
                    this.cardData.map((_,key) => {                    
                        if (_.Id == device.Id) {
                            this.cardData.splice(key,1)
                        }
                    })
                    this.from = this.cardData;
                    this.addTime();
                });
            },
            updateClock(device, key) {
                let weekCheckFlag = true;
                this.weekDay[key].map((weekCheck) => {
                   if (weekCheck) {
                        weekCheckFlag = false;
                   }
                })
                if (this.deviceList[key].length == 0 || weekCheckFlag || this.cardData[key]['Time'] == null ) {
                    this.$message({
                        message: "请检查填写内容",
                        type: "error"
                    });
                    return
                }
                this.cardData[key].DeviceList = "";
                this.deviceList[key].map((_,index) => {
                    this.cardData[key].DeviceList += _;
                    if (index < this.deviceList[key].length - 1) {
                        this.cardData[key].DeviceList += ','
                    }
                })
                this.cardData[key].Week = "";
                this.weekDay[key].map((_,index) => {
                    this.cardData[key].Week += _?'1':'0';
                    if (index < 6) {
                        this.cardData[key].Week += ',';
                    }
                })
                this.from = this.cardData;
                this.addTime();
                this.controlClock(device, key);
            },
            controlClock(device, key) {
                let dataLink = "";
                let info = '';
                this.weekDay[key].map((week, weekKey) => {
                    if (week) {
                        info = device.Id+"@"+device.Time+"#";
                        this.deviceList[key].map((deviceId, listKey)=>{
                            this.devices.map((device, deviceKey) => {
                                if (device.Id == deviceId) {
                                    info += "CONTROL/:"+device.Code+"/:"+device.Status;
                                }
                            })
                            if (listKey < this.deviceList[key].length - 1) {
                                info += ',';     
                            }
                        })
                    } else {
                        info = device.Id+"@"+"DEL";
                    }
                    dataLink += info;
                    if (weekKey < 6) {
                        dataLink += "&";
                    }
                })
                controlTime({data: dataLink, door: this.cardData[key]['Status']}).then((res) => {
                    if (res.code != "SUCCESS") {
                        this.$message({
                            message: res.msg,
                            type: "error",
                            duration: 600
                        });
                    }
                });
            },
            weekClick(key) {
                Vue.set(this.weekDay, key, this.weekDay[key]);
            },
            changeSwitch(device, key) {
                let weekCheckFlag = true;
                this.weekDay[key].map((weekCheck) => {
                   if (weekCheck) {
                        weekCheckFlag = false;
                   }
                })
                if (this.deviceList[key].length == 0 || weekCheckFlag || this.cardData[key]['Time'] == null ) {
                    this.$message({
                        message: "请检查填写内容",
                        type: "error"
                    });
                    this.homeSwitch[key] = false;
                    this.cardData[key]['Status'] = '0'
                    return
                }
                this.cardData[key]['Status'] = this.cardData[key]['Status']=='0'?'1':'0';
                this.updateClock(device, key);
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
