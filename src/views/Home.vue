<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'S':sysName}}
			</el-col>
			<el-col :span="5">
				<div class="clock-container" @click.prevent="collapse">
					<i class="el-icon-time"></i>
					<span>{{clockH}}</span> :
					<span>{{clockM}}</span> :
					<span>{{clockS}}</span> 
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><i class="el-icon-s-custom">{{sysUserName}}</i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="showMessage">我的消息</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<div style="height: 100%" v-show="!collapsed">
					<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router>
						<template v-for="(item,index) in $router.options.routes">
							<template v-if="!item.hidden">
								<el-submenu :index="index+''" v-if="!item.leaf" v-bind:key="index">
									<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
									<template v-if="!child.hidden"><el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">{{child.name}}</el-menu-item></template>
								</el-submenu>
								<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" v-bind:key="index"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>	
							</template>
						</template>
					</el-menu>
				</div>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<template v-for="(item,index) in $router.options.routes">
						<li v-if="!item.hidden" v-bind:key="index" class="el-submenu item">
							<div class="el-submenu__title" style="margin-top:10px;" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li></li>
							</ul>
						</li>
					</template>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>

	import {getServerTime} from '../api/api';

	export default {
		data() {
			return {
				sysName:'SmartHome_V0.1',
				collapsed: true,
				sysUserName: 'Admin',
				sysUserAvatar: '',
				clockH: '00',
				clockM: '00',
				clockS: '00',
				hours: 0,
				minute: 0,
				second: 0
			}
		},
		methods: {
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			showMessage() {
 				this.$message({
					message: "欢迎使用飞鱼智能控制系统",
					type: 'success'
				});
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					// type: 'warning'
				}).then(() => {
					// sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			goto(path) {
				console.log(path.children[0].path)
			},
			showtime(){
				
			},
			showTime() {
				setInterval(()=>{
					this.second += 1
					if (this.second > 59) {
						this.second = 0;
						this.minute ++;
					}
					if (this.minute > 59) {
						this.minute = 0;
						this.hours ++;
					}
					if (this.hours > 23) {
						this.hours = 0;
					}
					this.clockH=this.hours<=9?"0"+this.hours:this.hours;
					this.clockM=this.minute<=9?"0"+this.minute:this.minute;
					this.clockS=this.second<=9?"0"+this.second:this.second;
				},1000);
			},
			beginTime() {
				getServerTime().then((res) => {
					if (res.data.code == "SUCCESS") {
						let time = [];
						res.data.data.split(':').map((data, index) => {
							time[index] = data;
						});
						if (time.length == 3) {
							this.hours = Number(time[0]);
							this.minute = Number(time[1]);
							this.second = Number(time[2]);
						}
					}
				});
			},
			loopGetTime() {
				setInterval(()=>{
					this.beginTime();
				},360000);
			}
		},
		mounted() {
			this.beginTime(); // 首次获取时间
			this.showTime();  // 显示时间
			this.loopGetTime(); // 每6分钟重新获取时间
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
	.clock-container{
		font-size: 18px;
		padding: 0px 23px;
		width: 140px;
		height: 60px;
		line-height: 60px;
		cursor: pointer;
	}
	.clock-container span{
		width:20px;
	}
</style>