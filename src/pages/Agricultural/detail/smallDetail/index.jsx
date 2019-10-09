import { Component } from 'react';
import { Input, Button } from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action,IOModel,message} from './model';
import ModalForm  from './modalForm.jsx';
import Com from "@/component/common";
import _ from "lodash";
import './../../index.less';
import './index.less';
// import Com from "@/component/common";
class Resources extends Component {
  constructor(props) {
    super(props);
    this.state={
      typeName:'',//操作名称
      allWorkType:[],//所有类型
      farmingType: '',//农事类型
      queryFlag:false,  //筛选按钮
      chooseId:null,
      queryRole: false,
      addRole: false,
      editRole: false,
      getRole: false,
      saveFlag:true,
      closure:null,
      psize:10,
      current:1,
      allWorkTypes:[],
      CropPeriodsList:[],
      suppliesNameList:[]
    };
  }
  async componentDidMount() {
      this.getuserinfo();
      //this.props.Alldatas({startPage:1,limit:10});  //进入页面请求列表数据
  }
  getuserinfo () {
      const id_ =  _.replace(this.props.location.pathname, '/pages/agricultural/detail/', '');
      this.setState({
        groupId:id_
      });
      IOModel.parentlist({":id":id_}).then((res) => {
          IOModel.GetworkPeriod({":id":res.data.cropId}).then((res) => {
            this.setState({
                CropPeriodsList: res.data.astCropPeriods
            });
        }).catch();
      });
      this.props.Alldatas({startPage:1,limit:10,groupId:id_});
        IOModel.GetWorkType().then((res) => {
            const allWorkType = res.data || [];
            allWorkType.forEach((item,index) => {
                if(item.name==='采收') {
                    allWorkType.splice(index,1);
                }
            });
            this.setState({
                allWorkTypes: allWorkType
            });
        }).catch();
    }
    suppliesName(id) {
        IOModel.GetastMaterials({workTypeId: id}).then((res) => {
            if (res.success) {
                this.setState({
                    suppliesNameList: res.data.materials
                });
            }
        }).catch(() => {
            message.warning("获取失败");
        });
    }
  setOperationName() {  //查找的表单-操作名称
    this.setState({
      typeName:event.target.value,
      current:1
    },() => {
      if(this.state.closure) {
        clearTimeout(this.state.closure);
      }
      this.setState({
        closure : setTimeout(() => {
            this.props.Alldatas({startPage:this.state.current,sortField: 'gmt_create',sortOrder: 'DESC',limit:this.state.psize,materialName:this.state.typeName});
        },800)
      });
    });
  }
   onSizeChangequery(current,psize) {  //点击筛选的分页按钮
    this.setState({
        current: current,
        psize:psize
    });
    const {typeName} = this.state;
    this.props.Alldatas({startPage: current, limit: psize,materialName:typeName,sortField: 'gmt_create',sortOrder: 'DESC'});
   }
   onShowSizeChange(current,psize) {
    this.setState({
        current: current,
        psize:psize
    });
    const {typeName} = this.state;
    this.props.Alldatas({startPage: current, limit: psize,materialName:typeName,sortField: 'gmt_create',sortOrder: 'DESC'});
   }
   getpsize(psize,cur) {
       this.setState({
           psize:psize,
           current:cur
       });
   }
  addmodel() {   //增加的按钮
    this.props.modal({modalFlag:true,modeltype:'add'});
    this.setState({
        suppliesNameList:[]
    });
    this.props.defaultFields({
      AllWorkType: {
        value: this.state.allWorkTypes
      },
      CropPeriodsList: {
          value:this.state.CropPeriodsList
      },
      PeriodsName:{
          value:''
      },
      dosage: {
          value:''
      },
      workTypeName: {
          value: ''
      },
      materialName: {
          value:''
      },
      modeltype:{
         value:'add'
       }
    });
  }
    return() {
        location.href='/#/pages/agricultural/detail';
    }
  render() {
      const {dataList, securityKeyWord} = this.props;
      const addRole = Com.hasRole(securityKeyWord, 'materialStandard_add', 'insert');
      const editRole = Com.hasRole(securityKeyWord, 'materialStandard_update', 'update');
      const deleteRole = Com.hasRole(securityKeyWord, 'materialStandard_delete', 'delete');
      const statusRole = Com.hasRole(securityKeyWord, 'materialStandard_setStatusById', 'setStatusById');
    return (
        <div className='farming-box master-box'>
          <div className='farming-search'>
              <div className='farming-title'>
            <div className='title'>农资标准详情</div>
            <div className='search-layout-soil'>
            <div className='search-row'>
               <div className='search-col'>
                  <span className='label-title'>农资标准名称</span>
                    <Input size="large" value={this.state.typeName} onChange={this.setOperationName.bind(this)}/>
               </div>
               <div><button onClick={this.return.bind(this)}>返回</button></div>
            </div>
            </div></div>
        </div>
        <div className='content'>
          <div className='table-header'>
             <p><i className='iconfont icon-sort'></i><span>农资标准详情列表</span></p>
              {addRole?<p><Button onClick={this.addmodel.bind(this)}>新增农资标准详情</Button></p>:''}
           </div>
            {<Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)}  cur={this.state.current} psize={this.state.psize} groupId={this.state.groupId} materialName={this.state.typeName}
                                  getpsize={this.getpsize.bind(this)}
                                  AllWorkType= {this.state.allWorkTypes}
                                  CropPeriodsList={this.state.CropPeriodsList}
                                  editRole={editRole}
                                  deleteRole={deleteRole}
                                  statusRole={statusRole}
                                  suppliesName={this.suppliesName.bind(this)}
                                  onShowSizeChange={this.onShowSizeChange.bind(this)}
                                  />}
          <ModalForm props={this.props} cur={this.state.current}  psize={this.state.psize} suppliesNameList={this.state.suppliesNameList} suppliesName={this.suppliesName.bind(this)} materialName={this.state.typeName} groupId={this.state.groupId}/>
        </div>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const { Alldate } = state.smalldetailReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    dataList:Alldate,//展示列表的数据
    securityKeyWord
  };
};
export default connect(mapStateprops,action)(Resources);
