import { usePageContext } from "./usePageContext";

export { Link };

function Link(props: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const className = [
    props.className,
    pageContext.urlPathname === props.href && "is-active",
  ]
    .filter(Boolean)
    .join(" ");
  // const [href, setHref] = useState(props.href);
  // const showMenu = useContext(LightSidebarContext);
  // useEffect(() => {
  //   const href = location?.search.includes("?menu")
  //     ? props.href + "?menu"
  //     : props.href;
  //   setHref(href);
  // }, [props.href, showMenu]);
  // console.log(href, "href");
  return <a {...props} className={className} />;
}
