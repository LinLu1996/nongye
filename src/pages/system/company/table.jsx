import {Table, Modal, Tooltip, message, Upload, Divider} from 'antd';
import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IO} from './model';
import Com from '@/component/common';
import moment from 'moment';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            psize: 10,
            cont: '',
            detailsVisible: true,
            record: null,
            selectedRowKeys: [],
            statusloading: false,
            recordid: -1,
            previewImage: '',
            previewVisible: false,
            modalflag: false
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: 'center',
                key: 'key',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },{
                title: '上级公司',
                dataIndex: 'parentName',
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
            },{
                title: '公司名称',
                dataIndex: 'companyName',
                sorter: true,
                align: 'left'
            }, {
                title: '公司编码',
                dataIndex: 'companyCode',
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
                title: '公司类型',
                dataIndex: 'companyType',
                align: 'left',
                width: 90
            }, {
                title: '基地数量',
                dataIndex: 'baseCount',
                align: 'right',
                width: 90,
                render: (text,record) => {
                    return <div className="hand-point"><Tooltip title='基地详情'>
                        <a onClick={this.openTable.bind(this,record,'base')}>{text}</a>
                    </Tooltip></div>;
                }
            }, {
                title: '地块数量',
                dataIndex: 'landCount',
                align: 'right',
                width: 90,
                render: (text, record) => {
                    return <div className="hand-point"><Tooltip title='地块详情'>
                        <a onClick={this.openTable.bind(this,record,'land')}>{text}</a>
                    </Tooltip></div>;
                }
            }, {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                sorter: true,
                render: (text) => {
                    return moment(text).format('YYYY-MM-DD');
                }
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: 'left',
                width: 100
            }, {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                width: 250,
                render: (text, record) => {
                    return <div>
                        <a onClick={this.details.bind(this, record)}>详情</a>
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'company_update', 'update','company')) &&
                                <span>
                                    <Divider type="vertical"/>
                                <a onClick={this.query.bind(this, record)}>编辑</a>
                                </span>}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'company_delete', 'delete','company')) ?
                                <span>
                                    {(record.companyNameEn !== 'system2register' && record.companyNameEn !== 'system2virtual') ?
                                    <span>
                                        <Divider type="vertical" />
                                        <a onClick={this.showDeleteConfirm.bind(this, record)}>删除</a>
                                    </span> :
                                    <span>
                                        <Divider type="vertical" />
                                        不可删除
                                    </span>
                                  }
                                </span> : ''}
                        {
                            (Com.hasRole(this.props.securityKeyWord, 'companyResource_updateByCompanyId', 'update', 'company')) ?
                                <span>
                                    <Divider type="vertical" />
                                    <a onClick={this.props.empdepshow.bind(this, record)}>分配资源</a>
                                </span>
                                : ''}
                    </div>;
                }
            }];
    }

    openTable(record,type) {
        if (type === 'base') {
            if (record.baseCount <= 0) {
                message.warning('没有可查看的基地');
                return false;
            }
        } else {
            if (record.landCount <= 0) {
                message.warning('没有可查看的地块');
                return false;
            }
        }
        const {tableCur, tableSize} = this.props;
        this.props.tableSearch({type: type, id: record.id, startPage: tableCur, limit: tableSize});
        this.props.tableModal({tableCur: 1, tableSize: 10, tableFlag: true, tableType: type, tableId: record.id});
    }

    async handlePicturePreview(file) {
        await this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    handlePictureCancel() {
        this.setState({previewVisible: false });
    }

    query(record,e) {
        this.props.query(record,e);
    }

    showDeleteConfirm(record,e) {
        this.props.showDeleteConfirm(record,e);
    }

    handleCancel() {
        //this.detailsCont(false, this.state.record);
        this.setState({
            modalflag: false
        });
    }

    handleOk() {
        //this.detailsCont(false, this.state.record);
        this.setState({
            modalflag: false
        });
    }

    async details(record) {
        const fileList = [];
        await IO.company.getPhoneList({id: record.id}).then((res) => {
            if (res.success) {
                const data = res.data || [];
                data.map((item, index) => {
                    item.uid = index;
                    item.status = 'done';
                    fileList.push(item);
                });
            }
        });
        this.setState({
            record: record,
            modalflag: true,
            fileList: fileList
        });
    }
    onTableChange(pagination, filters, sorter) {
        this.setState({
            psize:pagination.pageSize
        });
        this.props.onTableChange(pagination, filters, sorter);
    }

    render() {
        const {record, fileList, previewVisible, previewImage, modalflag} = this.state;
        const {total, data, flag, current,securityKeyWord} = this.props;
        const propsUpload = {
            name: 'file',
            accept: 'image/jpg,image/jpeg,image/png,image/bmp',
            action: '/company/file',
            fileList: fileList,
            listType: "picture-card",
            headers: {
                authorization: 'authorization-text'
            }
        };
        let arr;
        Com.hasRole(securityKeyWord, 'company_update', 'update','company') || Com.hasRole(securityKeyWord, 'company_delete', 'delete','company') || Com.hasRole(securityKeyWord, 'companyResource_updateByCompanyId', 'update', 'company') ? arr = this.columns : arr = this.columns.slice(0, this.columns.length - 1);
        const PaginOpt = {
            total:total,
            current:current,
            showSizeChanger:true,
            showQuickJumper:true
        };
        return (
                <div className='res-table'>
                    <Table columns={arr} onChange={this.onTableChange.bind(this)}
                           dataSource={data} pagination={PaginOpt} loading={flag}/>
                    { modalflag && <Modal
                        title="公司详情"
                        visible={modalflag}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                        wrapClassName='farming-admin-modal company-modal'
                    >
                        <ul>
                            <li><b>上级公司：</b><span>{record.parentName}</span></li>
                            <li><b>公司名称：</b><span>{record.companyName}</span></li>
                            <li><b>公司类型：</b><span>{record.companyType}</span></li>
                            <li><b>所属节点：</b><span>{record.nodeName}</span></li>
                            <br/>
                            <li><b>营业执照：</b></li>
                        </ul>
                        {fileList && fileList.length > 0 && <div className="show-picture">
                            <Upload {...propsUpload} onPreview={this.handlePicturePreview.bind(this)}>
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handlePictureCancel.bind(this)}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>}
                    </Modal>}
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {total, deleteOK, flag, sortfield, sortorder, slideID, tableCur, tableSize} = state.companyReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        total,
        deleteok: deleteOK,
        flag, slideID,
        list: state.systemReducer.listdata,
        securityKeyWord,
        sortfield, sortorder, tableCur, tableSize
    };
};
export default connect(mapstateprops, action)(Tables);