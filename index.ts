import { Command } from "commander";
import simpleGit from "simple-git";
import { URL } from "url";

const program = new Command();

// pullでenvファイルを取得出来ます。
program.command("pull").action(async () => {
  // リポジトリIDとコミットIDが必要
  // githubのtokenが必要
  const path = process.cwd();
  const git = simpleGit(path);
  const remoteUrl = await git.getConfig("remote.origin.url");
  // parseしてownerとrepoName取得する
  const { repoOwner, repoName } = parseGitHubUrl(remoteUrl.value!);
  // GitHubAPI叩いてrepoId取得する
  const repoId = await getRepositoryId(repoOwner, repoName);

  // TODO: repoIdでcommitList叩く、最新の物のcommitUuidを拾ってくる
  // 認証情報を保持している必要がある -> supabaseの認証情報をoauthURLを返すAPIを作る必要がある
  // const commitList = await fetch("");

  // TODO: repoId + commitUuidで ファイルのS3DLリンク全て拾ってくる

  // TODO: S3DLリンク全部叩いて叩かれたフォルダに保存する
});

program.parse(process.argv);

// 例:
// HTTPS:https://github.com/warabimochi1126/EnvHub-cli.git
// SSH:git@github.com:warabimochi1126/EnvHub-cli.git
const parseGitHubUrl = (
  githubUrl: string
): { repoOwner: string; repoName: string } => {
  // TODO: SSHかHTTPSで分岐・共にリポジトリオーナーの名前とリポジトリ名を返す
  const isHTTPS = githubUrl.substring(0, 5) === "https" ? true : false;
  const isSSH = githubUrl.substring(0, 3) === "git" ? true : false;

  if (isHTTPS) {
    const temp = new URL(githubUrl);
    const pathNameArray = temp.pathname.split("/");
    const repoOwner = pathNameArray[1];

    const lastDotIndex = pathNameArray[2].lastIndexOf(".");
    const repoName = pathNameArray[2].substring(0, lastDotIndex);

    return {
      repoOwner,
      repoName,
    };
  }

  if (isSSH) {
    const urlArray = githubUrl.split("/");
    const ownerPart = urlArray[0];
    const repoPart = urlArray[1];

    const repoOwner = ownerPart.split(":")[1];

    const lastDotIndex = repoPart.lastIndexOf(".");
    const repoName = repoPart.substring(0, lastDotIndex);

    return {
      repoOwner,
      repoName,
    };
  }

  throw new Error(
    "リモートリポジトリのアドレスがhttpsかgitで始まっている必要があります。"
  );
};

// parseGitHubUrl("https://github.com/warabimochi1126/EnvHub-cli.temp.git");
// parseGitHubUrl("git@github.com:warabimochi1126/EnvHub-cli.git");

const getRepositoryId = async (
  ownerName: string,
  repositoryName: string
): Promise<string> => {
  const url = `https://api.github.com/repos/${ownerName}/${repositoryName}`;

  const response = await fetch(url);
  const responseData = await response.json();

  return responseData.id;
};

// getRepositoryId("warabimochi1126", "EnvHub");
