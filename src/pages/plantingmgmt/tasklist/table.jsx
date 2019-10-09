import {Table, Pagination, Tooltip, LocaleProvider, Divider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            align: "center",
            key: 'key',
            width:100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '农事计划编号',
            dataIndex: 'planCode',
            align: "center",
            width: 150,
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
            title: '计划时间',
            dataIndex: 'plannedTime',
            align: "center",
            render: (text) => {
                return <Tooltip title={text}><span style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}>{moment(text).format('YYYY-MM-DD')}</span></Tooltip>;
            }
        }, {
            title: '作物品种',
            dataIndex: 'cropName',
            align: "left",
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
            title: '农事任务',
            dataIndex: 'taskName',
            align: "left",
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
            title: '生长周期',
            dataIndex: 'periodName',
            align: "left",
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
            title: '种植地块',
            dataIndex: 'landName',
            align: "left",
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
            title: '类型',
            dataIndex: 'workTypeName',
            align: "left",
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
            title: '负责人',
            dataIndex: 'supervisor',
            align: "left",
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
            title: '状态',
            dataIndex: 'workStatusName',
            align: "center",
            render: (text) => {
                return <Tooltip title={text}><span className={text==='超时'? 'task-status-update':''} style={{
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
                    return <div style={{width: '100%',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'}}>
                        {this.props.getRole &&
                        <a onClick={this.queryDetails.bind(this, record)}>详情</a>}
                        {(this.props.status === 2 || this.props.status === 3) &&
                        this.props.editRole && <span
                            onClick={this.queryDetailsEdit.bind(this, record)}><Divider type="vertical" /><a>上报</a></span>}
                    </div>;
                }
            });
        }
    }

    async queryDetails(record) {
        await this.props.getOne({'taskId': record.id, 'workTypeId': record.workTypeId});
        const data = this.props.detailData;
        this.props.defaultFields({
            id: {
                value: data.id
            },
            planNo: {
                value: data.planNo
            },
            cropName: {
                value: data.cropName
            },
            baseId: {
                value: data.baseId
            },
            baseName: {
                value: data.baseName
            },
            landName: {
                value: data.landName
            },
            landId: {
                value: data.landId
            },
            name: {
                value: data.name
            },
            planTime: {
                value: data.planTime
            },
            planQty: {
                value: data.planQty
            },
            unit: {
                value: data.unit
            },
            dosageUnit: {
                value: data.dosageUnit
            },
            actualQty: {
                value: data.actualQty
            },
            materialName: {
                value: data.materialName
            },
            recoveryQty: {
                value: data.recoveryQty
            },
            workTypeCode: {
                value: data.workTypeCode
            },
            modeltype: {
                value: 'detail'
            },
            taskStatus: {
                value: this.props.status
            }
        });
        this.props.modalDetails({modalFlagDetails: true, modeltype: 'detail'});
    }

    async queryDetailsEdit(record) {
        await this.props.getOne({'taskId': record.id, 'workTypeId': record.workTypeId, 'userId': 1});
        const data = this.props.detailData;
        this.props.defaultFields({
            id: {
                value: data.id
            },
            planNo: {
                value: data.planNo
            },
            cropId: {
                value: data.cropId
            },
            cropName: {
                value: data.cropName
            },
            baseId: {
                value: data.baseId
            },
            planId: {
                value: data.planId
            },
            baseName: {
                value: data.baseName
            },
            landName: {
                value: data.landName
            },
            landId: {
                value: data.landId
            },
            name: {
                value: data.name
            },
            planTime: {
                value: data.planTime
            },
            planQty: {
                value: data.planQty
            },
            unit: {
                value: data.unit
            },
            dosageUnit: {
                value: data.dosageUnit
            },
            actualQty: data.actualQty,
            materialName: {
                value: data.materialName
            },
            recoveryQty: data.recoveryQty,
            workTypeCode: {
                value: data.workTypeCode
            },
            employeeId: {
                value: data.employeeId
            },
            supervisor: {
                value: data.supervisor
            },
            modeltype: {
                value: 'modify'
            },
            taskStatus: {
                value: this.props.status
            },
            search: this.props.search
        });
        this.props.modalDetails({modalFlagDetails: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        //this.props.Alldatas({startPage:current,limit:pageSize});
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
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
                <Table columns={this.columns} rowKey={record => record.id} dataSource={data} pagination={false}/>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR, detailData} = state.agriculturalTaskReducer;
    return {
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR,
        detailData
    };
};
export default connect(mapstateprops, action)(Tables);