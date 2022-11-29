//hello,world
console.log("hello,world")

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjQ1YWY2YS00ZWU2LTQ5MTgtYmVkZS0zM2VjYjNmMDk3ZDEiLCJpZCI6OTgxMTUsImlhdCI6MTY2NTk5OTQwMH0.GPbObWnR7kRBpCElLRRplb3Cxkfc1UtAOsh74ApFOCg'

//定义3D地图(纯享版)
const options3D = {
  fullscreenButton: true, //!!!!!!!!!显示全屏按键
  sceneModePicker: false, //!!!!!!!!!显示投影方式控件  三维/二维
  baseLayerPicker:false,  //!!!!!!!!!显示图层选择控件
  geocoder:false, //!!!!!!!!!显示地名查找控件
  homeButton:false, //!!!!!!!!!是否显示home键
  navigationHelpButton:false, //!!!!!!!!!帮助信息控件
  animation:false,  //!!!!!!!!!是否显示动画控件
  timeline:false,  //!!!!!!!!!显示时间线控件
  infoBox: false,
  depthTestAgainstTerrain: true,

};

//定义2D地图(纯享版)
const options2D = {
  fullscreenButton: false, //!!!!!!!!!显示全屏按键
  sceneModePicker: false, //!!!!!!!!!显示投影方式控件  三维/二维
  baseLayerPicker:false,  //!!!!!!!!!显示图层选择控件
  geocoder:false, //!!!!!!!!!显示地名查找控件
  homeButton:false, //!!!!!!!!!是否显示home键
  navigationHelpButton:false, //!!!!!!!!!帮助信息控件
  animation:false,  //!!!!!!!!!是否显示动画控件
  timeline:false,  //!!!!!!!!!显示时间线控件
  infoBox: false,

}

const view2D = new Cesium.Viewer("view2D", options2D);  //初始化
const view3D = new Cesium.Viewer("view3D", options3D);  //初始化

//原版左下去除
view3D._cesiumWidget._creditContainer.style.display="none";
view2D._cesiumWidget._creditContainer.style.display="none";

view3D.terrainProvider = Cesium.createWorldTerrain({
  requestWaterMask : true, 
  requestVertexNormals : true
});
view3D.scene.globe.depthTestAgainstTerrain = true;
globalBuildingModel = view3D.scene.primitives.add(
  new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(96188),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  })
);
// globalBuildingModel2 = view3D.scene.primitives.add(
//   new Cesium.Cesium3DTileset({
//     url: Cesium.IonResource.fromAssetId(1150332),
//     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//   })
// );
var buildingStyle = new Cesium.Cesium3DTileStyle({
  color : "color('rgb(255,255,255)')",
  show : true
});
globalBuildingModel.style=buildingStyle;
// globalBuildingModel2.style=buildingStyle;

//以下功能借鉴于此https://sandcastle.cesium.com/?src=Multiple%20Synced%20Views.html
let worldPosition;
let distance;

function sync2DView() {
  const viewCenter = new Cesium.Cartesian2(
    Math.floor(view3D.canvas.clientWidth / 2),
    Math.floor(view3D.canvas.clientHeight / 2)
  );
  const newWorldPosition = view3D.scene.camera.pickEllipsoid(
    viewCenter
  );
  if (Cesium.defined(newWorldPosition)) {
    worldPosition = newWorldPosition;
  }
  distance = Cesium.Cartesian3.distance(
    worldPosition,
    view3D.scene.camera.positionWC
  );
  view2D.scene.camera.lookAt(
    worldPosition,
    new Cesium.Cartesian3(0,0,distance*5)
  );
}
view2D.scene.screenSpaceCameraController.enableRotate = false;
view2D.scene.screenSpaceCameraController.enableTranslate = false;
view2D.scene.screenSpaceCameraController.enableZoom = false;
view2D.scene.screenSpaceCameraController.enableTilt = false;
view2D.scene.screenSpaceCameraController.enableLook = false;

view3D.camera.changed.addEventListener(sync2DView);
view3D.camera.percentageChanged = 0.01;



//以上功能借鉴于此https://sandcastle.cesium.com/?src=Multiple%20Synced%20Views.html

//跳转到中心点
view3D.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(118.0795, 24.4265, 510),
          orientation: {
						// 指向
						heading: Cesium.Math.toRadians(35, -5),
						// 视角
						pitch: Cesium.Math.toRadians(-10),
						roll: 0.0
					}
});

