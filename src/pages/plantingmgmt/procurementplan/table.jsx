import {Table, Pagination, LocaleProvider, Divider} from 'antd';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import moment from "moment";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less';

// import {browserHistory} from 'react-router';
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
            width: 100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '采购计划编号',
            dataIndex: 'code',
            align: "center"
        }, {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            align: "center",
            render(gmtCreate) {
                return moment(gmtCreate).format('YYYY-MM-DD');
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align: "left"
        }, {
            title: '完成日期',
            dataIndex: 'finishDate',
            render(finishDate) {
                return finishDate ? moment(finishDate).format('YYYY-MM-DD') : '---';
            }
        }, {
            title: '状态',
            dataIndex: 'statusName',
            align: "center"
        }];
        if (this.props.editRole || this.props.getRole) {
            this.columns.push({
                title: '操作',
                dataIndex: 'caozuo',
                align: "center",
                render: (text, record) => {
                    return (
                        <div className='plan-detail'>
                            {this.props.getRole && <NavLink
                                to={`/pages/plantingmgmt/procurementplan/detail/detail/${record.id}`}>
                                详情</NavLink>}
                            {this.props.editRole && <span>
                                {(record.statusName === '进行中') && this.props.user === record.createUserId ?
                                    <span>
                                    <Divider type="vertical" />
                                    <NavLink
                                        to={`/pages/plantingmgmt/procurementplan/detail/modify/${record.id}`}>编辑</NavLink></span>:
                                    <span>
                                    {/*<Divider type="vertical" />
                                    <NavLink
                                        to={`/pages/plantingmgmt/procurementplan/detail/modify/${record.id}`}
                                        onClick={this.handleClick.bind(this)}><span>不可编辑</span></NavLink>*/}</span>}
                            </span>}
                        </div>
                    );
                }
            });
        }
    }

    handleClick(e) {
        e.preventDefault();
    }

    query(record) {
        this.props.defaultFields({
            id: {
                value: record.id
            },
            plan_number: {
                value: record.plan_number
            },
            plan_time: {
                value: record.plan_time
            },
            createName: {
                value: record.createName
            },
            stauts: {
                value: record.stauts
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        //this.props.Alldatas({startPage: current, limit: pageSize});
        const { onSizeChangequery } = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current:current, pageSize:pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current:current, pageSize:pageSize});
    }
    onShowSizeChange(current, pageSize) {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
        this.props.page({current:1, pageSize:pageSize});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.page({current:current, pageSize:pageSize});
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    render() {
        const {total, data, Cur} = this.props;
        return (
            <div className='res-table'>
                <Table rowKey={record => record.id} columns={this.columns} dataSource={data} pagination={false}/>
                <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChangequery.bind(this)} current={Cur} defaultCurrent={1}  total={total} /></LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {statusDic, totalPro, user, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.procurementplanReducer;
    return {
        statusDic: statusDic,
        user: user,
        total: totalPro,
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