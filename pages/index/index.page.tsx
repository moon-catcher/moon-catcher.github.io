import "./index.less";

export { Page };
export const documentProps = {
  // title 和 description 会覆盖默认值
  title: "Welcome Moon Catcher!",
};

function Page() {
  return (
    <>
      欢迎使用MoonCatcher,
      <br />
      这是一个个人博客快速搭建平台,依托于github,完全免费!
      <br />
      点击查看教程
      <br />
      <a href="/blog">效果展示</a>
      <br />
      <a
        target="_blank"
        href="https://github.com/moon-catcher/moon-catcher.github.io" rel="noreferrer"
      >
        查看github源码
      </a>
      <br />
      如何支持我:
      <br />
      给我一个⭐
      <br />或 给我买一杯咖啡!
    </>
  );
}
