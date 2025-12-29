1. 修改PaperBank.tsx文件中的onSearch函数
2. 完善onSearch函数实现：
   - 接收搜索参数
   - 合并搜索参数与当前分页参数，重置页码到第1页
   - 调用store的getList方法获取数据
3. 确保搜索功能与分页功能正常协作
4. 测试功能是否正常工作