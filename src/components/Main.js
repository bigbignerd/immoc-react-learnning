require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//json文件中获取图片的配置信息
var imageDatas = require('../data/imageData.json');
//自执行函数遍历获取图片的真实地址
imageDatas = (function genImgUrl(imageDataArr){
	for(var i = 0,j=imageDataArr.length;i<j;i++){
		var signalImage = imageDataArr[i];
		signalImage.imageUrl = require('../images/'+signalImage.fileName);
		imageDataArr[i] = signalImage;
	}
	return imageDataArr;
})(imageDatas);

function getRangeRandom(low,high){
	return Math.ceil(Math.random() * (high - low) + low);
}
function get30DegRandom(){
	
}
var ImageFigure = React.createClass({

	render : function(){
		var styleObj = {};
		if(this.props.arrage.pos){
			styleObj = this.props.arrage.pos;
		}
		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageUrl} alt={this.props.data.desc} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});
var App = React.createClass({
	Constant : {
		centerPos : {
			left:0,
			right:0
		},
		hPosRange:{//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	/**
	 * 重新布局
	 * @author wonguohui
	 * @since  2016-11-18T11:36:31+0800
	 * @return {[type]}
	 */
	rearrange : function(centerImgIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),//中上图片数量

			topImgSpliceIndex = 0,
			imgsCenterArrangeArr = imgsArrangeArr.splice(centerImgIndex,1);
			//居中centerindex的图片
			imgsCenterArrangeArr[0].pos = centerPos;
			//剧中图片不需要旋转
			imgsCenterArrangeArr[0].rotate = 0;
			//取出要布局的上侧图片的状态信息
		    topImgSpliceIndex = Math.ceil(imgsArrangeArr.length - topImgNum);
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index].pos = {
					top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				};
			});
			// 布局两侧的状态信息
			for(var i = 0,j = imgsArrangeArr.length,k = j / 2;i<j;i++){
				var hPosRangeLORX = null;
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}
				imgsArrangeArr[i].pos = {
					top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				}
			}
			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerImgIndex,0,imgsCenterArrangeArr[0]);

			this.setState({
				imgsArrangeArr : imgsArrangeArr
			});

	},
	getInitialState : function(){
		return {
			imgsArrangeArr : [

			]
		}
	},
	componentDidMount:function(){
		//获取舞台的大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//获取imageFigure的大小
		var imgDOM = ReactDOM.findDOMNode(this.refs.imageFigures0),
			imgW = imgDOM.scrollWidth,
			imgH = imgDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//计算中心图片位置点
		this.Constant.centerPos = {
			left : halfStageW - halfImgW,
			top : halfStageH - halfImgH
		}
		//左侧区域水平方向位置点范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		//右侧区域水平方向位置点范围
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		//y值取值范围
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH -halfImgH;
		//上侧区域取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(1);
	},
	render : function(){
		var controllerUnits = [],
		imageFigures = [];
		imageDatas.forEach(function(v,index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos : {
						left : 0,
						top : 0
					},
					rotate : 0
				}
			}
			imageFigures.push(<ImageFigure ref={'imageFigures'+index} arrage={this.state.imgsArrangeArr[index]} key={'figures'+index} data={v}/>);
		}.bind(this));
	    return (
	    	<section className="stage" ref="stage">
	    		<section className="img-sec">
	    			{imageFigures}
	    		</section>
	    		<nav className="controller-nav">
	    			{controllerUnits}
	    		</nav>
	    	</section>
	    );
	}
});
class AppComponent extends React.Component {
  render() {
  	var controllerUnits = [],
		imageFigures = [];
	imageDatas.forEach(function(v,k){

		imageFigures.push(<imageFigure key={k} data={v} />);
	});
    return (
    	<section className="stage">
    		<section className="img-sec">
    			{imageFigures}
    		</section>
    		<nav className="controller-nav">
    			{controllerUnits}
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {

};

// export default AppComponent;
module.exports = App;
