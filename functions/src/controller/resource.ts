import { Request, Response } from "express";

export class ResourceController {
  async get(req: Request, res: Response) {
    console.log("query", req.query.paths);
    if (!req.query.paths || typeof req.query.paths !== "string") {
      res
        .status(400)
        .send(JSON.stringify({ result: "Required 'paths' parameter." }));
      return;
    }

    // 許可する拡張子

    const pathList = decodeURIComponent(req.query.paths).split(",");
    try {
      const results = await Promise.all(
        pathList.map(async (path) => {
          // 拡張子チェック
          if (!this.isValidPath(path)) {
            return { path, url: null, error: "Unsupported file type" };
          }
          return {
            path,
            url: `http://127.0.0.1:9199/creatriver-59a53.appspot.com/gameofus/games${path}`,
          };
        })
      );

      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).send({ error: "Failed to fetch file" });
    }
  }

  private isValidPath(path: string): boolean {
    if (!path) return false;

    // 「../」や「~」などの親ディレクトリや特殊文字は許可しない
    if (path.includes("..") || path.includes("~")) {
      return false;
    }

    // 拡張子チェック
    const allowedImageExt = ["png", "jpg", "jpeg", "gif", "webp"];
    const allowedAudioExt = ["mp3", "wav", "ogg"];
    const dotIndex = path.lastIndexOf(".");
    const ext = dotIndex >= 0 ? path.slice(dotIndex + 1).toLowerCase() : "";
    return allowedImageExt.includes(ext) || allowedAudioExt.includes(ext);
  }
}
