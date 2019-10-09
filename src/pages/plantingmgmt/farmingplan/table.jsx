import {Table, Pagination, Tooltip,LocaleProvider,Divider} from 'antd';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import {action} from './model';
import {Component} from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            align: "center",
            width: 100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '农事计划编号',
            dataIndex: 'code',
            align: "center",
            key: 'code',
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
            title: '所用方案',
            dataIndex: 'solutionName',
            align: "left",
            key: 'solutionName',
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
            title: '种植基地',
            dataIndex: 'baseName',
            align: "left",
            key: 'baseName',
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
            title: '作物品种',
            dataIndex: 'cropName',
            align: "left",
            key: 'cropName',
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
            title: '创建时间',
            dataIndex: 'gmtCreate',
            align: "center",
            key: 'gmtCreate',
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
        },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left",
                key: 'createUserName',
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            },
            {
                title: '计划开始日期',
                dataIndex: 'startTime',
                align: "center",
                key: 'startTime',
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            },
            {
                title: '定植日期',
                dataIndex: 'plantingDate',
                align: "center",
                key: 'plantingDate',
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            },
            {
                title: '状态',
                dataIndex: 'workplanStatusName',
                align: "center",
                key: 'workplanStatusName',
                render: (text) => {
                    return <Tooltip title={text}><span style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>{text}</span></Tooltip>;
                }
            }];
        if (this.props.editRole || this.props.getRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return <div style={{
                        width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>
                            {this.props.getRole &&
                                <NavLink to={`/pages/plantingmgmt/farmingplan/detail/${record.id}/detail`}>详情</NavLink>}
                            {this.props.editRole &&
                                <span>
                            <Divider type="vertical" />
                                <NavLink to={`/pages/plantingmgmt/farmingplan/detail/${record.id}/modify`}>编辑</NavLink>
                                </span>}
                        </div>;
                }
            });
        }
    }
    async query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            type: {
                value: 'modify'
            }
        });
        this.props.history.push('/pages/plantingmgmt/farmingplan/detail');
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

    render() {
        const {total, data, Cur} = this.props;
        let dataFormat = data;
        if (data && data.length > 0) {
            dataFormat = data.map((item) => {
                const creatgmt = item.gmtCreate ? moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : '';
                const startTimeFormat = item.startTime ? moment(item.startTime).format('YYYY-MM-DD') : '';
                const plantingDateFormat = item.plantingDate ? moment(item.plantingDate).format('YYYY-MM-DD') : '';
                return Object.assign({}, item, {
                    gmtCreate: creatgmt,
                    startTime: startTimeFormat,
                    plantingDate: plantingDateFormat
                });
            });
        }
        return (
                <div className='res-table'>
                    <LocaleProvider locale={zhCN}>
                        <Table rowKey={record => record.id} columns={this.columns} dataSource={dataFormat} pagination={false}/>
                    </LocaleProvider>
                    <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
                </div>
        );
    }
}

const mapstateprops = (state) => {
    const {EditData, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.farmingplanReducer;
    return {
        EditData: EditData,
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