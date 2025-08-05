import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Schematic 运行选项
 */
interface SchematicOptions {
  name: string;
  options?: Record<string, any>;
  dryRun?: boolean;
  outputPath?: string;
  force?: boolean;
  verbose?: boolean;
}

/**
 * Angular Schematics 运行器类
 */
export class SchematicRunner {
  private readonly projectRoot: string;
  private readonly collectionPath: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.collectionPath = '.'; // 使用当前集合
  }

  /**
   * 构建项目
   */
  private build(): void {
    console.log('正在构建项目...');
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot
      });
    } catch (error) {
      throw new Error(`构建失败: ${error.message}`);
    }
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDirectory(outputPath: string): void {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
  }

  /**
   * 构建 schematics 命令参数
   */
  private buildCommandArgs(options: SchematicOptions): string[] {
    const args = [`${this.collectionPath}:${options.name}`];

    // 添加选项参数
    if (options.options) {
      for (const [key, value] of Object.entries(options.options)) {
        args.push(`--${key}=${value}`);
      }
    }

    // 添加标志参数
    if (options.dryRun) {
      args.push('--dry-run');
    }
    if (options.force) {
      args.push('--force');
    }
    if (options.verbose) {
      args.push('--verbose');
    }

    return args;
  }

  /**
   * 运行指定的 schematic
   */
  async runSchematic(options: SchematicOptions): Promise<void> {
    try {
      // 构建项目
      this.build();

      // 设置输出路径
      const outputPath = options.outputPath || path.join(this.projectRoot, 'output');
      this.ensureOutputDirectory(outputPath);

      // 构建命令
      const args = this.buildCommandArgs(options);
      const command = `npx schematics ${args.join(' ')}`;

      console.log(`正在执行 schematic: ${options.name}`);
      console.log(`命令: ${command}`);
      console.log(`输出目录: ${outputPath}`);
      console.log('---');

      // 执行命令
      execSync(command, {
        stdio: 'inherit',
        cwd: outputPath
      });

      console.log('---');
      console.log('Schematic 执行完成!');
      
      if (!options.dryRun) {
        console.log('生成的文件位于:', outputPath);
      }

    } catch (error) {
      throw new Error(`执行 schematic 失败: ${error.message}`);
    }
  }

  /**
   * 列出所有可用的 schematics
   */
  listSchematics(): void {
    const collectionPath = path.join(this.projectRoot, 'src', 'collection.json');
    
    if (!fs.existsSync(collectionPath)) {
      console.error('找不到 collection.json 文件');
      return;
    }

    try {
      const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));
      console.log('可用的 schematics:');
      
      for (const [name, config] of Object.entries(collection.schematics)) {
        console.log(`  - ${name}: ${(config as any).description || '无描述'}`);
      }
    } catch (error) {
      console.error('读取 collection.json 失败:', error.message);
    }
  }
}

/**
 * 命令行接口
 */
function main(): void {
  const args = process.argv.slice(2);
  const runner = new SchematicRunner();

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('Angular Schematics 运行器');
    console.log('');
    console.log('使用方法:');
    console.log('  ts-node scripts/run-schematic.ts <schematic-name> [选项]');
    console.log('  ts-node scripts/run-schematic.ts --list');
    console.log('');
    console.log('选项:');
    console.log('  --name=<value>      设置 name 参数');
    console.log('  --index=<value>     设置 index 参数');
    console.log('  --dry-run           预览模式，不实际创建文件');
    console.log('  --force             强制覆盖已存在的文件');
    console.log('  --verbose           详细输出');
    console.log('  --output=<path>     指定输出目录');
    console.log('  --list              列出所有可用的 schematics');
    console.log('');
    console.log('示例:');
    console.log('  ts-node scripts/run-schematic.ts my-schematic');
    console.log('  ts-node scripts/run-schematic.ts my-full-schematic --name=test --index=5');
    console.log('  ts-node scripts/run-schematic.ts my-full-schematic --name=test --dry-run');
    return;
  }

  if (args[0] === '--list') {
    runner.listSchematics();
    return;
  }

  const schematicName = args[0];
  const options: SchematicOptions = {
    name: schematicName,
    options: {},
    dryRun: false,
    force: false,
    verbose: false
  };

  // 解析命令行参数
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg.startsWith('--output=')) {
      options.outputPath = arg.split('=')[1];
    } else if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (value !== undefined) {
        options.options![key] = value;
      }
    }
  }

  // 运行 schematic
  runner.runSchematic(options).catch(error => {
    console.error('错误:', error.message);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}