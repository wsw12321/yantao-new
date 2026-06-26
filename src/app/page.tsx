import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Compass, Sparkles, UsersRound } from 'lucide-react';

function SectionCard({
  id,
  icon,
  title,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 glass-panel rounded-xl p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          {icon}
        </span>
        <h2 className="m-0 text-2xl font-black text-slate-900">{title}</h2>
      </div>
      <div className="content-prose">{children}</div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="grid items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <div className="content-prose">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Seminar Physics Club
          </div>
          <h1>研讨物理社</h1>
          <p className="text-xl font-semibold text-slate-600">
            一个唯心的唯物主义社团，面向所有喜爱物理并想要讨论的学生开放。
          </p>
          <p>
            社名中的“研讨”二字，寓意着社团轻松的讨论氛围和过硬的专业素养。无论你的成绩如何、来自哪所学校，只要对物理抱有热情，这里都欢迎你的加入。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#contact"
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              关注我们
            </Link>
            <Link
              href="/dashboard"
              className="focus-ring inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            >
              用户中心
            </Link>
          </div>
        </div>

        <div className="grid items-start gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-xl p-4">
            <Image
              src="/images/logo-bw.png"
              alt="研讨物理社社徽 - 黑白经典"
              width={520}
              height={520}
              priority
              className="h-auto w-full rounded-lg"
            />
          </div>
          <div className="glass-panel rounded-xl p-4 sm:mt-12">
            <Image
              src="/images/mascot-xuankui.png"
              alt="研讨物理社吉祥物 - 璇夔"
              width={520}
              height={520}
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <SectionCard id="members" icon={<UsersRound className="h-5 w-5" />} title="发展历史与核心成员">
          <p>
            物理社最初由三水丁提出概念，研讨元年（公元2023年），五水牵头正式成立了研讨物理社。在社团内部，历届社长被称为“夸克”，而现任社长与副社长被称为“基本粒子”。
          </p>
          <ul>
            <li><strong>初代夸克（22级社长）</strong>：五水 / 5H2O。社团创始人，计算机实力强劲，现就读于中科大。确立社团理念，奠定社团基石。非常热心，经常在群里解答问题。他曾为物理社编写了小游戏和开启动画。这个网站也是他写的。</li>
            <li><strong>二代夸克（23级社长）</strong>：三水丁 / yt。不仅参与了社名构想，还亲自完善并绘制了各版本的社徽终稿。她曾在社课上为社员讲解相对论知识。</li>
            <li><strong>三代夸克（24级社长）</strong>：六分仪 / 667 / RQ。极大地繁荣了管理层架构，建立了社长部、高一/高二副社部以及荣誉副社部。他极具热情，曾凭一己之力招收到近200名新生，推动了社团的飞速发展。</li>
          </ul>
        </SectionCard>

        <SectionCard icon={<Compass className="h-5 w-5" />} title="视觉标识">
          <div className="grid gap-5 md:grid-cols-2">
            <figure className="rounded-xl border border-slate-200 bg-white p-4">
              <Image
                src="/images/logo-bw.png"
                alt="研讨物理社社徽 - 经典黑白"
                width={720}
                height={720}
                className="mx-auto h-auto max-h-80 w-auto rounded-lg"
              />
              <figcaption className="mt-3 text-sm font-semibold text-slate-500">社徽 - 经典黑白</figcaption>
            </figure>
            <figure className="rounded-xl border border-slate-200 bg-white p-4">
              <Image
                src="/images/logo-color.png"
                alt="研讨物理社社徽 - 炫彩渐变"
                width={720}
                height={720}
                className="mx-auto h-auto max-h-80 w-auto rounded-lg"
              />
              <figcaption className="mt-3 text-sm font-semibold text-slate-500">社徽 - 炫彩渐变</figcaption>
            </figure>
          </div>
          <p>
            社徽由三水丁设计并完善。左侧形似字母“Y”，代表受力分析图和坐标系；中间是一个静止在斜坡上的小滑块；右侧形似字母“T”。整体合起来代表“YT”（研讨）。
          </p>
          <figure className="rounded-xl border border-slate-200 bg-white p-4">
            <Image
              src="/images/logo-char.png"
              alt="研讨物理社文字LOGO"
              width={1200}
              height={520}
              className="h-auto w-full rounded-lg"
            />
            <figcaption className="mt-3 text-sm font-semibold text-slate-500">
              文字 LOGO 由 25级小翊书绘制。简洁的线条和现代感的字体，体现了社团的专业性和活力。
            </figcaption>
          </figure>
          <figure className="rounded-xl border border-slate-200 bg-white p-4">
            <Image
              src="/images/mascot-xuankui.png"
              alt="研讨物理社吉祥物 - 璇夔"
              width={900}
              height={900}
              className="mx-auto h-auto max-h-[36rem] w-auto rounded-lg"
            />
            <figcaption className="mt-3 text-sm font-semibold text-slate-500">
              吉祥物名为《璇夔》（xuan kui），由25级张子谦同学绘制。
            </figcaption>
          </figure>
        </SectionCard>

        <SectionCard id="courses" icon={<BookOpen className="h-5 w-5" />} title="社团特色文化">
          <ul>
            <li><strong>包容与“抽象”</strong>：社团允许大家“玩抽象”，没有入社考核，鼓励大家放下顾虑，大胆放飞想象力。</li>
            <li><strong>纯粹的讨论空间</strong>：为了防止轻松愉快的讨论氛围被破坏，社群内禁止家长进入。在这里，任何经过思考提出的问题都有其存在的价值，不要因为觉得问题傻而放弃讨论。</li>
            <li><strong>唯心的唯物主义</strong>：物理的本质是人类对已有现象进行解释，本质上还是自己对现象的理解，所以带着一种“唯心”的浪漫色彩。</li>
            <li><strong>盛产副社</strong>：这是物理社的一大传统特色。</li>
          </ul>
        </SectionCard>

        <SectionCard id="contact" icon={<Sparkles className="h-5 w-5" />} title="关注我们">
          <ul>
            <li><strong>Bilibili频道</strong>：关注 <a className="font-black text-blue-700 hover:underline" href="https://space.bilibili.com/3632303861401731">研讨物理社</a>，这里会发布社团动态、宣传视频以及社课录像。</li>
            <li><strong>QQ资源群</strong>：群号 <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-blue-700">825345512</code>，群内会发布社团相关的文档资源（包括PPT、视频、题目、海报等）。</li>
            <li><strong>微信交流群</strong>：包含大群和高一传承群。</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
