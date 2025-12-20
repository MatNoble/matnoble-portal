<template>
  <div class="cs-footer">
    <div class="cs-footer-container">
      
      <!-- 网站二维码 -->
      <div class="cs-qr-box">
        <img src="/qrcode_website.png" class="cs-qr-img" />
        <span class="cs-qr-title">扫码访问网站</span>
        <span class="cs-qr-desc">matnoble.top</span>
      </div>

      <!-- 微信公众号二维码 -->
      <div class="cs-qr-box">
        <img src="/qrcode_for_wechat.jpg" class="cs-qr-img" />
        <span class="cs-qr-title">关注微信公众号</span>
        <span class="cs-qr-desc">获取最新教学动态</span>
      </div>

    </div>
    
    <p class="cs-copyright">© 2025 MatNoble. 以数学训练思维，用技术改善学习与生活。</p>
  </div>
</template>

<style scoped>
.cs-footer {
  margin-top: 4rem; 
  border-top: 2px solid #eee; 
  padding-top: 2.5rem; 
  text-align: center;
}

.cs-footer-container {
  display: flex; 
  justify-content: center; 
  align-items: flex-start; 
  gap: 3rem; 
  flex-wrap: wrap;
}

.cs-qr-box {
  border: 1px solid #eee; 
  padding: 12px; 
  border-radius: 8px; 
  background: #fafafa; 
  min-width: 140px;
}

.cs-qr-img {
  width: 100px; 
  height: 100px; 
  object-fit: contain; 
  display: block; 
  margin: 0 auto 8px;
}

.cs-qr-title {
  display: block; 
  font-size: 0.8rem; 
  color: #555; 
  font-weight: bold;
}

.cs-qr-desc {
  display: block; 
  font-size: 0.7rem; 
  color: #999;
}

.cs-copyright {
  margin-top: 2.5rem; 
  font-size: 0.75rem; 
  color: #bbb;
}
</style>
