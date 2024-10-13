import { Command } from "commander";
import simpleGit from "simple-git";

const program = new Command();

// pullでenvファイルを取得出来ます。
program.command("pull").action(async () => {
  // リポジトリIDとコミットIDが必要
  // githubのtokenが必要
  const path = process.cwd();
  const git = simpleGit(path);
  const remoteUrl = await git.getConfig("remote.origin.url");
  // TODO: parseしてownerとrepoName取得する

  // TODO: GitHubAPI叩いてrepoId取得する

  // TODO: repoIdでcommitList叩く、最新の物のcommitUuidを拾ってくる

  // TODO: repoId + commitUuidで ファイルのS3DLリンク全て拾ってくる

  // TODO: S3DLリンク全部叩いて叩かれたフォルダに保存する
});

program.parse(process.argv);

// 例:
// HTTPS:https://github.com/warabimochi1126/EnvHub-cli.git
// SSH:git@github.com:warabimochi1126/EnvHub-cli.git
const parseGitHubUrl = (githubUrl: string) => {
  // TODO: SSHかHTTPSで分岐・共にリポジトリオーナーの名前とリポジトリ名を返す
};
