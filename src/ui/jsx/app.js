var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
	tid: null,
	getInitialState: () => {
		return {
			names: ['张珊', '李四', '敖德萨离开的', '234', '3456235','qwe','erqer','dfsa9', '40as9cdf','309djf','0w0qdijf'],
			groups: 3,
			groupedNames: [
			],
			step: 1
		}
	},

	componentDidMount: function() {
		
		
	},


	startDistributing: function() {
		var {names, groups, groupedNames} = this.state;
		if (groups <= 0 || names.length < 1) {
			this.tid && clearInterval(this.tid);
			return false;
		}
		if (groupedNames.length < groups) {
			groupedNames = [];
			for(var i = 0; i < groups; i++) {
				groupedNames.push([]);
			}
		}
		
		if (names.length) {
			var luckyNum = Math.floor(Math.random() * names.length);
			var name = names.splice(luckyNum, 1);
			var groupIndex = this.getLeastGroup(groupedNames);
			groupedNames[groupIndex].push(name);
			this.setState({
				names,
				groupedNames
			});

		}
	},

	getLeastGroup: function(groupedNames) {
		if (groupedNames.length == 0) {
			return 0;
		}
		var index = 0, length = Infinity;
		groupedNames.forEach(function(group, order) {
			if (group && group.length < length) {
				length = group.length;
				index = order;
			}
		})
		return index;
	},
	start: function() {
		if (Number(this.refs.group.value) <= 0) {
			alert('请输入正确的分组数');
			return;
		}
		if (this.state.names.length <= 0) {
			alert('请导入姓名');
			return;
		}
		this.setState({
			step: 2,
			groups: this.refs.group.value
		}, function() {
			console.log(this.state.names);
			this.tid = setInterval(this.startDistributing, Math.max(5000 / this.state.names.length, 100) );
		}.bind(this));
	},
	readFile: function(e) {
		var self = this;
		var file = e.target.files[0];
		var reader = new FileReader();  
	    //将文件以文本形式读入页面  
	    reader.readAsText(file);  
	    reader.onload=function(f){  
	        if (this.result) {
	        	var names = this.result.replace(/\s+/g, ',').split(',');
	        	self.setState({names});
	        }
	    }  
	},
	restart: function() {
		this.tid && clearInterval(this.tid);
		this.setState({
			names: [],
			groups: 0,
			groupedNames: [],
			step: 1
		});
	},
	render: function() {
		if (this.state.step == 1) {
			return <div>
				<p className="intro"> 请导入姓名(txt文件)， 输入分组</p>
				<div className="form">
					<label for="file">导入文件：</label>
					<input type='file' name="file" accept='text/plain' onChange={this.readFile} />
				</div>
				<div className="form">
					<label for="group">分组：</label>
					<input ref="group" name="group" type="number" />
				</div>
				

				<div className="start" onClick={this.start}>开始</div>
			</div>
		}
		else {
			var {names, groupedNames } = this.state;
			var nameDom = '';
			if (names.length) {
				nameDom = <div className="names">
					{ names && names.map(function(name) {
						return <span key={name + Math.random()}>{name}</span> 
					})}
				</div>
			}
			return <div className="app"> 
				{nameDom}
				<div className="groups">
				{
					groupedNames && groupedNames.map(function(group,index) {
						return <div className="group">
							<p className="title" key={index + Math.random()}>{'第' + (index + 1) + '组'}</p>
							{group.map(function(name) {
								return <p key={Math.random() + name}>{name}</p>
							})}
						</div>
					})
				}
				</div>
				<div className="restart"  onClick={this.restart}>重新开始</div>
			</div>;
		}
		
	}
});
module.exports = App;