import reducers from '@/app/reducers';import {context, IO} from '@/app/io';import moment from 'moment';//配置接口参数context.create('farmCostAnalysis', {    listByPagedata: {        mockUrl: "/proxy/workProcurementMaterials/materialsReport",        url: '/workProcurementMaterials/materialsReport',        method: 'POST'    },    queryCount: {        mockUrl: '/proxy/workProcurementMaterials/materialsForProportionReport',        url: '/workProcurementMaterials/materialsForProportionReport',        method: 'POST'    },    getBaseLand: {        mockUrl: "/proxy/astLand/getLandsByBaseId/:baseId",        url: '/astLand/getLandsByBaseId/:baseId',        method: 'GET',        rest:true    },    getLandsByBaseIdAndPlan: {        mockUrl: "/proxy/astLand/getLandsByBaseIdAndPlan/:baseId",        url: '/astLand/getLandsByBaseId/:baseId',        method: 'GET',        rest:true    }});//封装页面reducer、actionconst farmingModel = {    reducer: (defaultState = {        Alldate: [],        ProportionData: [],        total: null,        parentname: null,        PID: null,        baseList: [],        cropList: [],        landList: [],        Psize: 10,        Cur: 1,        fields: {},        addflag: false,        modalflag: false,        modaltype: '',        parentID: null,        slideID: -1,        modifyID: null,        chooseCUR: 1,        chooseSIZE: 10,        slideparentID: -1,        slideName: '基地'    }, action) => {        const fields = action.data;        switch (action.type) {            case 'FARM_COST_ALL_DATA': {                const Alldate = action.data;                const total = action.total;                return Object.assign({}, defaultState, {                    Alldate: Alldate,                    total: total,                    chooseflag: false                });            }            case 'FARM_COST_QUERY_ALL': {                const queryAlls = action.data;                return Object.assign({}, defaultState, {                    ProportionData: queryAlls                });            }            case 'FARM_COST_MENU_ALL':                return Object.assign({}, defaultState, {                    Alldate: action.arr,                    total: action.num                    //chooseflag:true                });            case 'FARM_COST_RES_PAGE':                return Object.assign({}, defaultState, {                    Cur: action.cur,                    Psize: action.psize                });            case 'FARM_COST_DEFAULTFIELD':                return Object.assign({}, defaultState, {fields: fields});            case 'FARM_COST_SLIDEID':                return Object.assign({}, defaultState, {                    slideID: action.num,                    slideName: action.slideName,                    slideparentID: action.slideparentID                });            case 'FARM_COST_PARENTID':                return Object.assign({}, defaultState, {                    parentID: action.parentid,                    modifyID: action.modifyid                });            case 'FARM_COST_CHOOSEPAGE':                return Object.assign({}, defaultState, {                    chooseCUR: action.chooseCUR,                    chooseSIZE: action.chooseSIZE                });            case 'FARM_COST_ALL_BASE': {                const dicAll = action.dataAll;                return Object.assign({}, defaultState, {                    baseList: dicAll                });            }            case 'FARM_COST_ALL_CROP': {                const dicAll = action.dataAll;                return Object.assign({}, defaultState, {                    cropList: dicAll                });            }            case 'FARM_COST_ALL_LAND': {                const dicAll = action.dataAll;                return Object.assign({}, defaultState, {                    landList: dicAll                });            }            case 'FARM_COST__QUERY_ALL': {                const queryAlls = action.data;                const querytotal = action.querytotal;                return Object.assign({}, defaultState, {                    Alldate: queryAlls,                    total: querytotal                });            }        }        return defaultState;    },    action: (dispatch) => {        return {            //    查询            Alldatas: (page) => {  //进入页面的列表数据                page.companyId = 1;                page.userId = 1;                page.desc = 0;                page.field = "name";                IO.farmCostAnalysis.listByPagedata(page).then((res) => {                    const data = res.data || [];                    for (let i = 0; i <data.report.length; i++) {                        data.report[i].plannedTime=moment(data.report[i].plannedTime).format("YYYY-MM-DD");                    }                    const total = res.data.total;                    dispatch({                        type: "FARM_COST_ALL_DATA",                        data: data,                        total:total                    });                }).catch();            },            QueryProportion: (req) => {  //占比统计                req.companyId = 1;                req.userId = 1;                req.desc = 0;                req.field = "name";                IO.farmCostAnalysis.queryCount(req).then((res) => {                    const data = res.data.percent || [];                    dispatch({                        type: "FARM_COST_QUERY_ALL",                        data: data                    });                }).catch();            },            page: (obj) => {  //分页页码                dispatch({                    type: "FARM_COST_RES_PAGE",                    cur: obj.current,                    psize: obj.pageSize                });            },            getCompanyBase: () => {                IO.earlyWarningList.getAllBase({companyId: 1}).then((res) => {                    const data = res.data || [];                    dispatch({                        type: "FARM_COST_ALL_BASE",                        dataAll: data                    });                });            },            getBaseLand: (value) => {                IO.farmCostAnalysis.getBaseLand({':baseId': value}).then((res) => {                    const data = res.data || [];                    dispatch({                        type: "FARM_COST_ALL_LAND",                        dataAll: data                    });                });            },            getCompanyCrop: () => {                IO.farmingPlan.GetAllCrop({companyId: 1}).then((res) => {                    const data = res.data || [];                    dispatch({                        type: "FARM_COST_ALL_CROP",                        dataAll: data                    });                });            },            choosepage: (obj) => {                dispatch({                    type: "FARM_COST_CHOOSEPAGE",                    chooseCUR: obj.current,                    chooseSIZE: obj.pageSize                });            }        };    }};reducers.assemble = {materialcostanalysisReducer: farmingModel.reducer};const action = farmingModel.action;const IOModel = {    listByPagedata: IO.farmCostAnalysis.listByPagedata,    queryCount: IO.farmCostAnalysis.queryCount,    QueryProportion: IO.farmCostAnalysis.queryCount};export {    action,    IO,    IOModel};