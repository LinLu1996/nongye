 import {Table, Pagination, Switch, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import '../../index.less';
 import zhCN from "antd/lib/locale-provider/zh_CN";
 import Public from "@/pages/masterdata/public.js";

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
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
        },
            {
                title: '周期名称',
                dataIndex: 'name',
                align: "left"
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left"
            },
            {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if (this.props.editRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch checked={flag} onChange={
                            this.changeStatus.bind(this,record)
                        }/>;
                    } else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
        if (this.props.editRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <a onClick={this.query.bind(this, record)}>编辑</a>;
                    /*<div>
                        <Tooltip title="编辑">
                            <span className='cursor' onClick={this.query.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip>
                    </div>;*/
                }
            });
        }
    }

    changeStatus(record) {
        const {Cur,Psize} = this.props;
        const flag=Public.changeStatus(record,'period_status');
        flag.then((resolve) => {
            if(resolve) {
                this.props.Alldatas({startPage: Cur, limit: Psize, name: this.props.name});
            }
        });
    }

    query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            name: {
                value: record.name
            },
            createUserName: {
                value: record.createUserName
            },
            createTime: {
                value: record.gmtCreate
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
        this.props.page({current: 1, pageSize: pageSize});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current: current, pageSize: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    render() {
        const {total, data, Cur} = this.props;
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table rowKey={record => record.id} columns={this.columns} dataSource={data} pagination={false}/></LocaleProvider>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.growthReducer;
    return {
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);
