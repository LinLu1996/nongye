import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('detailAGr', {
    listByPagedata: {
        mockUrl: '/proxy/materialStandardGroup/listByPage',
        url: '/materialStandardGroup/listByPage'
    },
    Adddata: {
        mockUrl: '/proxy/materialStandardGroup/add',
        url: '/materialStandardGroup/add',
        method: 'POST'
    },
    allDosageUnit: {
        mockUrl: '/proxy/astCrop/getAllDosageUnit',
        url: '/astCrop/getAllDosageUnit',
        method: 'GET'
    },
    statusData: {
        mockUrl: '/proxy/materialStandardGroup/setStatusById',
        url: '/materialStandardGroup/setStatusById'
    },
    deleteData: {
        mockUrl: '/proxy/materialStandardGroup/delete/:id',
        url:'/materialStandardGroup/delete/:id',
        rest: true
    },
    astGrop: {
        mockUrl:'/proxy/astCrop/listAll',
        url:'/astCrop/listAll'
    },
    GetAllWorkType: {
        mockUrl: '/proxy/workOperation/getAllWorkType',
        url: '/workOperation/getAllWorkType',
        method: 'GET',
        rest: true
      },
    GetOne: {
        mockUrl: '/proxy/astMaterials/getById',
        url: '/astMaterials/getById',
        method: 'GET'
    },
    Modifydata: {
        mockUrl: '/proxy/materialStandardGroup/update',
        url: '/materialStandardGroup/update',
        method: 'POST'
    },
    CheckName: {
        mockUrl: '/proxy/astMaterials/checkNameUnique',
        url: '/astMaterials/checkNameUnique',
        method: 'POST'
    },
    TreeData: {
        mockUrl: '',
        rest: true
    }
});
//封装页面reducer、action
const detailModel = {
    reducer: (defaultState = {
        EditData: {},
        Alldate: [],
        total: null,
        parentname: null,
        PID: null,
        Psize: 10,
        Cur: 1,
        fields: {},
        TreeD: [],
        addflag: false,
        modalflag: false,
        modaltype: '',
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10,
        slideparentID: -1,
        slideName: '农资'
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'AGRDETAIL_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
            case 'AGRDETAIL_QUERY_ALL': {
                const queryAlls = action.data;
                const querytotal = action.querytotal;
                return Object.assign({}, defaultState, {
                    Alldate: queryAlls,
                    total: querytotal
                });
            }
            case 'AGRDETAIL_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    EditData: queryAlls
                });
            }
            case 'AGRDETAIL_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
//        case 'AGR_CHOOSE_ALL': {
//          const chooseAlls = action.chooseall;
//          const choosetotal = action.choosetotal;
//          return Object.assign({}, defaultState, {
//            Alldate:chooseAlls,
//            total:choosetotal
//          });
//        }
            case 'AGRDETAIL_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'AGRDETAIL_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'AGRDETAIL_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
            case 'AGRDETAIL_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'AGRDETAIL_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'AGRDETAIL_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'AGRDETAIL_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'AGRDETAIL_CHOOSEPAGE':
                return Object.assign({}, defaultState, {
                    chooseCUR: action.chooseCUR,
                    chooseSIZE: action.chooseSIZE
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            superiorName: (parent) => {  //点击左边树的数据
                dispatch({
                    type: "AGRDETAIL_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                IO.detailAGr.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.total;
                    dispatch({
                        type: "AGRDETAIL_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            queryAll: (req) => {  //筛选的列表数据
                req.companyId = 1;
                req.userId = 1;
                req.desc = 0;
                req.field = "name";
                IO.detailAGr.listByPagedata(req).then((res) => {
                    const querytotal = res.data.total;
                    const data = res.data.rows;
                    dispatch({
                        type: "AGRDETAIL_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //筛选的列表数据
                req.userId = 1;
                const res = await IO.detailAGr.GetOne(req);
                const data = res.data;
                dispatch({
                    type: "AGRDETAIL_GET_ONE",
                    data
                });
            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "AGRDETAIL_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "AGRDETAIL_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "AGRDETAIL_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "AGRDETAIL_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {AGIdetailReducer: detailModel.reducer};
const action = detailModel.action;
const IOModel = {
    TreeMOdel: IO.detailAGr.TreeData,
    Delete: IO.detailAGr.deleteData,
    Adddata: IO.detailAGr.Adddata,
    Modifydata: IO.detailAGr.Modifydata,
    GetWorkType:IO.detailAGr.GetAllWorkType,
    CheckName: IO.detailAGr.CheckName,
    allDosageUnit:IO.detailAGr.allDosageUnit,
    statusData:IO.detailAGr.statusData,
    astGrop:IO.detailAGr.astGrop
};
const MaterialIOModel = {
    GetOne: IO.detailAGr.GetOne
};
export {
    action,
    IO,
    IOModel,
    MaterialIOModel
};
