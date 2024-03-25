import { GraphinContext } from '@antv/graphin';
import React from 'react';

const defaultComboCfg = {
  members: [],
  type: 'rect',
  style: {
    fill: 'lightblue',
    stroke: 'blue',
    opacity: 0.2,
  },
  padding: 10,
};

/**
 * deep merge Combo config
 * @param defaultCfg
 * @param cfg
 */
const deepMergeCfg = (defaultCfg, cfg) => {
  const { style: DefaultCfg = {}, ...defaultOtherCfg } = defaultCfg;
  const { style = {}, ...others } = cfg;
  return {
    ...defaultOtherCfg,
    ...others,
    style: {
      ...DefaultCfg,
      ...style,
    },
  };
};


const Combo = props => {
  const graphin = React.useContext(GraphinContext);
  const { graph } = graphin;

  React.useEffect(() => {
    const { options } = props;

    options.map(item => {
      return graph.createCombo(
        // @ts-ignore
        deepMergeCfg(defaultComboCfg, {
          id: `${Math.random()}`,
          ...item,
        }),
        item.members,
      );
    });
    return () => {};
  }, [graph]);

  return <></>;
};
export default Combo;