# 站点接入与上线检查

## 1. 站点文件改动

| 文件 | 改动 |
| --- | --- |
| `docs/manga/episodes/<slug>/index.md` | 新建：嵌成片视频 + 分镜帧 + 台词 + 样板要点 |
| `website/sidebars.js` | `mangaSidebar` 的 items 追加 `'manga/episodes/<slug>/index'` |
| `docs/manga/overview.md` | 剧集列表表追加一行 Demo / 剧集记录 |
| `examples/<slug>/production/母版.md` | 新建：参数、人设、分镜、素材路径、合成方式、已知偏差 |
| `examples/<slug>/.gitignore` | 新建：排除中间素材（见 `gitignore.template`） |

## 2. Docusaurus / MDX 坑位

- 裸尖括号链接 `<https://...>` 会被当作 JSX 报错；用 Markdown 链接或 `useBaseUrl`。
- frontmatter 的 `description` 若以 `@` 开头，必须用双引号包裹。
- `require('./assets/xx.jpg')` 引用的图片必须真实存在，否则 webpack build 失败。
- 页面视频用 `useBaseUrl('/videos/<slug>.mp4')`；帧图用 `require('./assets/01.jpg').default`。

## 3. 入库与排除清单

入库：

- `docs/manga/episodes/<slug>/`（index、script、prompts、assets JPEG）
- `examples/<slug>/character-ref.json`、`production/subtitles.json`、`production/voice/`、`production/母版.md`
- `website/static/videos/<slug>.mp4`

gitignore 排除：

- `frames/`、`segments/`
- `production/concat.mp4`、`production/final.mp4`、`production/check*.jpg`
- `production/concat.txt`、`production/subtitles.ass`、`production/subtitles.srt`

## 4. 构建、推送与监控

```bash
# 构建验证
cd website && npm run build

# 提交（信息格式：feat: manga <slug> <描述>）
cd ..
git add docs/manga/overview.md website/sidebars.js \
  docs/manga/episodes/<slug>/ examples/<slug>/ \
  website/static/videos/<slug>.mp4
git commit -m "feat: manga <slug> <描述>"
git push origin main

# 监控 CI
gh run list --repo thomaslwq/AIFullStack --limit 3
gh run watch <run-id> --repo thomaslwq/AIFullStack --exit-status
```

## 5. 上线抽查

CI success 后（Pages 发布可能有短暂延迟）：

```bash
# 页面 200
curl -s -o /dev/null -w "%{http_code}\n" --max-time 30 \
  "https://thomaslwq.github.io/AIFullStack/docs/manga/episodes/<slug>/"

# 视频 HEAD：200 且 content-type: video/mp4
curl -sI --max-time 30 \
  "https://thomaslwq.github.io/AIFullStack/videos/<slug>.mp4" \
  | grep -iE "HTTP/2|content-type|content-length"
```

基线地址：

- 页面：`https://thomaslwq.github.io/AIFullStack/docs/manga/episodes/<slug>/`
- 视频：`https://thomaslwq.github.io/AIFullStack/videos/<slug>.mp4`
