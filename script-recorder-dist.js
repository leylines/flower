"use strict";function draw(){var t=canvas.node().getContext("2d");t.save(),t.clearRect(0,0,width,height);for(var i=0;i<points.length;++i){var e=points[i];t.fillStyle=e.color,t.fillRect(e.x,e.y,pointWidth,pointWidth)}t.restore()}function animate(t){points.forEach(function(t){t.sx=t.x,t.sy=t.y}),t(points),points.forEach(function(t){t.tx=t.x,t.ty=t.y}),timer=d3.timer(function(t){var i=Math.min(1,ease(t/duration));points.forEach(function(t){t.x=t.sx*(1-i)+t.tx*i,t.y=t.sy*(1-i)+t.ty*i}),draw();var e=d3.select("canvas");capturer.capture(e.node()),1===i&&(timer.stop(),currLayout=(currLayout+1)%layouts.length,animate(layouts[currLayout]))})}for(var width=600,height=600,numPoints=64e3,pointWidth=2,pointMargin=2,duration=8e3,ease=d3.easeCubic,timer=void 0,currLayout=0,points=createPoints(numPoints,pointWidth,width,height),flower_f=[76,68,58,66,84,94,86,78,60,50,40,48,56,74,92,102,112,104,96,70,52,42,32,22,30,38,46,64,82,100,110,120,130,122,114,106,88,80,62,44,34,24,14,4,12,20,28,36,54,72,90,108,118,128,138,148,140,132,124,116,98],radius=height/10-.4*pointWidth,gridXOffset=Math.sqrt(Math.pow(radius,2)-Math.pow(radius/2,2)),gridYOffset=radius/2,matrix=[],k=1;k<18;k++)for(var j=1;j<10;j++){var x=j*gridXOffset,y=k*gridYOffset;matrix.push([x,y])}var flower_1=flower_f.slice(0,1),flower_2=flower_f.slice(0,7),flower_3=flower_f.slice(0,19),flower_4=flower_f.slice(0,37),toFlower_f=function(t){return flowerLayout(t,pointWidth+pointMargin,width,height,matrix,flower_f,radius)},toFlower_1=function(t){return flowerLayout(t,pointWidth+pointMargin,width,height,matrix,flower_1,radius)},toFlower_2=function(t){return flowerLayout(t,pointWidth+pointMargin,width,height,matrix,flower_2,radius)},toFlower_3=function(t){return flowerLayout(t,pointWidth+pointMargin,width,height,matrix,flower_3,radius)},toFlower_4=function(t){return flowerLayout(t,pointWidth+pointMargin,width,height,matrix,flower_4,radius)},tree_radius=height/30,tree_circles=[76,60,56,92,96,112,4,24,20,148],toTree=function(t){return treeLayout(t,pointWidth+pointMargin,width,height,matrix,tree_circles,tree_radius)},meta_circles=[76,76,60,44,56,36,92,108,96,116,112,148,40,4],toMeta=function(t){return metaLayout(t,pointWidth+pointMargin,width,height,matrix,meta_circles,radius)},toPhyllotaxis=function(t){return phyllotaxisLayout(t,pointWidth+pointMargin,width/2,height/2)},layouts=[toTree,toPhyllotaxis,toFlower_f,toPhyllotaxis,toMeta],screenScale=window.devicePixelRatio||1,canvas=d3.select("body").append("canvas").attr("width",width*screenScale).attr("height",height*screenScale).style("width",width+"px").style("height",height+"px").on("click",function(){d3.select(".play-control").style("display",""),timer.stop(),capturer.save(),capturer.stop()});canvas.node().getContext("2d").scale(screenScale,screenScale),toPhyllotaxis(points);var capturer=new CCapture({autoSaveTime:1,format:"webm",framerate:20,name:"metatron",display:!0,verbose:!0});draw(),d3.select("body").append("div").attr("class","play-control").text("PLAY").on("click",function(){capturer.start(),animate(layouts[currLayout]),d3.select(this).style("display","none")});