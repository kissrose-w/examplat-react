# 还原Col组件并使Form.Item在同一行

## 问题分析
1. 需要恢复Col组件的使用
2. 同时确保三个Form.Item在同一行显示
3. 当前使用的是Form的inline布局，需要调整为Row+Col布局

## 解决方案
1. 导入Row和Col组件
2. 将Form的layout属性改为默认（移除inline属性）
3. 使用Row包裹三个Col，每个Col包含一个Form.Item
4. 设置每个Col的span属性，确保它们在同一行显示
5. 添加适当的gutter间距

## 具体修改
1. 恢复Col导入，并添加Row导入
2. 移除Form的layout="inline"属性
3. 用Row包裹三个Col组件
4. 每个Form.Item放在独立的Col中，设置span=8
5. 添加gutter={16}属性增加间距

## 预期效果
- 恢复了Col组件的使用
- 三个Form.Item在同一行显示
- 布局清晰，间距适当
- 保持表单功能不变