// view3D.camera.setView({
//   destination: Cesium.Cartesian3.fromDegrees(118.0795, 24.4265, 510),
//           orientation: {
// 						// 指向
// 						heading: Cesium.Math.toRadians(35, -5),
// 						// 视角
// 						pitch: Cesium.Math.toRadians(-10),
// 						roll: 0.0
// 					}
// });



//设置标识判断是否变化
var g2f = 0;

//鹰眼功能
function get2Dview(){
  var box=document.getElementById('view2D');
  var yytext = document.getElementById('yy');
  if(g2f == 0){
    box.style.left= "0px";
    yytext.innerText = "🌏关闭";
    g2f = 1;
  }
  else{
    box.style.left= "-300px";
    yytext.innerText = "🌏鹰眼";
    g2f = 0;
  }
}

//生成指定范围内随机数函数
function rerandom(max,min){
  var xranx = Math.random() * (max - min + 1) + min;
  return xranx
}



//提示框内文字
var theadtext=document.getElementById('thead')
var jdtext=document.getElementById('jd')
var wdtext=document.getElementById('wd')

//下方提示框
var tipsbox=document.getElementById('tips')


//tips到处走走
function tipsgo(long,lat){
  theadtext.innerText="这里是"
  jdtext.className="tp"
  jdtext.innerText="经度："+long
  wdtext.innerText="纬度："+lat
  tipsbox.style.display='block'
  setTimeout("tipsbox.style.display='none'",2000)
}



//tips其他
function tips(tipstext){
  theadtext.innerHTML=""
  wdtext.innerText=""
  jdtext.className="tp tc"
  jdtext.innerText=tipstext
  tipsbox.style.display='block'
  setTimeout("tipsbox.style.display='none'",2000)
}



//内置云模型api
const clouds = new Cesium.CloudCollection();
function bscloud(long,lat){
  clouds.add({
    position: Cesium.Cartesian3.fromDegrees(long,lat, 1600),
    scale: new Cesium.Cartesian2(10000, 1500),
    maximumSize: new Cesium.Cartesian3(100, 50, 13),
    slice: Math.random(),
  });
}

// function bs(){
//   window.alert("只允许10朵云")
//   for(let i= 0;i < 3; i++){
//     bscount();
//     i+=1;
//   }
// }

//判断函数实现功能标识
var bsflag=0;

