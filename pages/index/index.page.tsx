import { Counter } from "@components/Counter";

export { Page };
export const documentProps = {
  // title 和 description 会覆盖默认值
  title: "Welcome Moon Catcher!",
};

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
