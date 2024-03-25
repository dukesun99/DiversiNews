import * as React from 'react';
import { useState } from 'react';
import { Row, Col, Divider, Dropdown, Menu, Card, Space, Checkbox, Tabs, InputNumber } from 'antd';
import G6 from '@antv/g6';
import {
  DownOutlined,
  TrademarkCircleFilled,
  ChromeFilled,
  BranchesOutlined,
  ApartmentOutlined,
  AppstoreFilled,
  CopyrightCircleFilled,
  ShareAltOutlined,
} from '@ant-design/icons';
import LayoutOptionsPanel from './LayoutOptionsPanel';
import { Layouts } from './network-layouts';

const { TabPane } = Tabs;

const iconMapByType = {
  'graphin-force': <ShareAltOutlined />,
  random: <TrademarkCircleFilled />,
  concentric: <ChromeFilled />,
  circular: <BranchesOutlined />,
  force: <AppstoreFilled />,
  dagre: <ApartmentOutlined />,
  grid: <CopyrightCircleFilled />,
  radial: <ShareAltOutlined />,
  gForce: <AppstoreFilled />,
  mds: <AppstoreFilled />,
  comboForce: <AppstoreFilled />,
};

const defaultStyle = {
  position: 'absolute',
  top: 50,
  right: 30,
  boxShadow: `0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%)`,
  width: '300px',
  height: '560px',
};

const LayoutMenu = ({ handleChange, description, layouts }) => {
  const [visible, setVisible] = React.useState(false);
  const handleVisibleChange = flag => {
    setVisible(flag);
  };
  const handleChangeLayoutType = e => {
    handleChange(e.key);
    setVisible(false);
  };
  const menu = (
    <Menu onClick={handleChangeLayoutType}>
      {layouts.map(item => {
        const { type, title } = item;
        return (
          <Menu.Item key={type}>
            <Space>
              {iconMapByType[type]} {title}
            </Space>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} visible={visible}>
      <Row style={{ paddingTop: '15px' }} >
        <Col span={12} style={{ "justifyContent": "center", display: "flex", "alignItems": "center" }}>Layout Algorithm</Col>
        <Col span={12} style={{ "justifyContent": "center", display: "flex", "alignItems": "center" }}> {description}</Col>
      </Row>
    </Dropdown>
  );
};

const LayoutSelector: React.FunctionComponent<LayoutSelectorProps> = props => {
  let { style, type, onChange, layouts, options, pruningConfig, setPruningConfig } = props;
  
  let iscomboCombined = false;
  if (type === "comboCombined") {
    iscomboCombined = true;
  }

  const [comboCombinedChecked, setComboCombinedChecked] = React.useState(iscomboCombined);
  if (type === "comboCombined") {

    if (options != undefined && options.innerLayout != undefined) {
      type = options.innerLayout.getType();
      console.log(type);
    } else {
      type = "concentric";
    }
  }
  const matchLayout = layouts.find(item => item.type === type);
  const matchOptions = matchLayout.options;

  const { title } = matchLayout;
  const handleChange = (selectedType, options = {}) => {
    if (onChange) {
      if (comboCombinedChecked) {
        onChange(
          {
            type: "comboCombined",
            options: {
              innerLayout: new G6.Layout[selectedType](options)
            }
          }
        );
      } else {
        onChange(
          {
            type: selectedType,
            options
          }
        );
      }

    }
  };

  const handleChangePruningConfig = (key, newValue) => {
    const new_pruningConfig = { ...pruningConfig, [key]: newValue };
    setPruningConfig(new_pruningConfig);
    console.log(new_pruningConfig);
  }

  const makePruningConfigOnChangeFunction = (key) => {
    return (newValue) => {
      handleChangePruningConfig(key, newValue);
    };
  }

  const description = (
    <Space>
      {iconMapByType[type]} {title} <DownOutlined />
    </Space>
  );
  return (
    <Tabs defaultActiveKey="1" style={{ ...defaultStyle, ...style, padding: 3, opacity: 1, backgroundColor: "white" }}
      tabBarStyle={{ margin: 0, padding: 3 }}>
      <TabPane tab="Layout Config" key="1">
        <Card title={
          <div>
            Use Combo?
            <Checkbox onChange={() => { setComboCombinedChecked(!comboCombinedChecked); handleChange(type); }} style={{ float: "right" }} checked={comboCombinedChecked}>Combo Layout</Checkbox>
          </div>
        } bordered={false} bodyStyle={{ padding: '0px 12px' }}>
          <LayoutMenu handleChange={handleChange} description={description} layouts={layouts} />
          <Divider style={{ margin: '15px 0px' }} />
          <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <LayoutOptionsPanel options={matchOptions} type={type} key={type} handleChange={handleChange} />
          </div>
        </Card>
      </TabPane>
      <TabPane tab="Pruning Config" key="2">
        <Card 
        // title={
        //   <div>
        //     Pruning Config
        //   </div>
        // } 
        // TODO: Refactor the body
        bordered={false} bodyStyle={{ padding: '0px 12px' }}>
          <div>Please click on search results again to refresh the visualization after changing configs</div>
          <Divider style={{ margin: '5px 0px' }} />
          <div>Nodes</div>
          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Max # of Nodes"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["num_nodes"]} onChange={makePruningConfigOnChangeFunction("num_nodes")}/>
            </Col>
          </Row>

          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Sentiment PageRank"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["pagerank"]} onChange={makePruningConfigOnChangeFunction("pagerank")}/>
            </Col>
          </Row>

          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Closeness Centrality"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["closeness"]} onChange={makePruningConfigOnChangeFunction("closeness")} />
            </Col>
          </Row>

          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Degree Centrality"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["degree"]} onChange={makePruningConfigOnChangeFunction("degree")}/>
            </Col>
          </Row>

          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Entity Frequency"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["document_frequency"]} onChange={makePruningConfigOnChangeFunction("document_frequency")}/>
            </Col>
          </Row>
          <Divider style={{ margin: '5px 0px' }} />
          <div>Edges</div>
          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Max # of Edges"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["num_edges"]} onChange={makePruningConfigOnChangeFunction("num_edges")}/>
            </Col>
          </Row>
          
          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Entity Distance"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["entity_distance"]} onChange={makePruningConfigOnChangeFunction("entity_distance")}/>
            </Col>
          </Row>

          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{"Bridge Components"}</Col>
            <Col span={12} >
            <InputNumber style={{width: "100%"}} value={pruningConfig["bridge_components"]} onChange={makePruningConfigOnChangeFunction("bridge_components")}/>
            </Col>
          </Row>
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default LayoutSelector;