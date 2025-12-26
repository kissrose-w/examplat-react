# 修改Select组件为ProFormSelect

## 问题分析
1. 当前使用的是Form.Item+Select组合，缺少label和tooltip属性
2. 需要和ProFormText组件保持一致的外观和功能
3. ProFormSelect组件内置了label和tooltip支持，更适合用于表单场景

## 解决方案
1. 使用ProFormSelect替换Form.Item+Select组合
2. 添加label属性，设置为"科目"
3. 添加tooltip属性，提供关于科目的说明
4. 保留现有的name、rules、options等属性
5. 调整样式和其他属性，确保和ProFormText组件保持一致

## 具体修改
1. 删除Form.Item包装
2. 将Select替换为ProFormSelect
3. 添加label="科目"
4. 添加tooltip属性
5. 调整width属性，保持和ProFormText组件一致
6. 保留其他必要属性

## 预期效果
- Select组件和ProFormText组件有一样的label和tooltip显示
- 保持表单验证功能
- 保持相同的样式和布局
- 提升用户体验和表单的一致性