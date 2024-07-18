// 從 CDN 引入 Supabase JavaScript SDK，這裡使用的是 ES 模塊格式
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 定義 Supabase 的 URL 和公開 API 金鑰
// 替換為你的 Supabase 專案 URL
const supabaseUrl = 'https://dezqwfuwenaamcrvgkid.supabase.co'; 
// 替換為你的公開 API 金鑰
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlenF3ZnV3ZW5hYW1jcnZna2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxMDQwNTUsImV4cCI6MjAzNTY4MDA1NX0.nedA5GmaM5jSNVSkxU772Y90mQMaw7e7h7LbSWtV1Ao';

// 使用 URL 和金鑰初始化 Supabase 客戶端
const supabase = createClient(supabaseUrl, supabaseKey);

// 獲取訪問者 IP 地址
async function getVisitorIp() {
  const this_ip = await fetch('https://api.ipify.org?format=json').then(response => response.json()).then(json => console.log(json.ip))
  return this_ip
}

// 定義一個函數來記錄用戶的登入信息
async function recordLogin(userip) {
  // 使用 Supabase 客戶端將登入信息插入到 logins 資料表中
  const { data, error } = await supabase
    .from('h_visitor_log') // 指定要插入的資料表
    .insert([ // 插入一條新的記錄
      { ip: userip, lm_time: new Date().toISOString(),count:1 } // 設定用戶ID和登入時間
    ]);            

  // 檢查是否有錯誤
  if (error) {
    console.error('Error recording login:', error); // 如果有錯誤，輸出錯誤信息
  } else {
    console.log('Login recorded successfully:', data); // 如果成功，輸出成功信息
  }
}

// 定義一個用戶登入的函數
async function userLogin() {
  // 模擬獲取用戶唯一標識，實際應用中這應該從用戶登入系統獲取
  const userip = getVisitorIp();

  // 調用 recordLogin 函數來記錄登入信息
  await recordLogin(userip);
}

// 當 DOM 內容加載完成後綁定事件
document.addEventListener('DOMContentLoaded', (event) => {
  // 為登入按鈕綁定點擊事件處理器
  document.getElementById('loginButton').addEventListener('click', userLogin);
});
