import {Table, Pagination, Tooltip, Modal, LocaleProvider, message, Switch} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import { Component } from 'react';
import Com from '@/component/common';
import zhCN from "antd/lib/locale-provider/zh_CN";
const confirm = Modal.confirm;
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[],
      psize:10
    };
    this.columns = [{
       title: '序号',
       dataIndex: 'key',
        width:100,
       key: 'key',
       render: (text, record, index) => {
        return <span>{index + 1}</span>;
        }
     },{
      title: '物资名称',
      dataIndex: 'materialName',
      align:"left"
    },{
      title: '周期',
      dataIndex: 'periodName',
       align:"left"
    },{
      title: '用量/亩',
      dataIndex: 'dosage',
       align:"left"
    },
    {
        title: '状态',
        dataIndex: 'stauts',
        align: "center",
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
                    {
                        this.props.editRole?<Tooltip title="编辑">
                            <span className='cursor' onClick={this.query.bind(this,record)}><i className='iconfont icon-xiugai07'></i></span></Tooltip>:''}
                    {
                        this.props.deleteRole?<Tooltip placement="top" title='删除'><span onClick={this.showDeleteConfirm.bind(this, record)}>
                          <span className='cursor'><i
                            className='iconfont icon-shanchu'></i></span>
                         </span></Tooltip>:''
                    }
                </div>;
              }
    }];
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
            this.props.Alldatas({startPage: this.props.cur, limit: this.state.psize,materialName:this.props.materialName, groupId:this.props.groupId});
        }
    }).catch(() => {
        message.error("操作失败");
    });
  }
  showDeleteConfirm(record) {
    const _this = this;
    confirm({
        title: '是否确认删除?',
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
   IOModel.delete({":id":ids}).then((res) => {
        if (res.success) {
            message.success('删除成功');
            this.props.Alldatas({startPage: this.props.cur, limit: this.state.psize,materialName:this.props.materialName, groupId:this.props.groupId});
        }
    }).catch((res) => {
        Com.errorCatch(res);
        this.setState({loading: false});
    });
  }
  async query(record) {
    this.props.suppliesName(record.workTypeId);
    this.props.defaultFields({
       id: {
         value:record.id
       },
       AllWorkType: {
        value: this.props.AllWorkType
       },
       CropPeriodsList: {
          value:this.props.CropPeriodsList
       },
       dosageUnitList: {
          value:this.props.dosageUnitList
       },
       PeriodsName:{
          value:record.periodId
       },
       dosage: {
          value:record.dosage
       },
       workTypeName: {
          value: Number(record.workTypeId)
       },
       materialName: {
          value:record.materialId
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
    const { data, cur, total} = this.props;
    const keyData = Com.addKey(data);
    let arr;
    this.props.editRole || this.props.deleteRole ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
    return (
      <div className='res-table'>
          <LocaleProvider locale={zhCN}>
              <Table  rowKey={record => record.id} columns={arr}  dataSource={keyData} pagination={false}/></LocaleProvider>
              <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={cur} defaultCurrent={1}  total={total} /></LocaleProvider>
        </div>
    );
  }
}
const mapstateprops = (state) => {
 const {total} = state.smalldetailReducer;
 const { securityKeyWord } = state.initReducer;
  return {
    total:total,
    securityKeyWord
  };
};
export default connect(mapstateprops,action)(Tables);