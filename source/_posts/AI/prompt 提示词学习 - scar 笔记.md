---
title: prompt 提示词学习 - scar 笔记
date: 2024/01/13 00:00
description:
categories: AI
---

# 资料

- https://platform.openai.com/docs/guides/prompt-engineering
- https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/1/introduction
- https://learn-prompting.webflow.io/courses
- https://learn.deeplearning.ai/langchain/lesson/1/introduction

# 1. Two Types of large language models

## Base LLM

Predicts next word，based on text training data（预测下一个单词，基于文本训练数据，通过网络上的大数据预测下一个词可能是什么）

## Instruction Tuned LLM（指令调节 LLM）

- Tries to follow instructions
- Fine-tune（微调） on instructions and good attempts at following those instructions
- RLHF: Reinforcement Learrning with Human Feedback（通过人工反馈进行强化学习）
- Helpful,Honest,Harmless

## 总结

Instruction Tuned LLM 是基于 Base LLM 调优后的模型，更利于人类使用。

### 神经网络和 LLM 的关系是什么？

> 总结来说，神经网络为构建大型语言模型提供了基础架构，而大型语言模型则是神经网络在自然语言处理领域的一种高级应用。通过这种应用，神经网络能够在理解和生成人类语言方面展现出惊人的能力。

神经网络和大型语言模型（LLM，如 GPT 系列）之间的关系可以理解为基础和应用的关系。神经网络是构建大型语言模型的基础框架，而大型语言模型是神经网络技术在自然语言处理领域的一种具体应用。

1. **神经网络**：
   - 神经网络是一种模仿人脑工作原理的计算模型，用于学习和模式识别。它由大量的节点（或称为“神经元”）组成，这些节点通过层次结构相互连接，并能够通过训练学习数据中的模式。
   - 在人工智能领域，神经网络被广泛用于各种任务，如图像识别、语音识别、预测分析等。
2. **大型语言模型（LLM）**：
   - 大型语言模型是一种特殊类型的神经网络，专门设计用于理解和生成自然语言。这些模型通常使用大量文本数据进行训练，学习语言的统计规律，从而能够执行如文本生成、翻译、摘要、问答等任务。
   - 这些模型的一个关键特征是它们的规模：它们通常包含数十亿甚至数千亿个参数，这使得它们能够学习和理解复杂的语言模式。

在大型语言模型中，最常见的神经网络类型是**变换器（Transformer）**架构。这种架构特别适用于处理序列数据（如文本），因为它能够有效处理长距离依赖关系（即文本中相距较远的元素之间的关系）。

### 人工智能发展历史

人工智能（AI）的理论基础远远不止神经网络，实际上它是一个多学科、多理论的领域，包括但不限于以下几个主要方面：

1. **符号主义（Symbolic AI）**:
   - 符号主义是早期 AI 的主流，侧重于使用符号来表示问题和知识。在这种方法中，智能被视为对符号的操纵。典型的符号主义方法包括专家系统和逻辑编程。
2. **连接主义（Connectionism）**:
   - 连接主义，即神经网络，是当今 AI 研究的一个重要支柱。它模仿人脑的神经元网络来处理数据和创建智能行为。
3. **进化计算（Evolutionary Computation）**:
   - 进化计算受自然选择和遗传学的启发，使用遗传算法、进化策略等模拟生物进化过程来解决优化和搜索问题。
4. **贝叶斯网络（Bayesian Networks）**:
   - 贝叶斯网络是一种用于统计推理的模型，特别适用于不确定性处理和概率推理。
5. **模糊逻辑（Fuzzy Logic）**:
   - 模糊逻辑用于处理不精确或不确定信息，特别适用于控制系统和决策支持系统。
6. **认知建模（Cognitive Modeling）**:
   - 认知建模试图模仿人类或动物的认知过程，以理解智能的本质，并将这些原理应用于 AI 系统。

在 AI 的发展过程中，曾经出现过几个主要的学术潮流：

- **1950-1970 年代**：符号主义盛行，人们试图通过硬编码规则来模拟智能。
- **1980 年代**：随着机器学习的兴起，尤其是决策树和支持向量机，数据驱动的方法开始流行。
- **1990 年代**：随着互联网的发展和数据量的爆炸增长，大数据和复杂模型（如深度学习）开始成为研究重点。
- **2000 年代至今**：深度学习和神经网络成为主流，推动了人工智能的快速发展，特别是在图像识别、语言处理和自动驾驶等领域取得了重大突破。

总的来说，AI 是一个不断进化的领域，不同的理论和技术在不同时间段占据主导地位，推动着该领域的发展。

# 2.
