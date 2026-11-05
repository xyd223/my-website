'use client'; // 这是一个需要交互的客户端组件（点击、状态变化）

import { useState, useRef, useEffect } from 'react';

/* =========================================================
   星星的初始布局
   用百分比定位，让它们在天空里零散分布；
   size 控制大小，delay 让每颗星闪烁节奏错开，更自然。
   ========================================================= */
const STARS = [
  { id: 1, top: '14%', left: '10%', size: 16, delay: '0s' },
  { id: 2, top: '22%', left: '82%', size: 12, delay: '0.6s' },
  { id: 3, top: '12%', left: '55%', size: 10, delay: '1.1s' },
  { id: 4, top: '34%', left: '28%', size: 14, delay: '0.3s' },
  { id: 5, top: '30%', left: '68%', size: 11, delay: '1.4s' },
  { id: 6, top: '46%', left: '88%', size: 13, delay: '0.9s' },
  { id: 7, top: '52%', left: '6%',  size: 12, delay: '1.8s' },
  { id: 8, top: '70%', left: '76%', size: 15, delay: '0.4s' },
  { id: 9, top: '80%', left: '20%', size: 11, delay: '1.2s' },
  { id: 10, top: '64%', left: '46%', size: 10, delay: '2.0s' },
];

// 解锁所需的连续点击次数
const UNLOCK_NEED = 3;
// 两次点击之间允许的最大间隔（毫秒）：超过则视为“不连续”，计数归零
const RESET_MS = 2500;

export default function Home() {
  // 已点击次数
  const [clicks, setClicks] = useState(0);
  // 是否已解锁秘密信件
  const [unlocked, setUnlocked] = useState(false);
  // 提示文案
  const [hint, setHint] = useState('试着轻触夜空中的星星……');
  // 记录刚被点击的星星 id，用于播放“放大”动画
  const [popId, setPopId] = useState(null);
  // 计时器引用：用于实现“连续”判定
  const timerRef = useRef(null);

  // 组件卸载时清理计时器，避免内存泄漏
  useEffect(() => () => clearTimeout(timerRef.current), []);

  /* 处理星星点击：核心交互逻辑 */
  function handleStarClick(starId) {
    if (unlocked) return; // 已解锁后不再计数

    // 播放点击反馈动画
    setPopId(starId);
    setTimeout(() => setPopId(null), 500);

    // 清除上一次的倒计时（说明用户仍在“连续”点击）
    if (timerRef.current) clearTimeout(timerRef.current);

    const next = clicks + 1;
    setClicks(next);

    if (next >= UNLOCK_NEED) {
      // 达到次数：解锁秘密信件
      clearTimeout(timerRef.current);
      setUnlocked(true);
      setHint('秘密信件已为你点亮 ✨');
      return;
    }

    // 未达次数：更新提示，并启动“连续”倒计时
    setHint(`已经点亮 ${next} 颗星，再轻触 ${UNLOCK_NEED - next} 次……`);
    timerRef.current = setTimeout(() => {
      // 超时未再点击 → 视为不连续，计数归零
      setClicks(0);
      setHint('别着急，慢慢来，再轻触星星试试……');
    }, RESET_MS);
  }

  return (
    <main className="page">
      {/* ---------------- 星点层 ---------------- */}
      <div className="star-layer" aria-hidden="true">
        {STARS.map((s) => (
          <span
            key={s.id}
            className={`star${popId === s.id ? ' pop' : ''}`}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
            onClick={() => handleStarClick(s.id)}
            title="轻触我"
          />
        ))}
      </div>

      {/* ---------------- 来信卡片 ---------------- */}
      <article className="letter-card">
        <span className="letter-stamp">✉ 来自 2036 · 未来邮筒</span>

        <h1 className="letter-title">来自2036年的一封信</h1>

        <div className="letter-body">
          <p>亲爱的你：</p>
          <p>
            当你在夜色里拆开这封信时，大约是 2026 年的某一天吧。我是十年后的你，
            从 2036 年寄来这一封迟到的问候，想轻轻地告诉你一些事。
          </p>
          <p>
            我想说，那些让你辗转难眠的焦虑、那些以为过不去的坎，后来都成了你故事里
            温柔的注脚。你并没有变得无所不能，但你确实，一次比一次更勇敢地走了下去。
          </p>
          <p>
            请记得照顾好自己：好好吃饭，早点休息，允许自己偶尔什么都不做。
            你不需要时刻发光，安静地存在着，本身就很珍贵。
          </p>
          <p>
            此刻抬头看看天上的星星吧——它们一直都在。而我，正站在未来，
            替你确认：一切都会好起来的。
          </p>
        </div>

        <div className="letter-sign">
          爱你的，<br />
          2036 年的你
        </div>

        {/* 引导提示 + 进度点 */}
        <p className="hint">
          {hint} <span className="dot">·</span>
        </p>
        <div className="progress" aria-hidden="true">
          {Array.from({ length: UNLOCK_NEED }).map((_, i) => (
            <span key={i} className={`pip${i < clicks ? ' on' : ''}`} />
          ))}
        </div>
      </article>

      {/* ---------------- 秘密信件弹层（解锁后显示） ---------------- */}
      {unlocked && (
        <div className="secret-overlay" onClick={(e) => {
          // 点击遮罩空白处也可关闭
          if (e.target === e.currentTarget) setUnlocked(false);
        }}>
          <div className="secret-card">
            <div className="secret-emoji">🌟</div>
            <h2 className="secret-title">一封偷偷藏起来的信</h2>
            <div className="secret-body">
              <p>
                嘘——这是 2036 年的我，单独留给你的小秘密。
              </p>
              <p>
                其实你后来真的成为了那个想成为的人。不是因为突然开挂，
                而是因为你从未真正放弃过。
              </p>
              <p>
                把这句话收好：你比自己以为的，要温柔，也要强大得多。
                晚安，也早安。
              </p>
            </div>
            <button className="secret-close" onClick={() => setUnlocked(false)}>
              收好这封信
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
