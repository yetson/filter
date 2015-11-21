var TextEffect = require("./textEffect");

var TYPE_GLOW = {
  none: {},
  blue_5:{color: "#267DE6", size: 5, opacity: "1"},
  blue_8:{color: "#267DE6", size: 8, opacity: "1"},
  blue_11:{color: "#267DE6", size: 11, opacity: "1"},
  blue_18:{color: "#267DE6", size: 18, opacity: "1"},
  red_5:{color: "#EB2722", size: 5, opacity: "1"},
  red_8:{color: "#EB2722", size: 8, opacity: "1"},
  red_11:{color: "#EB2722", size: 11, opacity: "1"},
  red_18:{color: "#EB2722", size: 18, opacity: "1"},
  olive_5:{color: "#A8E034", size: 5, opacity: "1"},
  olive_8:{color: "#A8E034", size: 8, opacity: "1"},
  olive_11:{color: "#A8E034", size: 11, opacity: "1"},
  olive_18:{color: "#A8E034", size: 18, opacity: "1"},
  purple_5:{color: "#7E4DB9", size: 5, opacity: "1"},
  purple_8:{color: "#7E4DB9", size: 8, opacity: "1"},
  purple_11:{color: "#7E4DB9", size: 11, opacity: "1"},
  purple_18:{color: "#7E4DB9", size: 18, opacity: "1"},
  green_5:{color: "#1DC7F4", size: 5, opacity: "1"},
  green_8:{color: "#1DC7F4", size: 8, opacity: "1"},
  green_11:{color: "#1DC7F4", size: 11, opacity: "1"},
  green_18:{color: "#1DC7F4", size: 18, opacity: "1"},
  yellow_5:{color: "#FF9004", size: 5, opacity: "1"},
  yellow_8:{color: "#FF9004", size: 8, opacity: "1"},
  yellow_11:{color: "#FF9004", size: 11, opacity: "1"},
  yellow_18:{color: "#FF9004", size: 18, opacity: "1"}
};

var TYPE_SHADOW = {
  none:{},
  rightDown: {color: "#000000", opacity: "0.5", blur: "4", distance: "6"},
  //leftUp: {color: "#000000", opacity: "0.5", size: "1", blur: "4", angle: "0", distance: "6"}
};

var Box = React.createClass({
  getInitialState: function(){
    return {
      textInfo: {
        text: "text",
        fill: "#000000",
        fontSize: "80"
      },
      glowInfo: {},
      shadowInfo: {}
    };
  },
  change: function(tarFormId, opt){
    var glowOpt;
    if(tarFormId === "fontForm"){
      opt.text ? this.state.textInfo.text = opt.text : null;
      opt.size ? this.state.textInfo.fontSize = opt.size : null;
      opt.color ? this.state.textInfo.fill = opt.color : null;
    }else if(tarFormId === "glowForm"){
      if(opt['glowSelect']){
        //if(opt['glowSelect'] === "0")return;
        this.state.glowInfo = _.clone(TYPE_GLOW[opt['glowSelect']]);
      }else{
        opt.color ? this.state.glowInfo.color = opt.color : null;
        opt.size ? this.state.glowInfo.size = opt.size : null;
        opt.opacity ? this.state.glowInfo.opacity = opt.opacity : null;
      }
      TextEffect.glow(ReactDOM.findDOMNode(this.refs.textBox).querySelector("text:last-child"), this.state.glowInfo);
    }else if(tarFormId === "shadowForm"){
      if(opt['shadowSelect']){
        //if(opt['shadowSelect'] === "0")return;
        this.state.shadowInfo = _.clone(TYPE_SHADOW[opt['shadowSelect']]);
      }else{
        opt.color ? this.state.shadowInfo.color = opt.color : null;
        opt.opacity ? this.state.shadowInfo.opacity = opt.opacity : null;
        opt.size ? this.state.shadowInfo.size = opt.size : null;
        opt.blur ? this.state.shadowInfo.blur = opt.blur : null;
        opt.angle ? this.state.shadowInfo.angle = opt.angle : null;
        opt.distance ? this.state.shadowInfo.distance = opt.distance : null;
      }
      TextEffect.shadow(ReactDOM.findDOMNode(this.refs.textBox).querySelector("text:last-child"), this.state.shadowInfo);
    }
    this.forceUpdate();
  },
  render: function(){
    return (
      <div>
        <TextBox ref="textBox" style={this.state} textInfo={this.state.textInfo}/>
        <div className="display">
          <FormBox id="fontForm" displayName="字体" option={this.state.textInfo} onChange={this.change}/>
          <FormBox id="glowForm" displayName="发光" option={this.state.glowInfo} onChange={this.change}/>
          <FormBox id="shadowForm" displayName="阴影" option={this.state.shadowInfo} onChange={this.change}/>
        </div>
      </div>
    );
  }
});

var TextBox = React.createClass({
  render: function(){
    return (
        <svg ref="textArea" className="show" style={{fontSize:this.props.textInfo.fontSize}}>
          <g>
            <text x="10" y="100" fill={this.props.textInfo.fill}>{this.props.textInfo.text}</text>
          </g>
        </svg>
    );
  }
});

var FormBox = React.createClass({
  getInitialState: function(){
    return this.props.option;
  },
  handleChange: function(e){
    e.preventDefault();
    var inputDom = e.currentTarget;
    var value = inputDom.value;
    this.state[inputDom.id] = value;
    this.forceUpdate();

    var obj = {};
    obj[inputDom.id] = value;
    this.props.onChange(this.props.id, obj);
  },
  render: function(){
    var ps = Object.keys(this.props.option).map(function(k, index){
      var type = k === "color" || k === "fill" ? "color" : (k==="text" ? "text" : "range");
      var [min, max, step] = [1, 100, 1];
      if(k === "opacity"){
        min = 0;
        max = 1;
        step = 0.1;
      }else if(k === "angle"){
        min = 0;
        max = 360;
      }else if(k === "size" && this.props.id === "glowForm"){
        min = 1;
        max = 20;
      }else if(k === "distance" && this.props.id === "shadowForm"){
        min = -10;
        max = 10;
      }else if(k === "blur" && this.props.id === "shadowForm"){
        min = 0;
        max = 10;
      }
      return(
        <p key={index}>
          <label>{k}&nbsp;</label>
          <input id={k} type={type} min={min} max={max} step={step} value={this.props.option[k]} onInput={this.handleChange} onChange={this.handleChange} />
          <label name="result">&nbsp;{this.props.option[k]}</label>
        </p>
      );
    }.bind(this));
    var glowTypeSelect = Object.keys(TYPE_GLOW).map(function(t, index){
      return (
        <option key={index} value={t}>{t}</option>
      );
    });
    var shadowTypeSelect = Object.keys(TYPE_SHADOW).map(function(t, index){
      return (
        <option key={index} value={t}>{t}</option>
      );
    });
    return (
      <form>
        <h2>{this.props.displayName}</h2>
        {this.props.displayName === "发光" ? (<select id="glowSelect" onChange={this.handleChange}>{glowTypeSelect}</select>) : (this.props.displayName === "阴影" ? (<select id="shadowSelect" onChange={this.handleChange}>{shadowTypeSelect}</select>) : null)}
        {ps}
      </form>
    );
  }
});

ReactDOM.render(
  <Box />,
  document.getElementById("content")
);