---
title: MatNoble-TTS (全栈 AI 语音处理平台与配音导演 Skill)
description: 基于 Cloudflare Workers 的全栈 AI 语音处理平台，集成文字转语音（TTS）、语音转文字（STT）、D1 额度流控与 AI 配音导演智能体（Audio Director Skill 2.0）。
breadcrumb: MatNoble-TTS
head:
  - - meta
    - name: keywords
      content: MatNoble-TTS, 文字转语音, TTS, STT, Cloudflare Workers, Edge-TTS, AI配音导演, Agent Skill, D1数据库, 语音合成
---

# 🎙️ MatNoble-TTS

> 基于 Cloudflare Workers 的全栈 AI 语音处理平台，集成文字转语音（TTS）、语音转文字（STT）、D1 额度鉴权与 **AI 配音导演智能体（Audio Director Skill 2.0）**。

- 🌐 **在线体验**：[https://speak.matnoble.top](https://speak.matnoble.top)
- ⚡ **开源 Skill 仓库**：[MatNoble/matnoble-tts-skill](https://github.com/MatNoble/matnoble-tts-skill)
- 📦 **技术栈**：`Cloudflare Workers` · `Cloudflare D1` · `React 19` · `TypeScript` · `Python`

---

## 🌟 核心特性

- 🗣️ **高品质文字转语音 (TTS)**
  - 语音引擎基于 Microsoft Edge TTS 服务，内置 20+ 种高拟真 Neural 语音（晓晓、云希、云扬、云健、晓涵等）。
  - 支持语速 (`0.5x ~ 2.0x`)、音调、音量及多种情绪风格（新闻、客服、助理、聊天等）。
  - 支持原生 SSML 直通与轻量级**行内语音指令**（如 `[pause:500ms]`、`[emphasis:strong]`、`[say-as]`、`[sub]`）。

- 🎬 **AI 配音导演与发音防护 (Director 2.0)**
  - **7 步决策引擎**：体裁识别 $\rightarrow$ 角色参数矩阵 $\rightarrow$ 文本预处理 $\rightarrow$ 导演语义润色 $\rightarrow$ SSML 编排 $\rightarrow$ 质量门禁 $\rightarrow$ 合成交付。
  - **文本规范化 (NSW)**：电话、400 热线、工号数字串、日期、货币与英文缩写自动规范化。
  - **多音字防翻车**：内置 70+ 组中文高频易错词（重新/重量/行业/说服/西藏等）自动注音。
  - **四级韵律启发式留白**：转折词前置呼吸 `[pause:400ms]`、设问悬念留白 `[pause:600ms]`。

- 🎧 **高精度语音转文字 (STT)**
  - 集成硅基流动 SenseVoice API，支持 mp3、wav、m4a、flac 等主流音频格式转写。

- 🔐 **多租户鉴权与每日额度流控**
  - 基于 Cloudflare D1 边缘 SQL 数据库，实现 `vc_` 格式 API Key 验证。
  - 支持按 Key 配置每日调用额度上限，自动按天原子重置，响应头回传实时剩余额度。

---

## 🤖 AI Agent 技能集成 (Skill 2.0)

本项目配套开源了独立的 AI 配音导演技能，赋予 Coding Agent **“专业配音导演”**的能力：

### 1. 一键安装与更新

```bash
# 一键安装至当前环境
npx skills add MatNoble/matnoble-tts-skill

# 更新至最新版本
npx skills update matnoble-tts
```

或克隆至本地 Skills 目录：
```bash
git clone https://github.com/MatNoble/matnoble-tts-skill.git ~/.agents/skills/matnoble-tts
```

### 2. 命令行调用体验

```bash
# 自动文本规范化（NSW）与多音字防护
python3 skill/scripts/tts_client.py --preprocess --text "拨打 13800138000 重新核算重量，工号 9527 调用 API"

# 一键合成高质量 MP3
python3 skill/scripts/tts_client.py --preprocess --auto-prosody --voice "zh-CN-YunxiNeural" --speed 1.08 --text "大家好！欢迎体验 MatNoble-TTS 语音平台！" -o demo.mp3
```

---

## 🔌 API 规范速查

业务接口兼容标准音频格式，支持 API Key 鉴权：

- **请求端点**：`POST https://speak.matnoble.top/v1/audio/speech`
- **鉴权方式**：`Authorization: Bearer vc_your_api_key` *(留空自动使用公共免 Key 通道)*

```bash
curl -X POST "https://speak.matnoble.top/v1/audio/speech" \
  -H "Authorization: Bearer vc_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "大家好！[pause:300ms][emphasis:strong]欢迎使用 MatNoble-TTS 配音服务[/emphasis]。",
    "voice": "zh-CN-YunxiNeural",
    "speed": 1.08,
    "style": "chat"
  }' \
  --output output.mp3
```

---

## 🔗 相关链接

- [🌐 MatNoble-TTS 网页应用](https://speak.matnoble.top)
- [⚡ matnoble-tts-skill 开源仓库](https://github.com/MatNoble/matnoble-tts-skill)
- [🏠 MatNoble 个人门户](https://matnoble.top)
