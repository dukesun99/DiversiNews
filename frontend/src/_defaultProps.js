import React from 'react';
import { SmileOutlined, CrownOutlined, TabletOutlined, AntDesignOutlined } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: <SmileOutlined />,
        component: './Welcome',
      },
      {
        path: '/admin',
        name: '管理页',
        icon: <CrownOutlined />,
        access: 'canAdmin',
        component: './Admin',
        routes: [
          {
            path: '/admin/sub-page1',
            name: '一级页面',
            icon: <CrownOutlined />,
            component: './Welcome',
          },
          {
            path: '/admin/sub-page2',
            name: '二级页面',
            icon: <CrownOutlined />,
            component: './Welcome',
          },
          {
            path: '/admin/sub-page3',
            name: '三级页面',
            icon: <CrownOutlined />,
            component: './Welcome',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
  "fixSiderbar": true,
  "menuRender": false
};
