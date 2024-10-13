import { Command } from "commander";

const program = new Command();

// pullでenvファイルを取得出来ます。
program.command("pull").action(() => {
  // リポジトリIDとコミットIDが必要
  // githubのtokenが必要
});

program.parse(process.argv);
