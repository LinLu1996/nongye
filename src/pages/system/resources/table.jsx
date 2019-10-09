import {Table, message, Switch, Tooltip, LocaleProvider, Divider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import {IO} from '@/app/io';
import Com from '@/component/common';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            statusloading: false,
            psize: 10,
            recordid: -1
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width: 100,
            align: 'center',
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
            title: '资源名称',
            dataIndex: 'resName',
            sorter: true,
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '资源编码',
            dataIndex: 'resourceCode',
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '地址路径',
            dataIndex: 'resUrl',
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '资源类型',
            dataIndex: 'resType',
            align: 'left'
        }, {
            title: '关键字',
            dataIndex: 'keyword',
            align: 'left',
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{text}</span></Tooltip>;
            }
        }, {
            title: '排序',
            dataIndex: 'sortNum',
            sorter: true,
            align: 'left'
        },
            {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                sorter: true,
                render: (text) => {
                    const time = moment(text).format('YYYY-MM-DD');
                    return <Tooltip title={time}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{time}</span></Tooltip>;
                }
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left'
            }, {
                title: '状态',
                dataIndex: 'stauts',
                render: (text, record) => {
                    let f;
                    text === 0 ? f = true : f = false;
                    if(Com.hasRole(this.props.securityKeyWord, 'resource_update', 'update', 'resource')) {
                        return <Switch defaultChecked={f}
                                       loading={record.id === this.state.recordid ? this.state.statusloading : false}
                                       onChange={this.onChange.bind(this, text, record)} className='switch-status'/>;
                    }else {
                        return f ? '正常' : '禁用';
                    }
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) => {
                    return <div>
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'resource_update', 'update', 'resource')) &&
                                <a onClick={this.query.bind(this, record)}>编辑</a>
                        }
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'resource_delete', 'delete', 'resource')) &&
                                <span>
                                    <Divider type="vertical"/>
                                    <a onClick={this.showDeleteConfirm.bind(this, record)}>删除</a>
                                </span>
                        }
                    </div>;
                }
            }];
    }

    onChange(text, record, checked) {
        let str;
        checked ? str = 0 : str = 1;
        this.setState({
            statusloading: true,
            recordid: record.id
        });
        IO.resources.setStatus({resId: record.id, status: str}).then((res) => {
            if (res.success) {
                if (this.props.Treeflag) {
                    this.props.Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        resName: this.props.Nameval,
                        startPage: this.props.current,
                        limit: this.state.psize
                    });
                } else {
                    this.props.chooseAll({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        resName: this.props.Nameval,
                        id: this.props.slideID,
                        startPage: this.props.current,
                        limit: this.state.psize
                    });
                }
                this.setState({
                    statusloading: false
                });
                if (str === 1) {
                    message.success('禁用成功');
                } else {
                    message.success('启用成功');
                }
            }
        }).catch((res) => {
            this.setState({
                statusloading: false
            });
            Com.errorCatch(res);
        });
    }

    showDeleteConfirm(record,e) {
        this.props.showDeleteConfirm(record,e);
    }
    query(record,e) {
        this.props.query(record,e);
    }
    onTableChange(pagination, filters, sorter) {
        this.setState({
            psize:pagination.pageSize
        });
        this.props.onTableChange(pagination, filters, sorter);
    }
    render() {
        const {total, data, flag, current, securityKeyWord} = this.props;
        let arr;
        Com.hasRole(securityKeyWord, 'resource_update', 'update', 'resource') || Com.hasRole(securityKeyWord, 'resource_delete', 'delete', 'resource') ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        const PaginationOpt={
            total:total,
            current:current,
            showSizeChanger:true,
            showQuickJumper:true
        };
        return (
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table
                        pagination={PaginationOpt}
                        onChange={this.onTableChange.bind(this)}
                        columns={arr}   dataSource={data} loading={flag}/>
                </LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, parentname, sortfield, sortorder, TreeD, slideID, flag} = state.resourcesReducer_;
    const {securityKeyWord} = state.initReducer;
    return {
        total: total,
        TreeD,
        parentName: parentname,
        slideID,
        flag,
        list: state.systemReducer.listdata,
        securityKeyWord,
        sortfield, sortorder
    };
};
export default connect(mapstateprops, action)(Tables);