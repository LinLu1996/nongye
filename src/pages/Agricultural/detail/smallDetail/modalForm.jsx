import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Modal, Input, Form, message, Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            workTypeName: Form.createFormField({
                ...props.workTypeName,
                value: props.workTypeName.value
            }),
            materialName:Form.createFormField({
                ...props.materialName,
                value: props.materialName.value
            }),
            PeriodsName:Form.createFormField({
                ...props.PeriodsName,
                value: props.PeriodsName.value
            }),
            dosage:Form.createFormField({
                ...props.dosage,
                value: props.dosage.value
            })
            // dosageUnitName:Form.createFormField({
            //     ...props.dosageUnitName,
            //     value: props.dosageUnitName.value
            // })
            // materiaTypeName:Form.createFormField({
            //     ...props.materiaTypeName,
            //     value: props.materiaTypeName.value
            // })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    return (
        <Form layout="inline">
        <FormItem label="周期">
            {getFieldDecorator('PeriodsName', {
                    rules: [{required: true, message: '请选择周期'}]
                })(<Select style={{width: 300}}>
                    {props.CropPeriodsList.value.map((item) => {
                        return <Option key={item.liveId} value={item.liveId}>{item.liveName}</Option>;
                    })}
                </Select>)}
            </FormItem>
         <FormItem label="农事类型">
            {getFieldDecorator('workTypeName', {
                    rules: [{required: true, message: '请选择农事类型'}]
                })(<Select style={{width: 300}} onChange={(e) => {
                    props.suppliesName(e);}}>
                    {props.AllWorkType.value.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="物资名称">
            {getFieldDecorator('materialName', {
                    rules: [{required: true, message: '请选择农事类型'}]
                })(<Select style={{width: 300}}>
                    {props.suppliesNameList.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>;
                    })}
                </Select>)}
            </FormItem>
            <FormItem label="用量/亩">
                {getFieldDecorator('dosage', {
                    rules: [{required: true, message: '请输入用量'}]
                })(<Input/>)}
            </FormItem>
        </Form>
    );
});

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    getForm(value) {
        this.formValitate = value;
    }
    suppliesName(e) {
        this.props.suppliesName(e);
    }
    hideModal(e) {   //点击确定的回调
        const {PeriodsName,dosage,materialName} = this.props.fields;
        const {cur, psize,modaltype} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                  if (modaltype === 'add') {
                    const addData = {
                        groupId:this.props.groupId,
                        periodId:PeriodsName.value,
                        dosage: dosage.value,
                        materialId:materialName.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                          message.success('添加成功');
                          this.props.Alldatas({startPage: cur, limit: psize, groupId:this.props.groupId,materialName:this.props.materialName});
                          this.props.modal({modalFlag: false});
                      } else {
                        message.error('添加失败');
                      }
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    const modifydata = {
                      groupId:this.props.groupId,
                      id: this.props.fields.id.value,
                      periodId:PeriodsName.value,
                      dosage: dosage.value,
                      materialId:materialName.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: cur, limit: psize,materialName:this.props.materialName,groupId:this.props.groupId});
                          this.props.modal({modalFlag: false});
                      } else {
                        message.error('修改失败');
                      }
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
            }
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const me = this;
        const {modalflag, parentName, modaltype, fields} = this.props;
        let title = "编辑农资标准";
        if (modaltype === 'add') {
            title = "新增农资标准";
        }
        const CustomizedFormOpt = {
            onChange:me.handleFormChange.bind(me),
            parentName:parentName,
            getForm:me.getForm.bind(me),
            checkName:me.props.checkName,
            suppliesNameList:this.props.suppliesNameList,
            suppliesName:me.suppliesName.bind(me)
        };
        return (
            <div>
                <Modal
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    title={title}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields}  {...CustomizedFormOpt}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {fields, modaltype, modalflag} = state.smalldetailReducer;
    return {
        fields,
        modaltype,
        modalflag
    };
};
export default connect(mapstateProps, action)(modifyModal);
