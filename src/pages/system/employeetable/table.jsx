import {Table, message, Modal, LocaleProvider, Divider} from 'antd';
import { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {action} from './model';
import Com from '@/component/common';
const confirm = Modal.confirm;
import {IO} from '@/app/io';
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusloading:false,
      psize:10,
      recordid:-1
    };
    this.columns = [{
        title: '序号',
        dataIndex: 'key',
        align: 'center',
        width: 100,
        key: 'key',
        render: (text, record, index) => {
            return <span>{index + 1}</span>;
        }
    },{
        title: '姓名',
        dataIndex: 'realName',
        sorter: true,
        align: 'center'
    },{
        title: '性别',
        dataIndex: 'sexx',
        sorter: true,
        align: 'center'
    },{
        title: '是否创建账号',
        dataIndex: 'creatAccount_',
        align: 'center'
    },{
        title: '类型',
        dataIndex: 'type_',
        align: 'center'
    },{
        title: '手机',
        dataIndex: 'mobilePhone1',
        align: 'center'
    },{
        title: '所属公司',
        dataIndex: 'companyName',
        align: 'center'
    },{
        title: '身份证号',
        dataIndex: 'idCardNo',
        align: 'left'
    },{
        title: '是否贫困',
        dataIndex: 'poor_',
        align: 'center'
    }
        , {
            title: '操作',
            dataIndex: 'xiugai',
            align: 'center',
            width:280,
            render: (text, record) => {
                // 权限
                const securityKeyWord = this.props.securityKeyWord;
                return <div>
                    <NavLink to={`/pages/system/employee/${record.id}`}>详情</NavLink>
                    {
                        (Com.hasRole(securityKeyWord, 'employee_update', 'update','employee')) &&
                            <span><Divider type="vertical" /><a onClick={this.query.bind(this, record)}>编辑</a></span>
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'employee_delete', 'delete','employee')) &&
                            <span><Divider type="vertical" /><a onClick={this.showDeleteConfirm.bind(this, record)}>删除</a></span>
                    }
                    {
                        (Com.hasRole(securityKeyWord, 'empRole_updateByEmpId', 'update','employee')) &&
                            <span>
                                <Divider type="vertical" /><a onClick={this.props.Assignroles.bind(this, record)}>分配角色</a></span>
                    }
                    {record.type !== 3 &&
                        (Com.hasRole(securityKeyWord, 'empOrg_updateByEmpId', 'update','employee')) &&
                            <span>
                                <Divider type="vertical" /><a onClick={this.props.Assignorg.bind(this, record)}>分配资产</a>
                            </span>
                    }
                    {'platform' === localStorage.getItem('accountType') &&
                        <span>
                        {
                        (Com.hasRole(securityKeyWord, 'node_insertUseAndNode', 'update','employee') && record.type === 4) &&
                           <span onClick={this.props.Assignnode.bind(this, record)}
                           >
                               <Divider type="vertical" /><a onClick={this.props.Assignnode.bind(this, record)}>分配节点</a>
                           </span>
                        }
                        </span>
                    }
                </div>;
            }
        }
    ];
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
    const {current, Nameval} = this.props;
    IO.employee.employeeDelete({':id': ids}).then((res) => {
        if (res.success) {
            message.success('删除成功');
            this.props.Alldatas({
                roleName: Nameval,
                startPage: current,
                poor:this.props.poverty,
                sex:this.props.sex,
                mobilePhone1:this.props.phoneNumber,
                limit: this.state.psize,
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder
            });
        }
    }).catch((res) => {
        Com.errorCatch(res);
        this.setState({loading: false});
    });
}
  query(record) {
    const querydata = {
      realName: {
        value: record.realName
      },
      gender: {
        value: record.sex
      },
      creatAccount: {
        value: record.createAccount
      },
      type: {
        value: record.type
      },
      phoneNumber: {
        value: record.mobilePhone1
      },
      certificateType: {
          value:record.idCardType
      },
      certificateNumber: {
          value:record.idCardNo
      },
      isPoverty: {
          value: record.poor
      },
      companyId: {
        value: record.companyId
      },
      companyName: {
        value: record.companyName
      }
    };
    this.props.setDefaultCreate(record.createAccount);
    this.props.defaultFields(querydata);
    this.props.querydefaultfields(querydata);
    this.props.modal({modalFlag:true,modeltype:'modify'});
    this.props.parentID(record.id);
  }
  onTableChange(pagination, filters, sorter) {
    this.setState({
        psize:pagination.pageSize
    });
    this.props.getpsize(pagination.pageSize, pagination.current);
    this.props.onTableChange(pagination, filters, sorter);
  }
  render() {
    const me = this;
    const { total, data, flag, current, securityKeyWord } = this.props;
    let arr;
    Com.hasRole(securityKeyWord, 'role_update', 'update','employee') || Com.hasRole(securityKeyWord, 'role_delete', 'delete','employee')?arr=this.columns:arr = this.columns.slice(0,this.columns.length-1);
    const TableOpt = {
        columns: arr,
        onChange: me.onTableChange.bind(me),
        dataSource:data,
        loading:flag
    };
    const PaginOpt = {
        total:total,
        current:current,
        showSizeChanger:true,
        showQuickJumper:true
    };
    return (
        <div className='res-table sider-table'>
            <LocaleProvider locale={zhCN}><Table {...TableOpt} pagination={PaginOpt}/></LocaleProvider>
        </div>
    );
  }
}
const mapstateprops = (state) => {
  const {total, deleteOK, flag, sortfield, sortorder } = state.employeeReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    total,
    deleteok:deleteOK,
    flag,
    list:state.systemReducer.listdata,
    securityKeyWord,
    sortfield, sortorder
  };
};
export default connect(mapstateprops,action)(Tables);