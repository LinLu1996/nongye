import {Table, Pagination, Switch, Tooltip, LocaleProvider,message, Modal} from 'antd';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import { Component } from 'react';
import {NavLink} from 'react-router-dom';
import zhCN from "antd/lib/locale-provider/zh_CN";
const confirm = Modal.confirm;
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[]
    };
    this.columns = [{
       title: '序号',
       dataIndex: 'key',
        width: 100,
       key: 'key',
       render: (text, record, index) => {
        return <span>{index + 1}</span>;
        }
     },{
      title: '农资标准组名称',
      dataIndex: 'name',
      align:"left"
    },{
      title: '作物',
      dataIndex: 'cropName',
        align:"center"
    },
    {
        title: '状态',
        dataIndex: 'stauts',
        align:"center",
        render: (text, record) => {
            if(this.props.statusRole) {
                let flag = false;
                if(record.stauts === 1) {
                    flag = false;
                    }else{
                        flag = true;
                    }
                    return <Switch checked={flag} onChange={() => { this.changeStatus(record);}} />;
                }else {
                    return record.stauts === 1 ? '禁用' : '正常';
                }
            }
        },{
          title: '操作',
              dataIndex: 'caozuo',
              align:"center",
              render: (text, record) => {
                  return <div>
                     {this.props.listRole ? <Tooltip placement="top" title='详情'><span className='cursor'>
                     <NavLink className=" iconfont icon-xiangqing" to={`/pages/agricultural/detail/${record.id}`}></NavLink></span></Tooltip>:''}
                      {this.props.editRole ? <Tooltip title="编辑">
                          <span className='cursor' onClick={this.query.bind(this,record)}><i className='iconfont icon-xiugai07'></i></span></Tooltip>:''}
                     {this.props.deleteRole ? <Tooltip placement="top" title='删除'><span
                                    onClick={this.showDeleteConfirm.bind(this, record)}>
                        <span className='cursor'><i
                            className='iconfont icon-shanchu'></i></span>
                    </span></Tooltip>:''}
                  </div>;
              }
        }];
  }
  showDeleteConfirm(record) {
    const _this = this;
    confirm({
        title: '是否确认删除农资方案?',
        okText: '确认',
        okType: 'primary',
        cancelText: '取消',
        onOk() {
            _this.delete(record);
        }
    });
  }
  delete(record) {
    const ids = record.id;
   IOModel.Delete({":id":ids}).then((res) => {
        if (res.success) {
            message.success('删除成功');
            this.props.Alldatas({startPage: this.props.cur, limit: this.props.psize,name:this.props.Name});
        }
    }).catch((res) => {
      message.warning(res.data);
        //Com.errorCatch(res);
        this.setState({loading: false});
    });
  }
  changeStatus(record) {
    const deleteID = record.id;
    let stautsId = 0;
    if (record.stauts === 0) {
        stautsId = 1;
    } else {
        stautsId = 0;
    }
    IOModel.statusData({id: deleteID,status: stautsId}).then((res) => {
        if (res.success) {
            if (stautsId === 1) {
                message.success('禁用成功');
            } else {
                message.success('启用成功');
            }
            this.props.Alldatas({startPage: this.props.cur, limit: this.state.psize,name:this.props.Name});
        }
    }).catch(() => {
        message.error("操作失败");
    });
  }
  async query(record) {
    this.props.defaultFields({
        allDosageUnit: {
         value: this.props.allDosageUnit
       },
       AllWorkType: {
         value: this.props.AllWorkType
       },
       astgropdata:{
        value:this.props.astgropdata
       },
       id: {
        value:record.id
       },
       name: {
         value:record.name
       },
       crops: {
         value:record.cropId
       },
       stauts: {
         value:record.stauts
       },
       modeltype: {
         value:'modify'
       }
    });
      this.props.modal({modalFlag:true,modeltype:'modify'});
  }
  onSizeChangequery(current, pageSize) {
    const { onSizeChangequery } = this.props;
    onSizeChangequery(current, pageSize);
  }
    onShowSizeChange(current, pageSize) {
    const { onShowSizeChange } = this.props;
        onShowSizeChange(current, pageSize);
  }
  render() {
    const { total, data, cur } = this.props;
    let arr;
    this.props.editRole || this.props.deleteRole || this.props.listRole ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
    return (
      <div className='res-table'>
          <LocaleProvider locale={zhCN}>
        <Table rowKey={record => record.id} columns={arr}  dataSource={data} pagination={false}/>
       </LocaleProvider>
        <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={cur} defaultCurrent={1}  total={total} /></LocaleProvider>
      </div>
    );
  }
}
const mapstateprops = (state) => {
  const { EditData,total, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.AGIdetailReducer;
  return {
    EditData:EditData,
    total:total,
    chooseFlag:chooseflag,
    deleteok:deleteOK,
    TreeD,
    parentName:parentname,
    slideID, chooseSIZE, chooseCUR
  };
};
export default connect(mapstateprops,action)(Tables);