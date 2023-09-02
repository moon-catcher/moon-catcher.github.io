import { useRouteError } from "react-router";

const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  return <>{error.message}</>;
};
export default ErrorBoundary;
