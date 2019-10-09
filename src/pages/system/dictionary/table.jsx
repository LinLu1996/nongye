import {Table, message, Switch, Tooltip, LocaleProvider, Modal, Divider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const confirm = Modal.confirm;
import './index.less';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: this.props.Data2,
            selectedRowKeys: [],
            psize: 10
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                align: "center",
                key: 'key',
                width:100,
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '大类名称',
                dataIndex: 'name',
                align: "left"
            }, {
                title: '英文名称',
                dataIndex: 'code',
                align: "left",
                key: 'code'
            },{
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left"
            }, {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if (this.props.statusRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch defaultChecked={flag} onChange={() => {
                            this.changeStatus(record);
                        }}/>;
                    } else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            },{
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div>
                        {this.props.addRole ?
                            <a onClick={this.addSmallClass.bind(this, record)}>添加作物小类</a>
                        :''}
                        {this.props.addRole && this.props.editRole && <Divider type="vertical" />}
                        {this.props.editRole ?
                            <a onClick={this.query.bind(this, record)}>编辑</a>
                        :''}
                        {this.props.addRole && !this.props.editRole && this.props.deleteRole && <Divider type="vertical" />}
                        {this.props.editRole && this.props.deleteRole && <Divider type="vertical" />}
                        {this.props.deleteRole ?
                            <a onClick={this.showDeleteConfirm.bind(this, record)}>删除</a>
                        :''}
                    </div>;
                }
            }];
        }
    showDeleteConfirm(record,e) {
        let tit;
        e.stopPropagation();
        if (record.parentId===-1) {
            tit = '您确定删除大类吗？';
        } else {
            tit = '是否确认删除？';
        }
        const _this = this;
        confirm({
            title: tit,
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.confirm(record);
            }
        });
    }
    confirm(record) {
        const deleteID = record.id;
        IOModel.Delete({':id': deleteID}).then((res) => {
            if (res.success) {
                const data2 = this.props.Data2;
                if (record.parentId===-1) {
                    this.props.Alldatas({startPage: this.props.cur, limit: this.state.psize,name:this.props.name,parentId:-1});
                } else {
                    IOModel.ListInGroupAll({parentId: record.parentId}).then((res) => {
                        if (res.success) {
                            data2[record.parentId]=res.data;
                            this.setState({
                                data1:data2
                            });
                            this.props.changeData2(data2);
                        }
                    }).catch();
                }
                message.success('删除成功');
            }
        }).catch(() => {
            this.setState({
                loadflag: false
            });
        });
    }

    async componentWillReceiveProps(nextProps) {
      await this.setState({
        data1: nextProps.Data2
      });
    }

    changeStatus(record) {
       // const {Alldatas, chooseAll, slideID, Cur, Psize, chooseCUR, chooseSIZE} = this.props;
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
                this.props.Alldatas({startPage: this.props.cur, limit: this.state.psize,name:this.props.name,parentId:-1});
            }
        }).catch(() => {
            message.error("操作失败");
        });
    }

    changeGradeStatus(record) {
        let stautsId = 0;
        if (record.stauts === 0) {
            stautsId = 1;
        } else {
            stautsId = 0;
        }
        const modifydata = {
            id: record.id,
            status: stautsId
        };
        IOModel.statusData(modifydata).then((res) => {
            if (res.success && res.data > 0) {
                const data2 = this.props.Data2;
                const data = Object.assign({},data2);
                    IOModel.ListInGroupAll({parentId: record.parentId}).then((res) => {
                    if (res.success) {
                        data[record.parentId] = res.data;
                        this.props.changeData2(data);
                    }
                }).catch();
                if (stautsId === 0) {
                    message.success('启用成功');
                } else {
                    message.success('禁用成功');
                }
            }
        }).catch(() => {
            message.error("操作失败");
        });
    }

    async query(row) {
        this.props.defaultFields({
            id: {
                value: row.id
            },
            name: {
                value: row.name
            },
            stauts: {
                value: row.stauts
            },
            parentId: {
                value: row.parentId
            },
            code: {
                value:row.code
            },
            createName: {
                value: row.createUserName
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    addSmallClass(record) {
        this.props.defaultFields({
            dictionaryOne: {
                value: record.id
            },
            id: {
                value: ''
            },
            name: {
                value: ''
            },
            code: {
                value:''
            },
            stauts: {
                value: ''
            },
            parentId: {
                value: record.id
            },
            createName: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
        this.props.modalTwo({modalFlag: true, modeltype: 'add'});
    }
    onTableChange(pagination, filters, sorter) {
        const {onTableChange} = this.props;
        this.setState({
            psize:pagination.pageSize
        });
        onTableChange(pagination, filters, sorter);
    }
    expandedRowRender(record) {
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:100,
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            }, {
                title: '小类名称',
                dataIndex: 'name',
                align: "left",
                key: 'name'
            }, {
                title: '英文名称',
                dataIndex: 'code',
                align: "left",
                key: 'code'
            },
            {
                title: '状态',
                dataIndex: 'stauts',
                align: "center",
                render: (text, record) => {
                    if (this.props.statusRole) {
                        let flag = false;
                        if (record.stauts === 1) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                        return <Switch defaultChecked={flag} onChange={() => {
                            this.changeGradeStatus(record);
                        }}/>;
                    } else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
        if (this.props.editRole || this.props.deleteRole) {
            columns.push({
                title: '操作',
                key: 'operation',
                align: "center",
                render: (text, record) => {
                    return <div>
                        <Tooltip title="编辑作物等级">
                            <span className='cursor' onClick={this.querySmallClass.bind(this, record)}><i
                                className='iconfont icon-xiugai07'></i></span></Tooltip>
                        {
                        <Tooltip title="删除">
                            <span className='cursor' onClick={this.showDeleteConfirm.bind(this, record)}><i
                                className='iconfont icon-shanchu'></i></span>
                        </Tooltip>}
                    </div>;
                }
            });
        }
        const data = this.state.data1[record.id];
        return (
            <div>
            <LocaleProvider locale={zhCN}>
            <Table rowKey={record => record.id} className='smalltable'
                   columns={columns}
                   dataSource={data}
                   pagination={false}
            /></LocaleProvider>
            </div>
        );
    }

    async onExpand(expanded, record) {
        if (expanded) {
            const data = this.state.data1;
            await IOModel.ListInGroupAll({parentId: record.id}).then((res) => {
                data[record.id] = res.data;
                if (res.success) {
                    this.setState({
                        data1: data
                    });
                    this.props.changeData2(data);
                }
            }).catch();
        }
    }

    querySmallClass(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            name: {
                value: record.name
            },
            code: {
                value: record.code
            },
            sort: {
                value: record.sort
            },
            parentId: {
                value: record.parentId
            },
            createName: {
                value: record.createName
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modalTwo({modalFlag: true, modeltype: 'modify'});
    }
    render() {
        const {cur,total, Alldate} = this.props;
        // const {gradeQueryRole} = this.props;
        let arr;
        this.props.editRole || this.props.deleteRole || this.props.addRole ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        const PaginationOpt={
            total:total,
            current:cur,
            showSizeChanger:true,
            showQuickJumper:true
        };
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                {
                    <Table  expandedRowRender={this.expandedRowRender.bind(this)} onExpand={this.onExpand.bind(this)}
                           rowKey={record => record.id} columns={arr} dataSource={Alldate} onChange={this.onTableChange.bind(this)}
                           pagination={PaginationOpt}/>
                }</LocaleProvider>
                </div>
        );
    }
}

const mapstateprops = (state) => {
    const {EditData, Data2, Alldate, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.dictionaryReducer;
    return {
        Data2: Data2,
        EditData: EditData,
        Alldate: Alldate,
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