export interface Option {
    key: string;
    title: string;
    defaultValue: number | string | boolean;
    component: 'switch' | 'slider' | 'input' | 'select' | 'text';
    description?: string;
  
    /** 仅 select 时候有效，枚举值 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enums?: any[];
  
    /** 仅 slider 和input 的时候有效 */
    max?: number;
    min?: number;
    step?: number;
  }
  export type Layouts = {
    type: string;
    title: string;
    options?: Option[];
  }[];
  const layouts: Layouts = [
    {
      type: 'force',
      title: 'D3 Force',
      options: [
        {
          key: 'preventOverlap',
          title: 'Prevent Overlap',
          defaultValue: true,
          component: 'switch',
        },
        {
          key: 'linkDistance',
          title: 'Link Distance',
          defaultValue: 250,
          component: 'slider',
          min: 100,
          max: 500,
        },
        {
          key: 'nodeStrength',
          title: 'Node Strength',
          defaultValue: 30,
          component: 'slider',
          min: 10,
          max: 100,
        },
        {
          key: 'edgeStrength',
          title: 'Edge Strength',
          defaultValue: 0.1,
          component: 'slider',
          min: 0,
          max: 1,
        },
        {
          key: 'collideStrength',
          title: 'Prevent Collision Force Strength',
          defaultValue: 0.8,
          component: 'slider',
          max: 1,
          min: 0,
        },
      ],
    },
    {
      type: 'concentric',
      title: 'Concentric',
      options: [
        {
          component: 'slider',
          key: 'nodeSize',
          title: 'Node Size',
          defaultValue: 50,
        },
        {
          component: 'slider',
          key: 'minNodeSpacing',
          title: 'Min Node Spacing',
          defaultValue: 10,
        },
        {
          component: 'switch',
          key: 'preventOverlap',
          title: 'Prevent Overlap',
          defaultValue: true,
        },
        {
          component: 'slider',
          key: 'sweep',
          title: 'Sweep',
          defaultValue: undefined,
          min: 0,
          max: 10,
        },
        {
          component: 'switch',
          key: 'equidistant',
          title: 'Equidistant',
          defaultValue: false,
        },
        {
          component: 'slider',
          key: 'startAngle',
          title: 'Start Angle',
          defaultValue: (3 / 2) * Math.PI,
          min: 0,
          max: 2 * Math.PI,
          step: 0.1 * Math.PI,
        },
        {
          component: 'switch',
          key: 'clockwise',
          title: 'Clockwise',
          defaultValue: false,
        },
        {
          component: 'select',
          key: 'sortBy',
          title: 'Sort By',
          defaultValue: 'degree',
          enums: [
            { key: 'degree', value: 'degree' },
            { key: 'topology', value: 'topology' },
          ],
        },
      ],
    },
    {
      type: 'grid',
      title: 'Grid',
      options: [
        {
          component: 'slider',
          key: 'width',
          title: 'Width',
          defaultValue: 200,
          min: 10,
          max: 5000,
        },
        {
          component: 'slider',
          key: 'height',
          title: 'Height',
          defaultValue: 200,
          min: 10,
          max: 5000,
        },
        {
          component: 'switch',
          key: 'preventOverlap',
          title: 'Prevent Overlap',
          defaultValue: true,
        },
        {
          component: 'slider',
          key: 'preventOverlapPadding',
          title: 'Prevent Overlap Padding',
          defaultValue: 10,
          min: 1,
          max: 100,
        },
        {
          component: 'switch',
          key: 'condense',
          title: 'Condense',
          defaultValue: false,
        },
        {
          component: 'slider',
          key: 'rows',
          title: 'Rows',
          defaultValue: 10,
          min: 1,
          max: 500,
        },
        {
          component: 'slider',
          key: 'cols',
          title: 'Cols',
          defaultValue: 10,
          min: 1,
          max: 500,
        },
        {
          component: 'select',
          key: 'sortBy',
          title: 'Sort By',
          defaultValue: null,
          enums: [
            { key: null, value: null },
            { key: 'topology', value: 'topology' },
            { key: 'degree', value: 'degree' },
          ],
        },
      ],
    },
    {
      type: 'radial',
      options: undefined,
      title: 'Radial',
    },
    {
      type: 'dagre',
      title: 'Dagre',
      options: [
        {
          component: 'select',
          key: 'rankdir',
          title: 'Rank Direction',
          defaultValue: 'TB',
          enums: [
            { key: 'TB', value: 'TB' },
            { key: 'BT', value: 'BT' },
            { key: 'LR', value: 'LR' },
            { key: 'RL', value: 'RL' },
          ],
        },
        {
          component: 'select',
          key: 'align',
          title: 'Align',
          defaultValue: "UL",
          enums: [
            { key: null, value: null },
            { key: 'UL', value: 'UL' },
            { key: 'UR', value: 'UR' },
            { key: 'DL', value: 'DL' },
            { key: 'DR', value: 'DR' },
          ],
        },
        {
          component: 'slider',
          key: 'nodeSize',
          title: 'Node Size',
          defaultValue: 0,
          max: 200,
          min: 0,
        },
        {
          component: 'slider',
          key: 'nodesep',
          title: 'Node Separation',
          defaultValue: 10,
          max: 200,
          min: 1,
        },
        {
          component: 'input',
          key: 'ranksep',
          title: 'Rank Separation',
          defaultValue: 10,
          max: 200,
          min: 1,
        },
        {
          component: 'switch',
          key: 'sortByCombo',
          title: 'Sort By Combo',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'circular',
      options: undefined,
      title: 'Circular',
    },
  
    {
      type: 'gForce',
      options: undefined,
      title: 'G-Force',
    },
    {
      type: 'mds',
      options: undefined,
      title: 'MDS',
    },
    {
      type: 'random',
      options: undefined,
      title: 'Random',
    },
    {
      type: 'comboForce',
      options: undefined,
      title: 'Combo Force',
    },
    {
      type: 'comboCombined',
      options: undefined,
      title: 'Combo Combined',
    },
  ];
  export default layouts;