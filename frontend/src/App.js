import './App.css';
import React from 'react';
import Graphin, { Behaviors, Utils, GraphinContext  } from '@antv/graphin';
import { Row, Col, Input, Card  } from 'antd';
import '@antv/graphin-icons/dist/index.css';
import "@antv/graphin/dist/index.css";
import "@antv/graphin-components/dist/index.css";
import { Toolbar, FishEye, Tooltip as GinTooltip   } from "@antv/graphin-components";
import { Tooltip, Button } from 'antd';
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  SearchOutlined,
  DeleteOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

const onChange = (e, setTextAreaInput) => {
  setTextAreaInput(e.target.value);
};

const { Menu, Donut } = Toolbar;

const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;

function Graphinvis({data, setData, textAreaInput, setTextAreaInput, articleBoxText}) {
  const [fishEyevisible, setFishEyeVisible] = React.useState(false);
  const toggleFishEye = () => {
    setFishEyeVisible(!fishEyevisible);
  };

  const CustomContent = () => {
    const { apis } = React.useContext(GraphinContext);
    const { handleZoomIn, handleZoomOut } = apis;
  
    const options = [
      {
        key: 'zoomOut',
        name: <ZoomInOutlined />,
        description: 'Zoom In',
        action: () => {
          handleZoomOut();
        },
      },
      {
        key: 'zoomIn',
        name: <ZoomOutOutlined />,
        description: 'Zoom Out',
        action: () => {
          handleZoomIn();
        },
      },
      {
        key: 'visSetting',
        name: <SearchOutlined />,
        description: 'FishEye Zoom',
        action: () => {
          toggleFishEye();
        },
      },
      {
        key: 'clearCanvas',
        name: <DeleteOutlined />,
        description: 'Delete All Nodes',
        action: () => {
          setData({"nodes": [], "edges": []});
        },
      },
    ];
  
    return (
      <div>
        {options.map((item) => {
          return (
            <Tooltip title={item.description} key={item.key}>
              <Button onClick={item.action}>{item.name}</Button>
            </Tooltip>
          );
        })}
      </div>
    );
  };
  return (
    <div style={{height:"100%"}}>
      <Row gutter={16} style={{height:"100%", width:"100%"}}>
        <Col span={3}>
          <TextArea  value={textAreaInput} style={{"width":"100%", height:"100%"}} onChange={(e) => onChange(e, setTextAreaInput)}>
          </TextArea >
        </Col>
        {/* 
        <Col span={3}>
          <TextArea  value={JSON.stringify(data, null, 2)} style={{"width":"100%", height:"100%"}} onChange={(e) => onChange(e, setTextAreaInput)}>
          </TextArea >
        </Col>*/}
        <Col span={18}>
          <Graphin data={data} layout={{ type: 'gForce' }} fitView={true}>
            <ZoomCanvas enabled />
            <DragNode />
            <Toolbar direction="horizontal">
              <CustomContent />
            </Toolbar>
            <ActivateRelations trigger="click"/>
            <FishEye options={{}} visible={fishEyevisible}/>
            <GinTooltip bindType="node">
              <GinTooltip.Node>
                {model => {
                  console.log(model);
                  return (
                    <div>
                      {model.id}
                      <li>{model.style.label.value}</li>
                      <li>{model.id}</li>
                      <li>{model.id}</li>
                      <li>{model.id}</li>
                    </div>
                  );
                }}
              </GinTooltip.Node>
            </GinTooltip>
          </Graphin>
          {/* <Card title="Visualization" style={{"width":"100%", height:"100%"}}>
            
          </Card> */}
        </Col>
        <Col span={3}>
          <TextArea  value={articleBoxText} style={{"width":"100%", height:"100%"}}>
          </TextArea >
        </Col>
      </Row>
    </div>
  );
}

export default Graphinvis;
