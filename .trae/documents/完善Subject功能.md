### 问题分析

当前PaperBank.tsx文件中，科目列表生成逻辑存在以下问题：

1. 逻辑错误：使用了错误的嵌套map循环，导致无法正确添加科目
2. 数据重复：没有去重机制，可能导致重复科目
3. 缺少完整科目列表：只从现有试卷中提取科目，可能遗漏未使用的科目
4. 注释掉了正确的映射逻辑

### 修复方案

1. **修复科目列表生成逻辑**
   - 使用Set确保科目唯一性
   - 结合allTestPapers和classifyList生成完整科目列表
   - 确保所有科目都能显示在搜索选项中

2. **优化数据结构**
   - 正确映射科目ID和名称
   - 处理边缘情况（如无数据时）

3. **完善错误处理**
   - 添加空值检查
   - 确保数据类型安全

### 实现代码

将原有的科目列表生成代码替换为：

```typescript
// 科目
const subjects = useMemo<{value: string, label: string}[]>(() => {
  // 确保allTestPapers是数组且有数据
  if (Array.isArray(allTestPapers) && allTestPapers.length > 0) {
    // 使用Set确保科目唯一
    const uniqueSubjects = new Set<string>();
    const subjectList: {value: string, label: string}[] = [];
    
    // 遍历所有试卷，获取唯一科目
    allTestPapers.forEach((item: TestListItem) => {
      // 如果科目value不存在于Set中，则添加到Set和subjectList
      if (item.classify && !uniqueSubjects.has(item.classify.value)) {
        uniqueSubjects.add(item.classify.value);
        subjectList.push({
          value: item.classify.value,
          label: item.classify.name
        });
      }
    });
    
    // 也可以使用classifyList来生成完整的科目列表
    // 这样即使没有试卷使用该科目，也能显示在搜索选项中
    if (Array.isArray(classifyList) && classifyList.length > 0) {
      classifyList.forEach(classify => {
        if (!uniqueSubjects.has(classify._id)) {
          uniqueSubjects.add(classify._id);
          subjectList.push({
            value: classify._id,
            label: classify.name
          });
        }
      });
    }
    
    return subjectList;
  }
  
  // 如果没有试卷数据，直接使用classifyList生成科目列表
  if (Array.isArray(classifyList) && classifyList.length > 0) {
    return classifyList.map(classify => ({
      value: classify._id,
      label: classify.name
    }));
  }
  
  return [];
}, [allTestPapers, classifyList]);
```

### 预期效果

1. 科目列表能够正确生成，包含所有唯一科目
2. 即使没有试卷使用的科目也能显示在搜索选项中
3. 科目名称和ID正确映射
4. 代码逻辑清晰，易于维护

### 测试计划

1. 检查科目列表是否正确显示
2. 测试搜索功能是否正常工作
3. 验证边缘情况（如无数据时）
4. 确保性能良好，无内存泄漏