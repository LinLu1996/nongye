import {Table, Pagination, Modal, LocaleProvider, message, Divider} from 'antd';
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
            align: 'center',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
            title: '农事类型名称',
            dataIndex: 'name',
            align:"left"
        }, {
            title: '英文名称',
            dataIndex: 'code',
            align:"left"
        }
            ,{
                title: '创建人',
                dataIndex: 'createUserName',
                align:"left"
            },
            {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    return record.stauts === 1 ? '禁用' : '正常';
                }
            }];
        //if(this.props.editRole) {
        this.columns.push({
            title: '操作',
            dataIndex: 'caozuo',
            align:"center",
            render: (text, record) => {
                if(record.code==="harvest") {
                    return <div>
                        {this.props.securityKeyWord.indexOf("platform_all")> -1 ?
                            <span >不可编辑</span> :''}
                        <Divider type="vertical" />
                        {this.props.securityKeyWord.indexOf("platform_all") > -1 ?
                            <span >不可删除</span> :''}
                    </div>;
                }else {
                    return <div>
                        {this.props.securityKeyWord.indexOf("platform_all")> -1 ?
                            <a onClick={this.query.bind(this,record)}>编辑</a> :''
                        }
                        <Divider type="vertical" />
                        {this.props.securityKeyWord.indexOf("platform_all") > -1 ?
                            <a onClick={this.showDeleteConfirm.bind(this, record)}>删除</a> :''
                        }
                    </div>;
                }
            }
        });
        //}
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
                this.props.Alldatas({startPage: this.props.current, limit: this.state.psize,name:this.props.names, sortField: 'gmt_create',sortOrder: 'DESC'});
            }
        }).catch((res) => {
            Com.errorCatch(res);
            this.setState({loading: false});
        });
    }
    async query(record) {
        this.props.defaultFields({
            id: {
                value:record.id
            },
            name: {
                value:record.name
            },
            code: {
                value:record.code
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
        this.setState({
            psize:pageSize
        });
        this.props.getpsize(pageSize, current);
        this.props.Alldatas({startPage: current, limit: pageSize,name:this.props.names, sortField: 'gmt_create',sortOrder: 'DESC'});
    }
    render() {
        const { data, current, total} = this.props;
        const keyData = Com.addKey(data);
        let arr;
        this.props.securityKeyWord.indexOf("platform_all") >-1 ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table  rowKey={record => record.id} columns={arr}  dataSource={keyData} pagination={false}/></LocaleProvider>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={current} defaultCurrent={1}  total={total} /></LocaleProvider>
            </div>
        );
    }
}
const mapstateprops = (state) => {
 const {total} = state.workTypeReducer;
 const { securityKeyWord } = state.initReducer;
  return {
    total:total,
    securityKeyWord
  };
};
export default connect(mapstateprops,action)(Tables);
