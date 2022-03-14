---
title: PyTorch源码解读之torch.autograd：梯度计算详解
notshow: false
tags:
  - torch.autograd
  - 梯度
categories:
  - PyTorch
abbrlink: a30cfce2
date: 2021-04-24 22:09:20
---

引言：本篇笔记以介绍 pytorch 中的 autograd 模块功能为主，主要涉及 torch/autograd 下代码，不涉及底层的 C++ 实现。

<!--more-->

- torch.autograd.function （函数的反向传播）
- torch.autograd.functional （计算图的反向传播）
- torch.autograd.gradcheck （数值梯度检查）
- torch.autograd.anomaly_mode （在自动求导时检测错误产生路径）
- torch.autograd.grad_mode （设置是否需要梯度）
- model.eval() 与 torch.no_grad()
- torch.autograd.profiler （提供 function 级别的统计信息）

### torch.autograd.function（函数的反向传播）

我们在构建网络的时候，通常使用 pytorch 所提供的`nn.Module` （例如`nn.Conv2d`, `nn.ReLU`等）作为基本单元。而这些 Module 通常是包裹 autograd function，以其作为真正实现的部分。例如`nn.ReLU` 实际使用`torch.nn.functional.relu`（`F.relu`）:

```python
from torch.nn import functional as F

class ReLU(Module):
    __constants__ = ['inplace']
    inplace: bool
    
    def __init__(self, inplace: bool = False):
        super(ReLU, self).__init()__()
        self.inplace = inplace
        
    def forward(self, input: Tensor) -> Tensor:
        return F.relu(input, inplace=self.inplace)
```

这里的`F.relu`类型为`function`，若再剥开一层，其实际包裹的函数类型为`builtin_function_or_method`，这也是真正完成运算的部分。这些部分通常使用 C++ 实现（如`ATen`）。至此我们知道，一个模型的运算部分由 autograd functions 组成，这些 autograd functions 内部定义了 forward，backward 用以描述前向和梯度反传的过程，组合后可以实现整个模型的前向和梯度反传。以`torch.autograd.function`中所定义的`Function`类为基类，我们可以实现自定义的autograd function，所实现的 function 需包含`forward`及`backward`两个方法。以下以`Exp`和`GradCoeff`两个自定义 autograd function 为例进行讲解：