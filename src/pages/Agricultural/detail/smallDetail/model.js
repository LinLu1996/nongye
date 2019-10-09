import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('smalldetail', {
  listByPagedata: {
   mockUrl: '/proxy/materialStandard/listByPage',
   url: '/materialStandard/listByPage'
  },
  parentlist: {
      mockUrl:'/proxy/materialStandardGroup/getById/:id',
      url:'/materialStandardGroup/getById/:id',
      rest: true
  },
  Adddata: {
    mockUrl: '/proxy/materialStandard/add',
    url: '/materialStandard/add',
    method: 'POST'
  },
  GetAllWorkType: {
    mockUrl: '/proxy/workOperation/getAllWorkType',
    url: '/workOperation/getAllWorkType',
    method: 'GET',
    rest: true
  },
  statusData: {
    mockUrl: '/proxy/materialStandard/setStatusById',
    url: '/materialStandard/setStatusById'
},
  GetastMaterials: {
    mockUrl: '/proxy/workSolution/getWorkOperationAndAstMaterialByWorkTypeId',
    url: '/workSolution/getWorkOperationAndAstMaterialByWorkTypeId',
    method: 'GET'
  },
  GetworkPeriod: {
    mockUrl: '/proxy/astCrop/getById/:id',
    url: '/astCrop/getById/:id',
    method: 'GET',
    rest: true
  },
  GetDosageUnit: {
    mockUrl: '/proxy/astCrop/getAllDosageUnit',
    url: '/astCrop/astCrop/getAllDosageUnit'
  },
  GetmateriaType: {
    mockUrl: '/proxy/dictionary/getChildsByCode',
    url: '/dictionary/getChildsByCode'
  },
  Modifydata: {
    mockUrl: '/proxy/materialStandard/update',
    url: '/materialStandard/update',
    method: 'POST'
  },
  delete: {
    url: '/materialStandard/delete/:id',
    mockUrl: '/proxy/materialStandard/delete/:id',
    rest: true
  }
});
//封装页面reducer、action
const smallDetailModel = {
  reducer: (defaultState = {
    Alldate:[],
    total:null,
    fields:{},
    addflag:false,
    modalflag:false,
    modaltype:''
  }, action) => {
    const fields = action.data;
    switch (action.type) {
      case 'WORKTYPE_ALL_DATA': {
        const Alldate = action.data;
        const total = action.total;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          chooseflag:false
        });
      }
        case 'WORKTYPE_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'WORKTYPE_DEFAULTFIELD':
        return Object.assign({}, defaultState, {fields: fields});
    }
    return defaultState;
  },
  action: (dispatch) => {
      return {
          //    查询
          Alldatas: ( page ) => {  //进入页面的列表数据
              IO.smalldetail.listByPagedata(page).then((res) => {
                  const data=res.data.rows||[];
                  const total=res.data.total;
                  dispatch({
                      type: "WORKTYPE_ALL_DATA",
                      data,
                      total
                  });
              }).catch();
          },
          // 创建
          defaultFields:(data) => {  //弹出框的数据
              dispatch({
                  type: "WORKTYPE_DEFAULTFIELD",
                  data
              });
          },
          modal:(obj) => {  //弹出框是否显示
              dispatch({
                  type: "WORKTYPE_MODAL",
                  modalflag:obj.modalFlag,
                  modaltype:obj.modeltype
              });
          }
      };
  }
};

reducers.assemble = {smalldetailReducer: smallDetailModel.reducer};
const action = smallDetailModel.action;
const IOModel = {
  Adddata:IO.smalldetail.Adddata,
  Modifydata:IO.smalldetail.Modifydata,
  delete:IO.smalldetail.delete,
  parentlist:IO.smalldetail.parentlist,
  GetWorkType:IO.smalldetail.GetAllWorkType,
  GetastMaterials:IO.smalldetail.GetastMaterials,
  GetworkPeriod:IO.smalldetail.GetworkPeriod,
  GetDosageUnit:IO.smalldetail.GetDosageUnit,
  GetmateriaType:IO.smalldetail.GetmateriaType,
  statusData:IO.smalldetail.statusData
};
export {
  action,
  IO,
  IOModel
};
