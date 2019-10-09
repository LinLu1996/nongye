import { Component } from 'react';
import { Input, Button } from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import ModalForm  from './modalForm.jsx';
import '../../index.less';
import './index.less';
import Com from "@/component/common";
import Public from "@/pages/masterdata/public";
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: '',//操作名称
            allDosageUnit: [],//所有类型
            allWorkType: [],//所有类型
            agriculturalType: '',//农事类型
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            saveFlag: true,
            closure:null,
            psize:10,
            current:1,
            astgropdata:[]
        };
    }

    async componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10});  //进入页面请求列表数据
        IOModel.GetWorkType().then((res) => {
            const allWorkType = res.data || [];
            allWorkType.forEach((item,index) => {
                if(item.name==='采收') {
                    allWorkType.splice(index,1);
                }
            });
            this.setState({
                allWorkType: allWorkType
            });
        }).catch();
        IOModel.allDosageUnit().then((res) => {
            this.setState({
                allDosageUnit: res.data
            });
        }).catch();
        IOModel.astGrop().then((res) => {
           if(res.success) {
             let data;
             res && res.data ? data=res.data : data=[];
             this.setState({
              astgropdata:data
             });
           }
        });
        this.props.superiorName({name: '农资', parentLeftID: -1});
    }

  setOperationName(event) {  //查找的表单-基地名称
    this.setState({
       Name:event.target.value
    },() => {
      if(this.state.Name) {
        this.setState({
          queryFlag:true
        });
      } else {
        this.setState({
          queryFlag:false
        });
      }
      if(this.state.closure) {
        clearTimeout(this.state.closure);
      }
      this.setState({
        closure : setTimeout(() => {
          this.query();
        },800)
      });
    });
  }

  query() {  //查询按钮
    this.setState({
      queryFlag:true //控制分页的展示
    });
    const vm={
        name:this.state.Name,
        workTypeId:this.state.agriculturalType,
        startPage:this.state.current,
        limit:this.state.psize
    };
    this.props.queryAll(vm);
    this.props.page({current: 1, pageSize: 10});
  }
   onSizeChangequery(current,size) {  //点击筛选的分页按钮
       this.setState({
           queryFlag:true, //控制分页的展示
           current:current,
           psize:size
       });
       const vm={
           name:this.state.Name,
           workTypeId:this.state.agriculturalType,
           startPage:current,
           limit:size
       };
       this.props.queryAll(vm);
   }
    onShowSizeChange(current,size) {  //点击筛选的分页按钮
       this.setState({
           queryFlag:true, //控制分页的展示
           current:current,
           psize:size
       });
       const vm={
           name:this.state.Name,
           workTypeId:this.state.agriculturalType,
           startPage:current,
           limit:size
       };
       this.props.queryAll(vm);
   }

  addmodel() {   //增加的按钮
    this.props.modal({modalFlag:true,modeltype:'add'});
    this.props.defaultFields({
        allDosageUnit: {
        value: this.state.allDosageUnit
      },
      AllWorkType: {
        value: this.state.allWorkType
      },
      astgropdata: {
        value:this.state.astgropdata
      },
      crops: {
        value: ''
      },
      id: {
         value: ''
      },
      name: {
        value: ''
      },
      modeltype:{
         value:'add'
       }
    });
}

  fnondrag(num) {   //点击左侧边的id
    this.setState({
      chooseId:num
    });
  }
  checkName(name,id,type) {
      if(this.state.closure) {
          clearTimeout(this.state.closure);
      }
      this.setState({
          closure : setTimeout(() => {
              const saveFlag = Public.checkName(name,id,type);
              saveFlag.then((resolve) => {
                  this.setState({
                      saveFlag:resolve
                  });
              });
          },800)
      });
    }
  render() {
      const {securityKeyWord} = this.props;
      const me=this;
      const addRole = Com.hasRole(securityKeyWord, 'material_standard_group_add', 'insert');
      const editRole = Com.hasRole(securityKeyWord, 'material_standard_group_update', 'update');
      const deleteRole = Com.hasRole(securityKeyWord, 'material_standard_group_delete', 'delete');
      const listRole = Com.hasRole(securityKeyWord, 'materialStandard_listByPage', 'listByPage');
      const statusRole = Com.hasRole(securityKeyWord, 'materialStandardGroup_setStatusById', 'setStatusById');
      const { dataList} = this.props;
      const { queryFlag, allWorkType} = this.state;
      const list = [];
      list.push({id: '',name: '全部'});
      allWorkType.forEach((item) => {
          list.push(item);
      });
      const tableOpt={
        data:dataList,
        Name:me.state.Name,
        agriculturalType:me.state.agriculturalType,
        onSizeChangequery:me.onSizeChangequery.bind(me),
        onShowSizeChange:me.onShowSizeChange.bind(me),
        name:me.state.name,
        queryFlag:queryFlag,
        AllWorkType:me.state.allWorkType,
        allDosageUnit:me.state.allDosageUnit,
        editRole:editRole,
        deleteRole:deleteRole,
        listRole:listRole,
        statusRole:statusRole,
        psize:me.state.psize,
        cur:me.state.current,
        astgropdata:me.state.astgropdata
      };
      const modelOpt={
        Name:me.state.Name,
        agriculturalTypes:me.state.agriculturalType,
        props:me.props,
        checkName:me.checkName.bind(me),
        // queryRole:queryRole,
        saveFlag:me.state.saveFlag,
        psize:me.state.psize,
        cur:me.state.current
      };
    return (
      <div className='farming-box master-box'>
          <div className='farming-search'>
              <div className='farming-title'>
                  <div className='title'>农资标准组</div>
            <div className='search-layout'>
            <div className='search-row AGR-row'>
               <div className='search-AGR'>
                  <span className='label-title'>农资标准组名称</span>
                  <Input  size="large" value={this.state.Name} onChange={this.setOperationName.bind(this)}/>
               </div>
            </div>
          </div>
              </div>
        </div>
        <div className='content'>
          <div className='table-header'>
             <p><i className='iconfont icon-sort'></i><span>农资标准组列表</span></p>
            {addRole?<p><Button onClick={this.addmodel.bind(this)}>新增农资标准组</Button></p>:''}
           </div>
            <Tables {...tableOpt}/>
          <ModalForm {...modelOpt}/>
        </div>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const { Alldate,slideName} = state.AGIdetailReducer;
   const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['material_listByPage','material_add','material_update','material_getById'];
    return {
        dataList:Alldate,//展示列表的数据
        slideName,
        securityKeyWord
  };
};
export default connect(mapStateprops,action)(Resources);
