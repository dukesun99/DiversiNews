import * as React from 'react';
import { Option } from './network-layouts';
import { Slider, Switch, Row, Col, InputNumber, Select } from 'antd';

interface LayoutOptionsPanelProps {
  options: Option[];
  /** 布局类型 */
  type: string;
  /** 回调函数 */
  handleChange: (type: string, options: unknown) => void;
}

const getAntdComponent = (option: Option, props) => {
  const { onChange, value } = props;

  const { min = 0, max = 500, component, key, enums, step = 1 } = option;

  if (component === 'slider') {
    return {
      component: Slider,
      props: {
        min,
        max,
        onChange: val => {
          onChange(key, val);
        },
        value,
        step,
        style: {
          width: '90%'
        }
      },
    };
  }
  if (component === 'input') {
    return {
      component: InputNumber,
      props: {
        onChange: val => {
          onChange(key, val);
        },
        value,
      },
    };
  }
  if (component === 'switch') {
    return {
      component: Switch,
      props: {
        onChange: checked => {
          onChange(key, checked);
        },
        checked: value,
        step: 0.01,
        style: {
          width: "20%"
        }
      },
    };
  }
  if (component === 'select') {
    return {
      component: Select,
      props: {
        options: enums,
        value: value,
        onChange: checked => {
          onChange(key, checked);
        },
      },
    };
  }
  if (component === 'text') {
    return {
      component: () => <span>No configs</span>,
      props: {},
    };
  }
};

const dumpOptions: Option[] = [
  {
    key: 'work-in-progress',
    component: 'text',
    title: 'N/A',
    defaultValue: '',
  },
];
const LayoutOptionsPanel: React.FunctionComponent<LayoutOptionsPanelProps> = props => {
  const { options: OPTIONS = dumpOptions, type, handleChange } = props;

  const [options, setOptions] = React.useState({});
  const defaultOptions = OPTIONS.map(c => {
    const { key, defaultValue } = c;
    return { [key]: defaultValue };
  }).reduce((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, {});

  const onChange = (key, val) => {
    const newOptions = {
      ...defaultOptions,
      ...options,
      [key]: val,
    };
    setOptions(newOptions);
    if (handleChange) {
      handleChange(type, newOptions);
    }
  };
  console.log(options);

  return (
    <>
      {OPTIONS.map(item => {
        const { title, defaultValue, key } = item;
        const value = options[key];
        const { component: Component, props: ComponentProps } = getAntdComponent(item, {
          onChange,
          value: value === undefined ? defaultValue : value,
        });
        return (
          <Row style={{"backgroundColor":"WhiteSmoke", margin: 5}}>
            <Col span={12} style={{"justifyContent": "center", display: "flex", "alignItems": "center"}}>{title}</Col>
            <Col span={12} >
              <Component style={{width: "100%"}} {...ComponentProps} />
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default LayoutOptionsPanel;