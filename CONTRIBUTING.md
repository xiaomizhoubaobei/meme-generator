# 贡献指南

感谢您有兴趣为本项目做出贡献！我们欢迎各种形式的贡献，包括但不限于代码、文档、错误报告、功能建议等。

请花几分钟时间阅读以下指南，以帮助您顺利地为本项目做出贡献。

## 行为准则

本项目遵守 [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct.html)。参与本项目即表示您同意遵守此行为准则。请阅读 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 文件了解更多详情。

## 如何贡献

### 报告 Bug

如果您在使用本项目时遇到 Bug，请通过 [Issue Tracker](https://github.com/xiaomizhoubaobei/meme-generator/issues) 提交 Bug 报告。在提交报告时，请尽量提供详细的信息，包括：

*   您使用的操作系统和版本
*   您使用的本项目版本
*   重现 Bug 的步骤
*   预期的行为
*   实际的行为
*   任何相关的错误消息或日志

### 提交功能建议

如果您对本项目有任何功能建议，请通过 [Issue Tracker](https://github.com/xiaomizhoubaobei/meme-generator/issues) 提交功能建议。在提交建议时，请尽量详细地描述您的想法，包括：

*   您想要添加的功能
*   为什么您认为这个功能对本项目有价值
*   您认为这个功能应该如何实现

### 贡献代码

如果您想为本项目贡献代码，请按照以下步骤操作：

1.  Fork 本项目到您的 GitHub 账户。
2.  Clone 您 Fork 的仓库到本地。
3.  创建一个新的分支来存放您的修改：`git checkout -b feature/your-feature-name` 或 `git checkout -b bugfix/your-bug-name`。
4.  进行您的修改，并确保代码符合项目的编码规范（如果存在）。
5.  编写相关的测试（如果适用）。
6.  提交您的修改：`git commit -m "feat: add your feature"` 或 `git commit -m "fix: fix your bug"`。
7.  Push 您的分支到您的 Fork 仓库：`git push origin feature/your-feature-name`。
8.  在本项目仓库中创建一个 Pull Request，描述您的修改内容和目的。

我们将尽快审查您的 Pull Request，并提供反馈。

## 开发环境设置

要设置本地开发环境，请按照以下步骤操作：

1.  确保您已安装 Node.js 18 或更高版本。
2.  克隆项目仓库：

    ```bash
    git clone https://github.com/xiaomizhoubaobei/meme-generator.git
    cd meme-generator
    ```

3.  安装项目依赖：

    ```bash
    npm install
    ```

4.  构建TypeScript代码：

    ```bash
    npm run build
    ```

5.  （可选）运行开发模式：

    ```bash
    # 开发模式运行CLI
    npm run dev
    ```

现在您应该已经成功设置了开发环境，可以开始进行修改和测试了。

## 编码规范

本项目遵循 TypeScript 和 JavaScript 的最佳实践。请确保您的代码符合项目的编码规范。

**代码风格和命名约定：**

*   请参考项目中现有的代码，尽量保持一致性。
*   变量和函数名使用 camelCase (例如: `myVariable`, `myFunction`)。
*   类名和接口名使用 PascalCase (例如: `MyClass`, `MyInterface`)。
*   类型别名使用 PascalCase (例如: `MyType`)。
*   常量使用 UPPER_SNAKE_CASE (例如: `MY_CONSTANT`)。
*   文件名使用 kebab-case 或 camelCase (例如: `my-file.ts` 或 `myFile.ts`)。
*   避免单字母变量名，除非在循环或数学表达式中。
*   使用有意义的变量和函数名。

**代码格式化和检查：**

项目已配置 ESLint 和 Prettier 进行代码格式化和检查：

```bash
# 代码检查
npm run lint

# 代码格式化
npm run format
```

建议在提交代码前运行这些命令，确保代码符合规范。

**TypeScript 特定规范：**

*   使用 TypeScript 的类型系统，避免使用 `any` 类型。
*   为所有函数、变量和类添加适当的类型注解。
*   使用接口定义对象结构。
*   使用枚举定义一组相关的常量。

未来可能会创建更详细的编码风格指南文件。

## 许可证

本项目采用 [LICENSE](LICENSE) 文件中指定的许可证。贡献代码即表示您同意您的贡献将按照此许可证发布。

## 致谢

感谢所有为本项目做出贡献的人！