//点击添加云
function bs(){
  var bstext = document.getElementById('bs');
  if(bsflag==0){
    tips('点击地图添加云，请拉高视野食用')
    bstext.innerText = "🌞暴晒";
    //var canvas=view3D.scene.canvas;  //获取当前视图窗口
    var ellipsoid=view3D.scene.globe.ellipsoid;  //椭球体与窗口交点
    //var handler = new Cesium.ScreenSpaceEventHandler(canvas);  //设置事件产生主体
    view3D.screenSpaceEventHandler.setInputAction(function(maaa){  //类型click
    var firstposition = view3D.scene.camera.pickEllipsoid(maaa.position,ellipsoid);  //获取的是笛卡尔坐标系
    var secondposition = ellipsoid.cartesianToCartographic(firstposition);  //转为地图坐标(弧度)
    //将弧度转为度
    var long=Cesium.Math.toDegrees(secondposition.longitude).toFixed(4);  //经度
    var lat=Cesium.Math.toDegrees(secondposition.latitude).toFixed(4);  //纬度
    var alti_String=(view3D.camera.positionCartographic.height/1000).toFixed(2);  //高度
    console.log(lat,long,alti_String);
    bscloud(long,lat);
    this._primitives = view3D.scene.primitives.add(clouds);
    //view3D.scene.primitives.add(clouds);
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    bsflag=1;
  }
  else{
    bstext.innerText="⛅避暑";
    function rmcloud(){
      this._primitives.removeAll();
    }
    rmcloud();
    //this._primitives.removeAll();
    // view3D.scene.primitives.add(clouds);
    view3D.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // clouds.destroy();
    bsflag=0;
  }
}



//我想出去走一走，看看这个大世界
function flyE(rlong,rlat){
  // var fetext = document.getElementById('fe');
  var rlong = rerandom(180,-180).toFixed(6)
  var rlat = rerandom(90,-90).toFixed(6)
  // if(flflag == 0){
    view3D.camera.flyTo({
      destination: new Cesium.Cartesian3.fromDegrees(rlong,rlat,20500),
    });
    tipsgo(rlong,rlat)
  // flflag = 1;
  // }
  // else{
  //   fetext.innerText = "🚀我想去看看";
  //   view3D.camera.flyTo({
  //     destination: new Cesium.Cartesian3.fromDegrees(118.1373,24.4967,20500),
  //   });
  //   flflag = 0;
  // }
}



//常回家看看，回家看看
function flyH(){
  view3D.camera.flyTo({
    destination: new Cesium.Cartesian3.fromDegrees(118.1373,24.4967,20500),
  });
  tips('欢迎回家')
}


const url = "./image/bol.glb";
//添加实体模型函数
function createBolModel(url,x, y, height) {
    const position =Cesium.Cartesian3.fromDegrees(x, y, height);
    var countb = view3D.entities.add({
    name: url,
    position: position,
    model: {
      uri: url,
      scale: rerandom(4000,2000),

    },
  });
  return countb;
}

//判断选择功能
var fsflag=0;

//建立全局变量保存entities实体
var ec = []

//fly功能实现
function fs(){
  var rqqtext = document.getElementById('rqq');
  if(fsflag==0){
    rqqtext.innerText="🌪run"
    tips('点击地图添加热气球，请拉高视野食用')
    var ellipsoid=view3D.scene.globe.ellipsoid;  //椭球体与窗口交点
    //var handler = new Cesium.ScreenSpaceEventHandler(canvas);  //设置事件产生主体
    view3D.screenSpaceEventHandler.setInputAction(function(maaa){  //类型click
    var firstposition = view3D.scene.camera.pickEllipsoid(maaa.position,ellipsoid);  //获取的是笛卡尔坐标系
    var secondposition = ellipsoid.cartesianToCartographic(firstposition);  //转为地图坐标(弧度)
    //将弧度转为度
    var long=Cesium.Math.toDegrees(secondposition.longitude).toFixed(4);  //经度
    var lat=Cesium.Math.toDegrees(secondposition.latitude).toFixed(4);  //纬度
    ec.push(createBolModel(url,long,lat,1100))
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    fsflag=1
  }
  else{
    rqqtext.innerText="🎈fly"
    view3D.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    //循环遍历将原先保存在数组中的实体一个一个删除
    for(let i = 0;i<ec.length;i++){
      view3D.entities.remove(ec[i])
    }
    fsflag=0
  }
}



//添加fish图元
function createFishModel(long,lat,height){
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(long,lat, height))
  var Fishc = view3D.scene.primitives.add(
  Cesium.Model.fromGltf({
    url : './image/Fish.glb',
    // scale: rerandom(40,20),
    modelMatrix : modelMatrix,
    minimumPixelSize: 128,
    maximumScale: rerandom(1500,1000), 
  })
  )
  return Fishc
}

//判断函数实现功能标识
var fishflag=0;

//存储图元的列表
var fishc = []

//养鱼功能实现
function fish(){
  var fishtext = document.getElementById('fish');
  if(fishflag==0){
    tips('点击放鱼，最好选择有水的地方')
    fishtext.innerText="🎣捕捞"
    var ellipsoid=view3D.scene.globe.ellipsoid;  //椭球体与窗口交点
    //var handler = new Cesium.ScreenSpaceEventHandler(canvas);  //设置事件产生主体
    view3D.screenSpaceEventHandler.setInputAction(function(maaa){  //类型click
    var firstposition = view3D.scene.camera.pickEllipsoid(maaa.position,ellipsoid);  //获取的是笛卡尔坐标系
    var secondposition = ellipsoid.cartesianToCartographic(firstposition);  //转为地图坐标(弧度)
    //将弧度转为度
    var long=Cesium.Math.toDegrees(secondposition.longitude).toFixed(4);  //经度
    var lat=Cesium.Math.toDegrees(secondposition.latitude).toFixed(4);  //纬度
    fishc.push(createFishModel(long,lat,-1))
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    fishflag = 1
  }
  else{
    fishtext.innerText="🐠养鱼"
    view3D.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    //循环遍历将原先保存在数组中的实体一个一个删除
    for (let i =0; i < fishc.length; i ++){
      view3D.scene.primitives.remove(fishc[i])
    }
    fishflag=0
  }
}



//取消点击功能
function cc(){
  view3D.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
}



//标记
var awobflag= 1
var awoflag = 1
var axmflag= 0
var awobtext=document.getElementById('awob')
var awotext=document.getElementById('awo')
var axmtext = document.getElementById('axm')

//添加模型功能
function addWorldOsmB(){
  if(awobflag == 0){
    awobtext.innerText="✈一马平川"
    awotext.innerText="🗺移除地形"
    if(axmflag == 1 || awoflag == 1){
      globalBuildingModel = view3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(96188),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        })
      );
      globalBuildingModel2 = view3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(1150332),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        })
      );
      var buildingStyle = new Cesium.Cesium3DTileStyle({
        color : "color('white')",
        show : true
      });
      globalBuildingModel.style=buildingStyle;
      globalBuildingModel2.style=buildingStyle;
    }
    else{
      view3D.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask : true, 
        requestVertexNormals : true
      });
      view3D.scene.globe.depthTestAgainstTerrain = true;
      globalBuildingModel = view3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(96188),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        })
      );
      globalBuildingModel2 = view3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(1150332),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        })
      );
      var buildingStyle = new Cesium.Cesium3DTileStyle({
        color : "color('rgb(255,255,255)')",
        show : true
      });
      globalBuildingModel.style=buildingStyle;
      globalBuildingModel2.style=buildingStyle;
    }
    awobflag=1
    awoflag=1
  }
  else{
    awotext.innerText="⛰添加地形"
    awobtext.innerText="🏠添加全球已有高程模型"
    if(axmflag==1){
      view3D.scene.primitives.remove(globalBuildingModel)  //移除模型
    }
    else{
    view3D.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({}); //移除地形
    view3D.scene.primitives.remove(globalBuildingModel)  //移除模型
    }
    awobflag=0
    awoflag=0
  }
}



