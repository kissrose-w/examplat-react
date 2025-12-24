# 实现计划

## 1. 分析现状
- 路由已配置：`/student` 和 `/student/detail` 两个子路由
- 菜单使用 Ant Design 的 Menu 组件，但目前是硬编码数据
- 菜单数据从 `userStore` 获取 `menuList`，但未使用

## 2. 实现步骤

### 2.1 修改 Home.tsx 文件
- 导入 `useNavigate` 钩子用于路由跳转
- 将硬编码的 `items` 替换为基于 `menuList` 或自定义的路由菜单
- 添加菜单点击事件，实现路由跳转
- 实现菜单选中状态与当前路由匹配

### 2.2 配置 Student 相关菜单
- 添加 Student 主菜单
- 添加 Exam List 和 Exam Detail 两个子菜单
- 关联对应的路由路径

### 2.3 确保 Student.tsx 正确渲染子路由
- 确保 Student 组件中包含 `<Outlet />` 用于渲染子路由

### 2.4 测试功能
- 运行项目，测试菜单切换功能
- 验证路由跳转是否正常
- 验证菜单选中状态是否正确

## 3. 预期效果
- 左侧菜单显示 Student 主菜单
- 点击 Student 展开子菜单，显示 Exam List 和 Exam Detail
- 点击子菜单可切换到对应的路由
- 菜单选中状态与当前路由匹配

## 4. 技术要点
- 使用 React Router 的 `useNavigate` 进行路由跳转
- 使用 React Router 的 `useLocation` 获取当前路由，用于菜单选中状态
- 利用 Ant Design Menu 组件的 `selectedKeys` 和 `openKeys` 属性实现菜单状态管理
- 构建符合 Ant Design Menu 要求的菜单数据结构