import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Home.less";
import { UserInfo } from "@/types";
import { THEME_INFO, USER_INFO } from "@/constant/api";
import { observer } from "mobx-react";
import { useCounter } from "@/providers/CounterProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useProject } from "@/providers/ProjectProvider";
import ProjectList from "../../components/ProjectList";
import { getAccessToken } from "@/api/github";
const postUserInfo = async () => {
  return await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const postTheme = async () => {
  return await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const Home = () => {
  const { changeUser, userInfo, login, logout, loading } = useAuth();
  const [loginUser, setLoginUser] = useState("");
  const [counterNumber, setCounterNumber] = useState<number | string>("");
  const [counterXNumber, setCounterXNumber] = useState<number | string>("");
  const [toChangUserName, setToChangUserName] = useState(userInfo.name ?? "");
  const [toChangeUserDashboard, setToChangeDashboard] = useState(
    userInfo.dashboard?.join(",") ?? ""
  );

  const { background } = useTheme();

  const navigate = useNavigate();

  // 不要解构使用action 等方法
  const counterStore = useCounter();

  const { projectList, projectInfo, changeProject } = useProject();

  const queryClient = useQueryClient();
  // 修改
  const mutation = useMutation<boolean, Error, UserInfo>({
    mutationFn: postUserInfo,
    // onMutate(variables) {
    //   queryClient.setQueryData<UserInfo>([USER_INFO, userInfo.name], (preUserInfo) =>
    //     Object.assign({}, preUserInfo, { dashboard: variables })
    //   )
    // },
    onSuccess: (_data, variables) => {
      // 错误处理和刷新
      // 从后台获取
      // queryClient.invalidateQueries([USER_INFO, userInfo.name])
      // 前端直接改
      queryClient.setQueryData<UserInfo>(
        [USER_INFO, userInfo.name],
        (preUserInfo) => Object.assign({}, preUserInfo, variables)
      );
    },
  });

  const themeMutation = useMutation<boolean, Error, { background: string }>({
    mutationFn: postTheme,
    onMutate(variables) {
      queryClient.setQueryData<{ background: string }>(
        [THEME_INFO, userInfo.name],
        (oldTheme) => Object.assign({}, oldTheme, variables)
      );
    },
    onSuccess: (_data, variables) => {
      // 错误处理和刷新
      // 从后台获取
      // queryClient.invalidateQueries([THEME_INFO, userInfo.name])

      // 目前前端直接改
      queryClient.setQueryData<{ background: string }>(
        [THEME_INFO, userInfo.name],
        (oldTheme) => Object.assign({}, oldTheme, variables)
      );
    },
  });

  useEffect(() => {
    setToChangUserName(userInfo.name ?? "");
    setToChangeDashboard(userInfo.dashboard?.join(",") ?? "");
  }, [userInfo]);

  useEffect(() => {
    setCounterXNumber(counterStore.value);
  }, [counterStore.value]);

  const navLinkClass = useCallback(
    ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
      isPending ? "pending" : isActive ? "active" : "",
    []
  );

  console.log(loading, "loading");

  return (
    <div>
      首页 用户:{userInfo?.name ?? (loading && "正在校验登录状态...")}
      <div style={{ background }}>
        <NavLink className={navLinkClass} to="/">
          <button>to React Lazy Demo</button>
        </NavLink>
        <input
          value={loginUser}
          onChange={(event) => setLoginUser(event.target.value)}
        />
        <span>
          {/* <a href={authorizeUrl}> */}
          <button onClick={() => login(loginUser)}>dev登录github</button>
          <button
            onClick={() => {
              getAccessToken("2222222", "333333");
            }}
          >
            请求
          </button>
          {/* </a> */}
        </span>
        <button onClick={() => logout()}>退出登录</button>
        <div style={{ marginTop: 20 }}>
          <div>
            <div>
              <NavLink className={navLinkClass} to="/home/dashboard/1">
                <button>dashboard1</button>
              </NavLink>
              <br />
              <NavLink className={navLinkClass} to="/home/dashboard/2">
                <button>dashboard2</button>
              </NavLink>
              <br />
              <NavLink className={navLinkClass} to="/home">
                <button>返回</button>
              </NavLink>
            </div>
            <div style={{ marginTop: 10 }}>
              项目选择 :
              <select
                value={projectInfo.id ? projectInfo.id : undefined}
                onChange={(event) => changeProject(Number(event.target.value))}
              >
                {projectList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div>
              <div>
                变更背景色
                <input
                  type="divor"
                  onChange={(e) => {
                    themeMutation.mutate({ background: e.target.value });
                  }}
                />
              </div>
              <div>
                变更用户 :
                <input
                  placeholder="用户Id..."
                  value={toChangUserName}
                  onChange={(e) => setToChangUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter" && toChangUserName) {
                      changeUser(toChangUserName);
                    }
                  }}
                />
                <button onClick={() => changeUser(toChangUserName)}>
                  确认
                </button>
              </div>
              <div>
                变更Dashboard权限 :
                <input
                  placeholder="权限Id,用','隔开"
                  value={toChangeUserDashboard}
                  onChange={(e) => setToChangeDashboard(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      mutation.mutate({
                        dashboard:
                          toChangeUserDashboard
                            .split(",")
                            .filter((item) => item)
                            .map(Number) ?? [],
                      });
                    }
                  }}
                />
                <button
                  onClick={() =>
                    mutation.mutate({
                      dashboard:
                        toChangeUserDashboard
                          .split(",")
                          .filter((item) => item)
                          .map(Number) ?? [],
                    })
                  }
                >
                  确认
                </button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <span>跳转CounterPage(组件内mobx) : </span>
                <input
                  type="number"
                  value={counterNumber}
                  onChange={(e) => {
                    setCounterNumber(
                      e.target.value ? Number(e.target.value) : ""
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      navigate(`/home/counter/${counterNumber}`);
                    }
                  }}
                />
                <NavLink
                  className={navLinkClass}
                  to={`/home/counter/${counterNumber}`}
                >
                  <button>跳转</button>
                </NavLink>
              </div>
              <div>
                <span>跳转CounterXPage(领域/全局mobx) : </span>
                <input
                  type="number"
                  value={counterXNumber}
                  onChange={(e) => {
                    setCounterXNumber(
                      e.target.value ? Number(e.target.value) : ""
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      navigate(`/home/counterX/${counterXNumber}`);
                    }
                  }}
                />
                <NavLink
                  className={navLinkClass}
                  to={`/home/counterX/${counterXNumber}`}
                >
                  <button>跳转</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background, marginTop: 20 }}>
        <ProjectList />
      </div>
      <div style={{ background, marginTop: 20 }}>
        <Suspense fallback="loading...">
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default observer(Home);