//添加地形
function addWorldOsm(){
  if(awoflag == 0){
    awotext.innerText="🗺移除地形"
    //添加地形
    view3D.terrainProvider = Cesium.createWorldTerrain({
      requestWaterMask : true, // 添加水视效
      requestVertexNormals : true 
    });
    view3D.scene.globe.depthTestAgainstTerrain = true;
    awoflag=1
  }
  else{
    awotext.innerText="⛰添加地形"
    awobtext.innerText="🏠添加全球已有模型模型"
    axmtext.innerText="🏡添加厦门建筑模型"
    if(axmflag==1){
      view3D.scene.primitives.remove(xmb)
    }
    if(awobflag==1){
      view3D.scene.primitives.remove(globalBuildingModel)  //移除模型
    }
    view3D.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({}); //移除地形
    awoflag=0
    awobflag=0
    axmflag=0
  }
}



//添加厦门模型
function addXM(){
  if(axmflag==0){
    axmtext.innerText="🛌移除模型"
    awotext.innerText="🗺移除地形"
    tips('添加中，请耐心等待，拉近距离食用')
    var tileset = new Cesium.Cesium3DTileset({ 
      url: "../../../libs/mods/mod19/xiamen_3Dtitiles/tileset.json",
      maximumNumberOfLoadedTiles: 10,
    })
    var transparentStyle = new Cesium.Cesium3DTileStyle({
      color: "color('#fff',0.7)",
      show: true,
    });
    tileset.style = transparentStyle;
    tileset.readyPromise.then(function(tileset) {
          //调整高度
          var translation = Cesium.Cartesian3.fromArray([0, 0, 50])
          var m = Cesium.Matrix4.fromTranslation(translation) //fromTranslation()方法
          tileset.modelMatrix = m
          })
    if(awobflag == 1 || awoflag==1){
      xmb = view3D.scene.primitives.add(tileset)
    }
    else{
      xmb = view3D.scene.primitives.add(tileset)
      view3D.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask : true, // required for water effects
        requestVertexNormals : true // required for terrain lighting
      });
      view3D.scene.globe.depthTestAgainstTerrain = true;
    }
    axmflag =1
    awoflag=1
  }
  else{
    axmtext.innerText="🏡添加厦门建筑模型"
    if(awobflag==1){
      view3D.scene.primitives.remove(xmb)
    }
    else{
    awotext.innerText="⛰添加地形"
    view3D.scene.primitives.remove(xmb)
    view3D.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({}); //移除地形
    }
    axmflag=0
    awoflag=0
  }
}


//清除所有模型的功能
function rmAllModel(){
  //view3D.scene.primitives.removeAll();
  if(bsflag==1){
    bs();
  }
  if(fsflag==1){
    fs()
  }
  if(awobflag==1){
    addWorldOsm()
  }
  if(fishflag == 1){
    fish()
  }
  if(awobflag==1){
    addWorldOsmB()
  }
}