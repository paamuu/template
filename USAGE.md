# Angular Schematics 使用指南

本项目是一个 Angular Schematics 集合，包含多个用于生成文件的 schematic。现在支持通过 Node.js 脚本来执行这些 schematics。

## 安装依赖

```bash
npm install
```

## 可用的 Schematics

- `my-schematic`: 基础示例 schematic，创建一个简单的 "hello world" 文件
- `my-full-schematic`: 完整示例，使用模板和选项参数
- `my-other-schematic`: 调用其他 schematic 的示例
- `my-extend-schematic`: 扩展其他 schematic 的示例

## 使用方法

### 1. 直接使用 npm scripts

```bash
# 运行基础 schematic
npm run run:my-schematic

# 运行完整 schematic
npm run run:my-full-schematic

# 运行其他 schematic
npm run run:my-other-schematic
```

### 2. 使用 Node.js 脚本

```bash
# 基础用法
npm run run my-schematic

# 带参数的用法
npm run run my-full-schematic -- --name=test --index=5

# 预览模式（不实际创建文件）
npm run run my-full-schematic -- --name=test --index=5 --dry-run
```

### 3. 使用 TypeScript 脚本（推荐）

```bash
# 列出所有可用的 schematics
npm run list

# 运行 schematic
npm run run:ts my-schematic

# 带参数运行
npm run run:ts my-full-schematic -- --name=test --index=5

# 预览模式
npm run run:ts my-full-schematic -- --name=test --index=5 --dry-run

# 查看帮助
npm run run:ts -- --help
```

### 4. 直接使用脚本文件

```bash
# JavaScript 版本
node scripts/run-schematic.js my-schematic
node scripts/run-schematic.js my-full-schematic --name=test --index=5

# TypeScript 版本
npx ts-node scripts/run-schematic.ts my-schematic
npx ts-node scripts/run-schematic.ts my-full-schematic --name=test --index=5 --dry-run
```

## 预设演示命令

```bash
# 基础演示
npm run demo:basic

# 完整演示
npm run demo:full

# 预览模式演示
npm run demo:dry
```

## 输出目录

默认情况下，生成的文件会放在 `output/` 目录中。你可以通过 `--output` 参数指定不同的输出目录：

```bash
npm run run:ts my-full-schematic -- --name=test --output=./my-output
```

## 选项参数

### my-full-schematic 可用选项：

- `--name`: 必需，字符串类型，用于模板中的名称
- `--index`: 可选，数字类型，默认为 1

### 通用选项：

- `--dry-run`: 预览模式，显示将要创建的文件但不实际创建
- `--force`: 强制覆盖已存在的文件
- `--verbose`: 详细输出模式

## 开发

### 构建项目

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 添加新的 Schematic

1. 在 `src/` 目录下创建新的文件夹
2. 添加 `index.ts` 文件实现 schematic 逻辑
3. 在 `src/collection.json` 中注册新的 schematic
4. 如需选项验证，添加 `schema.json` 文件

## 故障排除

### 常见问题

1. **找不到 schematics 命令**
   - 确保已安装 `@angular-devkit/schematics-cli`
   - 运行 `npm install` 安装所有依赖

2. **TypeScript 编译错误**
   - 运行 `npm run build` 确保项目已构建
   - 检查 TypeScript 配置和语法

3. **权限错误**
   - 在 Windows 上，确保脚本有执行权限
   - 可能需要以管理员身份运行

4. **输出目录问题**
   - 确保输出目录存在或有创建权限
   - 使用 `--force` 选项覆盖已存在的文件

### 调试

使用 `--verbose` 选项获取详细的执行信息：

```bash
npm run run:ts my-full-schematic -- --name=debug --verbose
```

使用 `--dry-run` 选项预览操作而不实际执行：

```bash
npm run run:ts my-full-schematic -- --name=debug --dry-run
```