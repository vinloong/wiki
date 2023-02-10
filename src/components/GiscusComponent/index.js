import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common"; // 导入当前主题API

export default function GiscusComponent() {
  const { colorMode } = useColorMode(); // 获取当前主题
  return (
    // 前面放一个带margin的div，美观
    <div style={{ marginTop: "30px" }}>
      <Giscus
        repo="vinloong/vinloong.github.io"
        repoId="MDEwOlJlcG9zaXRvcnkyMTk2NDg0NTQ="
        category="General"
        categoryId="DIC_kwDODReRxs4CP6qa"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode} 
        lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"   
        async
      />
    </div>
  );
}