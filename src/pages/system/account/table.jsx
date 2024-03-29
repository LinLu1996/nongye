import {Table, message, Modal, Switch, Radio, Input, LocaleProvider, Divider} from 'antd';
import moment from 'moment';
import {Component} from 'react';
import {connect} from 'react-redux';
import {action} from './model';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const confirm = Modal.confirm;
import {IO} from '@/app/io';
import Com from '@/component/common';
const RadioGroup = Radio.Group;

class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingp: false,
            recordid: '',
            visible: false,
            passwordid: '',
            Radiovalue: 1,
            password_: '',
            psize:10
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
        }, {
            title: '员工名',
            dataIndex: 'empRealName',
            align: 'left'
        }, {
            title: '账号名称',
            dataIndex: 'accountName',
            sorter: true,
            align: 'left'
        }, {
            title: '所属公司',
            dataIndex: 'companyName',
            align: 'left'
        }, {
            title: '账号类型',
            dataIndex: 'accountType',
            align: 'left',
            render: (text) => {
                if("platform" === text) {
                    return "平台账户";
                }
                if("company" === text) {
                    return "农企账户";
                }
                if("government" === text) {
                    return "政府账户";
                }
                if("marketing" === text) {
                    return "营销账户";
                }
                return text;
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
            align: 'left'
        }, {
            title: '能否登录',
            sorter: true,
            dataIndex: 'stauts',
            render: (text, record) => {
                const securityKeyWord = this.props.securityKeyWord;
                if (Com.hasRole(securityKeyWord, 'account_update', 'update', 'account')) {
                    return <Switch defaultChecked={record.swich}
                                   loading={record.id === this.state.recordid ? this.state.loading : false}
                                   onChange={this.onChange.bind(this, record)}/>;
                } else {
                    return record.stauts === 1 ? '禁用' : '正常';
                }

            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text, record) => {
                // 权限
                const securityKeyWord = this.props.securityKeyWord;
                return <div>
                    {
                        Com.hasRole(securityKeyWord, 'account_delete', 'delete', 'account') &&
                      <a onClick={this.showDeleteConfirm.bind(this, record)}>
                          删除
                      </a>
                    }
                    {
                        Com.hasRole(securityKeyWord, 'account_resetPasswordByAccountId', 'update', 'account') &&
                          <span>
                              <Divider type="vertical"/>
                              <a onClick={this.jshowDeleteConfirm.bind(this, record)}>重置密码</a>
                          </span>
                    }
                </div>;
            }
        }];
    }

    showDeleteConfirm(record) {
        const _this = this;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.confirm(record);
            }
        });
    }

    jshowDeleteConfirm(record) {
        this.setState({visible: !this.state.visible, passwordid: record.id, password_: ''});
    }

    async passshow() {
        document.getElementsByClassName('jbl-account-password').value = '';
        await this.setState({
            visible: !this.state.visible,
            passwordid: '',
            password_: '',
            loadingp: false,
            Radiovalue: 1
        });
    }

    async jconfirm() {
        this.setState({loadingp: true});
        if (this.state.Radiovalue === 1) {
            await IO.account.chongzhimima({accountId: this.state.passwordid}).then((res) => {
                if (res.success) {
                    this.passshow();
                    message.success('重置密码成功');
                }
            }).catch((res) => {
                Com.errorCatch(res);
                this.setState({loadingp: false});
            });
        } else {
            if (this.state.password_.trim() !== '') {
                await IO.account.chongzhimima({password: this.state.password_, accountId: this.state.passwordid}).then((res) => {
                    if (res.success) {
                        this.passshow();
                        message.success('修改密码成功');
                    }
                }).catch((res) => {
                    Com.errorCatch(res);
                    this.setState({loadingp: false});
                });
            } else {
                message.error('请输入自定义密码');
                this.setState({loadingp: false});
            }
        }
    }

    RadioonChange(e) {
        this.setState({Radiovalue: e.target.value});
    }

    confirm(record) {
        const {Alldatas, current} = this.props;
        const deleteID = record.id;
        IO.account.accountDelete({':id': deleteID}).then((res) => {
            if (res.success) {
                message.success('删除成功');
                if (this.props.data.length === 1) {
                    this.props.setcurrent(current - 1);
                    Alldatas({
                        startPage: current - 1,
                        limit: this.state.psize,
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder
                    });
                } else {
                    Alldatas({
                        startPage: current,
                        limit: this.state.psize,
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder
                    });
                }
            }
        }).catch((res) => {
            Com.errorCatch(res);
        });
    }

    onChange(record, checked) {
        this.setState({recordid: record.id, loading: true});
        if (checked) {
            IO.account.modify({accountId: record.id, status: 0}).then(() => {
                this.setState({loading: false});
                this.props.Alldatas({
                    accountName: this.props.valueName,
                    empRealName:this.props.employee,
                    accountType:this.props.accountType,
                    companyId:this.props.company,
                    startPage: this.props.current,
                    limit: this.state.psize,
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder
                });
            }).catch((res) => {
                Com.errorCatch(res);
                this.setState({loading: false});
            });
        } else {
            IO.account.modify({accountId: record.id, status: 1}).then(() => {
                this.setState({loading: false});
                this.props.Alldatas({
                    accountName: this.props.valueName,
                    empRealName:this.props.employee,
                    accountType:this.props.accountType,
                    companyId:this.props.company,
                    startPage: this.props.current,
                    limit: this.state.psize,
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder
                });
            }).catch((res) => {
                Com.errorCatch(res);
                this.setState({loading: false});
            });
        }
    }

    inputonchange(e) {
        this.setState({password_: e.target.value});
    }
    onTableChange(pagination, filters, sorter) {
        this.props.page({current: pagination.current, pageSize: pagination.pageSize});
        this.props.onTableChange(pagination, filters, sorter);
    }

    render() {
        const {total, data, flag, current} = this.props;
        const databox = data.map((item) => {
            const creatgmt = moment(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
            const querygmt = moment(item.gmtModified).format('YYYY-MM-DD HH:mm:ss');
            const zcgmt = moment(item.gmtReg).format('YYYY-MM-DD');
            const gzgmt = moment(item.gmtApproval).format('YYYY-MM-DD');
            return Object.assign({}, item, {
                gmtCreate: creatgmt,
                gmtModified: querygmt,
                gmtReg: zcgmt,
                key: item.id,
                gmtApproval: gzgmt
            });
        });
        let column;
        const securityKeyWord = this.props.securityKeyWord;
        {
            // 权限
            Com.hasRole(securityKeyWord, 'account_resetPasswordByAccountId', 'update', 'account') || Com.hasRole(securityKeyWord, 'account_delete', 'delete', 'account') ? column = this.columns : column = this.columns.slice(0, this.columns.length - 1);
        }
        const PaginOpt = {
            total:total,
            current:current,
            showSizeChanger:true,
            showQuickJumper:true
        };
        return (
            <div className='res-table'>
                <Modal
                    title="重置密码"
                    className='farming-admin-modal'
                    visible={this.state.visible}
                    confirmLoading={this.state.loadingp}
                    onOk={this.jconfirm.bind(this)}
                    onCancel={this.passshow.bind(this)}
                    okText="确认"
                    cancelText="取消"
                >
                    <RadioGroup onChange={this.RadioonChange.bind(this)} value={this.state.Radiovalue}>
                        <Radio value={1}>默认密码</Radio>
                        <Radio value={2}>自定义密码</Radio>
                    </RadioGroup>
                    {
                        this.state.Radiovalue === 2 ?
                            <Input className='jbl-account-password' style={{width: 200, marginLeft: 130}}
                                    onChange={this.inputonchange.bind(this)} placeholder="请输入密码"/> :
                            <i className='jbl-account-password jbl-account-color'>默认密码为：账号名@手机号后4位</i>
                    }
                </Modal>
                <LocaleProvider locale={zhCN}>
                    <Table onChange={this.onTableChange.bind(this)} columns={column}
                            dataSource={databox} pagination={PaginOpt} loading={flag}/>
                </LocaleProvider>
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {sortfield, sortorder} = state.accountReducer;
    const {Cur, total, deleteOK, flag} = state.accountReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        total,
        cur: Cur,
        deleteok: deleteOK,
        flag,
        list: state.systemReducer.listdata,
        securityKeyWord,
        sortfield, sortorder
    };
};
export default connect(mapstateprops, action)(Tables);