import {Component} from 'react';
import {Button, message, Modal} from 'antd';
import {connect} from 'react-redux';
import {action} from './addmodel';
import './../index.less';
import './add.less';
import {OperationIOModel} from "@/pages/masterdata/operations/model";
import {ProgramIOModel} from "@/pages/masterdata/soultion/model";

class SecondStep extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.state = {
      name: '',
      taskList: []
    };
    this.tabX = false;
    this.getTip = this.getTip.bind(this);
    window.setStep = function (index) {
      if (_this.props.setStep) {
        _this.props.setStep(0);
      }
      if (_this.props.setIndex) {
        _this.props.setIndex(index);
      }
    };
  }

  getTip(params) {
    const {taskList} = this.state;
    const param = {};
    taskList.forEach((item, index) => {
      if (item.firstDay === params.data[0] + 1) {
        param.index = index;
        //param.periodName = item.periodName;
        item.periodList.forEach((i) => {
          if (i.liveId === item.periodId) {
            param.periodName = i.liveName;
          }
        });
        if (item.delayType === 'week') {
          param.periodDelay = `第${item.delay}周`;
        } else {
          param.periodDelay = `第${item.delay}天`;
        }
        if (item.purpose) {
          param.purpose = item.purpose;
        } else {
          param.purpose = '无';
        }
        if (item.materialId === -1) {
          param.materialName = '无';
          param.plannedQty = '无';
        } else {
          item.materialList.forEach((i) => {
            if (i.id === item.materialId) {
              param.materialName = i.name;
            }
          });
          if (item.unitName) {
            param.plannedQty = `${item.plannedQty}${item.unitName}/亩`;
          } else {
            param.plannedQty = `${item.plannedQty}`;
          }
        }
      }
    });
    const res = '<div class=\'tip-layout\'>' +
      '<div class="tip-layout-title">任务详情</div>' +
      `<div class="top-line"><label>生长周期</label><span>${param.periodName}</span></div>` +
      `<div class="top-line"><label>执行时间</label><span>${param.periodDelay}</span></div>` +
      `<div class="top-line"><label>用途</label><span>${param.purpose}</span></div>` +
      `<div class="top-line"><label>推荐农资</label><span>${param.materialName}</span></div>` +
      `<div class="top-line"><label>农资用量</label><span>${param.plannedQty}</span></div>` +
      `<div class="top-more" onclick="window.setStep(${param.index})" ><a  class="link" >点击编辑 ></a></div>` +
      `</div>`;
    return res;
  }

  async componentDidMount() {
    // 数据整合
    const {cycleList, type, taskList} = this.props;
    // 左侧数据整合
    const workList = [];
    await OperationIOModel.GetWorkType().then((res) => {
      const list = res.data;
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          workList.push(list[i].name);
        }
      }
    }).catch();
    // 上面数据整合
    const periodsList = [];
    let allDay = 0;
    let firstDay = 1;
    let totalDay = 0;
    if (cycleList.length > 0) {
      for (let i = 0; i < cycleList.length; i++) {
        const count = {};
        if (type === 'week') {
          allDay += cycleList[i].duration * 7;
          totalDay = cycleList[i].duration * 7;
        } else {
          allDay += cycleList[i].duration;
          totalDay = cycleList[i].duration;
        }
        if (i > 0) {
          if (type === 'week') {
            firstDay += cycleList[i - 1].duration * 7;
          } else {
            firstDay += cycleList[i - 1].duration;
          }
        }
        count.id = cycleList[i].liveId;
        count.firstDay = firstDay;
        count.name = cycleList[i].liveName;
        count.totalDay = totalDay;
        periodsList.push(count);
      }
    }
    // 下面数据整合
    const dayList = [];
    for (let i = 1; i <= allDay; i++) {
      dayList.push(i);
    }
    // 中间数据整合
    const wList = []; //灌溉
    const pList = []; //植保
    const fList = []; //施肥
    const gList = []; //园艺
    const hList = []; //采收
    if (taskList && taskList.length > 0) {
      for (let i = 0; i < taskList.length; i++) {
        let firstDay = 1;
        for (let k = 0; k < periodsList.length; k++) {
          if (taskList[i].periodId === periodsList[k].id) {
            firstDay = periodsList[k].firstDay;
          }
        }
        if (taskList[i].delayType === 'week') {
          firstDay += (taskList[i].delay - 1) * 7;
        } else {
          firstDay += taskList[i].delay - 1;
        }
        taskList[i].firstDay = firstDay;
        if (taskList[i].code === 'watering') {
          const data = [firstDay - 1, '灌溉', firstDay - 1];
          wList.push(data);
        } else if (taskList[i].code === 'protection') {
          const data = [firstDay - 1, '植保', firstDay - 1];
          pList.push(data);
        } else if (taskList[i].code === 'fertilizer') {
          const data = [firstDay - 1, '施肥', firstDay - 1];
          fList.push(data);
        } else if (taskList[i].code === 'gardening') {
          const data = [firstDay - 1, '园艺', firstDay - 1];
          gList.push(data);
        } else if (taskList[i].code === 'harvest') {
          const data = [firstDay - 1, '采收', firstDay - 1];
          hList.push(data);
        }
      }
    }
    // 颜色整合
    const colorList = [];
    for (let i = 0; i < periodsList.length; i++) {
      if (i % 2 === 0) {
        for (let k = 0; k < periodsList[i].totalDay; k++) {
          colorList.push('rgba(0,255,0,.1)');
        }
      } else {
        for (let k = 0; k < periodsList[i].totalDay; k++) {
          colorList.push('transparent');
        }
      }
    }
    this.setState({
      taskList: taskList
    });
    const _this = this;
    /* global echarts:true */
    const myChart = echarts.init(document.getElementById('main'));
    const maxValueSpan = 77;
    let dataZoomEnd = (maxValueSpan / dayList.length) * 100;
    dataZoomEnd = dataZoomEnd > 100 ? 100 : Math.floor(dataZoomEnd);
    const Option = {
      title: '',
      tooltip: {
        triggerOn: 'click',
        position: 'right',
        formatter: this.getTip,
        backgroundColor: '#fff',
        textStyle: {
          color: "#333"
        }
      },
      xAxis: [{
        //坐标轴在 grid 区域中的分隔线。
        axisLabel: {
          interval: 0,
          align: "right",
          formatter: function (value) {
            const number = Number(value);
            if (_this.tabX) {
              return `第${number}天`;
            } else {
              if (number % 7 === 1) {
                return `第${ Math.ceil(number / 7)}周`;
              } else {
                return '';
              }
            }
          }
        },
        data: dayList
      }, {
        position: 'top',
        axisLine: {show: false},//上线
        axisTick: {show: false},//刻度
        boundaryGap: true,
        axisLabel: {
          interval: 0,
          textStyle: {
            fontSize: 14
          },
          align: "right",
          formatter: function (value) {
            //let title='';
            const number = Number(value);
            //计算方式为第一周期天数，然后除以2，显示中间一个
            for (let i = 0; i < periodsList.length; i++) {
              if (periodsList[i].firstDay === number) {
                return periodsList[i].name;
              }
            }
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: colorList
          }
        },
        data: dayList
      }
      ],
      yAxis: {
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {
          show: true
        },
        data: workList
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          maxValueSpan: maxValueSpan,
          start: 0,
          end: dataZoomEnd
        }, {
          type: 'inside',
          show: true,
          xAxisIndex: [0, 1],
          start: 0,
          end: dataZoomEnd,
          zoomOnMouseWheel: false
        }, {
          type: 'slider',
          show: true,
          xAxisIndex: [0, 1],
          start: 0,
          end: dataZoomEnd
        }],
      series: [{
        name: "采收",
        symbol: 'image:////img.alicdn.com/tfs/TB1dfaEwQvoK1RjSZFwXXciCFXa-200-200.png',
        type: 'scatter',
        symbolSize: 30,
        //['日期周'，'Y周'，'育苗周']
        //data: [[15,'采收',15],[16,"采收",16],[17,'采收',17]]
        data: hList
      }, {
        name: "园艺",
        symbol: 'image:////img.alicdn.com/tfs/TB1u1iqwPDpK1RjSZFrXXa78VXa-200-200.png',
        type: 'scatter',
        symbolSize: 30,
        data: gList
      }, {
        name: "植保",
        symbol: 'image:////img.alicdn.com/tfs/TB1WO5uwHPpK1RjSZFFXXa5PpXa-200-200.png',
        type: 'scatter',
        symbolSize: 30,
        data: pList
      }, {
        name: "施肥",
        symbol: 'image:////img.alicdn.com/tfs/TB1WimVwNnaK1RjSZFBXXcW7VXa-200-200.png',
        type: 'scatter',
        symbolSize: 30,
        data: fList
      }, {
        name: "灌溉",
        symbol: 'image:////img.alicdn.com/tfs/TB1c.yywNTpK1RjSZFKXXa2wXXa-200-200.png',
        type: 'scatter',
        symbolSize: 30,
        data: wList
      }
      ]
    };
    myChart.setOption(Option);
    myChart.on('datazoom', function () {
      //params里面有什么，可以打印出来看一下就明白
      const startValue = myChart.getModel().option.dataZoom[0].startValue;
      const endValue = myChart.getModel().option.dataZoom[0].endValue;
      const offset = endValue - startValue + 1;
      if (offset > 7) {
        _this.tabX = false;
      } else {
        _this.tabX = true;
      }
    });
  }

  setPreStep() {
    if (this.props.setStep) {
      this.props.setStep(0);
    }
  }

  //   保存
  doSave() {
    const {taskList, cycleList, type, record, name, deleteList} = this.props;
    // 种植方案名称
    if (this.props.setType === 'add') {
      if (cycleList && cycleList.length > 0) {
        let duration = 0;
        if (type === 'week') {
          duration = 1;
        }
        for (let i = 0; i < cycleList.length; i++) {
          cycleList[i].type = duration;
          cycleList[i].cropPeriodId = cycleList[i].id;
          cycleList[i].periodId = cycleList[i].liveId;
        }
      }
      if (taskList && taskList.length > 0) {
        for (let i = 0; i < taskList.length; i++) {
          let duration = 0;
          if (taskList[i].delayType === 'week') {
            duration = 1;
          }
          taskList[i].type = duration;
          taskList[i].dosage = taskList[i].plannedQty;
          taskList[i].periodList = [];
          taskList[i].operationList = [];
          taskList[i].materialList = [];
        }
      }
      const addData = {
        name: name,
        cropNo: record.no,
        cropId: record.id,
        companyId: 1,
        cropName: record.name,
        workSolutionCropPeriodList: JSON.stringify(cycleList),
        workSolutionMaterialsOperationList: JSON.stringify(taskList)
      };
      ProgramIOModel.Adddata(addData).then((res) => {
        if (res.success && res.data > 0) {
          message.success('添加成功');
          this.props.jumpToList();
        } else {
          Modal.error({
            title: '提示',
            content: res.message
          });
        }
      }).catch((res) => {
        Modal.error({
          title: '提示',
          content: res.message
        });
      });
    } else {
      if (cycleList && cycleList.length > 0) {
        let duration = 0;
        if (type === 'week') {
          duration = 1;
        }
        for (let i = 0; i < cycleList.length; i++) {
          cycleList[i].type = duration;
          cycleList[i].periodId = cycleList[i].liveId;//周期id
        }
      }
      if (deleteList && deleteList.length > 0) {
        for (let i = 0; i < deleteList.length; i++) {
          taskList.push(deleteList[i]);
        }
      }
      if (taskList && taskList.length > 0) {
        for (let i = 0; i < taskList.length; i++) {
          let duration = 0;
          if (taskList[i].delayType === 'week') {
            duration = 1;
          }
          taskList[i].type = duration;
          taskList[i].dosage = taskList[i].plannedQty;
          taskList[i].materials = [];
          taskList[i].operations = [];
          taskList[i].periodList = [];
          taskList[i].operationList = [];
          taskList[i].materialList = [];
        }
      }
      const updateData = {
        id: record.id,
        name: name,
        workSolutionCropPeriodList: JSON.stringify(cycleList),
        workSolutionMaterialsOperationList: JSON.stringify(taskList)
      };
      ProgramIOModel.Modifydata(updateData).then((res) => {
        if (res.success && res.data > 0) {
          message.success('修改成功');
          this.props.jumpToList();
        } else {
          Modal.error({
            title: '提示',
            content: res.message
          });
        }
      }).catch((res) => {
        Modal.error({
          title: '提示',
          content: res.message
        });
      });
    }
  }

  render() {
    return (
      <div className='step-layout'>
        <div className='form-layout'>
          <div className='icon-list'>
            <div className='icon-item'><i className='iconfont  icon-jiaoshui'></i><span>灌溉</span></div>
            <div className='icon-item'><i className='iconfont  icon-yumiao'></i><span>植保</span></div>
            <div className='icon-item'><i className='iconfont  icon-shifei'></i><span>施肥</span></div>
            <div className='icon-item'><i className='iconfont  icon-yuanyi'></i><span>园艺</span></div>
            <div className='icon-item'><i className='iconfont  icon-caichu'></i><span>采收</span></div>
          </div>
          <div id="main" style={{height: 450}}></div>
        </div>
        <div className='step-foot'>
          <Button type="primary" className='form-btn-def' onClick={this.setPreStep.bind(this)}>上一步</Button>
          {(this.props.setType === 'modify' || this.props.setType === 'add') &&
          <Button type="primary" onClick={this.doSave.bind(this)}>保存</Button>}
        </div>
      </div>
    );
  }
}

const mapStateprops = (state) => {
  const {taskList, cycleList, type, record, name, deleteList} = state.programAddReducer;
  return {
    record: record,
    deleteList: deleteList,
    name: name,
    cycleList: cycleList,  //周期列表
    type: type,  //周期时长
    taskList: taskList  //任务列表
  };
};
export default connect(mapStateprops, action)(SecondStep);
