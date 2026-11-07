# 徽章

## 两类必须分清

- 可当场验证：npm 版本、许可证、GitHub topic。任何时候可加，只要事实成立
- 声称收录状态：`Listed on dsh-plugin.org`。只有详情页返回 200 之后才能加

第二类的徽章 SVG 的 aria-label 与可见文字都在说"已被收录"，链接指向详情页。详情页 404 时加上它，读者点进去看到的是 404，而徽章在声称收录，这是对外不实声明。

## 收录徽章

各家形态不同，共同前提是详情页先返回 200。加之前 curl 一次详情页，再 curl 一次徽章图，两个都绿才写进 README。

dsh-plugin.org：

```
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/<owner>/<slug>)
```

dsh.fish（徽章显示当前 grade，随分数变化）：

```
[![<id> on dsh.fish](https://dsh.fish/a/<id>/badge.svg)](https://dsh.fish/a/<id>)
```

dshopen.org（走 shields 的 endpoint，返回 label/message/color，message 里带喜欢数）：

```
[![Open Plugin Market](https://img.shields.io/endpoint?url=https%3A%2F%2Fdshopen.org%2Fbadge%2F<id>.json%3Flang%3Den)](https://dshopen.org/plugins/<id>)
```

`<owner>`/`<slug>`/`<id>` 都从收录后的详情页地址取。dsh-plugin.org 的 owner 在 URL 里是小写，徽章链接也要跟着小写，否则 301 之后才算命中。

站点原文把加徽章这件事排在"插件被收录后"，顺序不是建议。

## 可验证徽章

```
[![npm](https://img.shields.io/npm/v/<包名>.svg?style=flat-square)](https://www.npmjs.com/package/<包名>)
[![license](https://img.shields.io/npm/l/<包名>.svg?style=flat-square)](./LICENSE)
[![topic](https://img.shields.io/badge/topic-dsh--plugin-0e7490.svg?style=flat-square)](https://github.com/topics/dsh-plugin)
```

只有 npm 徽章需要包已发布。topic 徽章只要求仓库有该 topic，与是否收录无关。

## 收录未通过时的替代

要展示参与了这条通道但还没被收录，用中性的说法：文案写 `DSH Plugin` 而非 `Listed on`，链接指向自己的仓库或提交的 Issue，不声称收录。这样不会撒谎，但也起不到"已被收录"的展示作用，通常不如等收录后一次到位。
