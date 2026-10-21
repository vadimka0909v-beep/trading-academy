import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import "./ta.css";
import { Provider } from "./components/provider";
import { Shell } from "./components/shell";
import Home from "./pages/home";
import Course from "./pages/course";
import LessonPage from "./pages/lesson";
import Practice from "./pages/practice";
import Glossary from "./pages/glossary";
import Profile from "./pages/profile";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

// Hash-роутинг: работает на GitHub Pages и любом статическом хостинге без настройки сервера.
function App() {
  return (
    <Provider>
      <Router hook={useHashLocation}>
        <Shell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/course" component={Course} />
            <Route path="/lesson/:id" component={LessonPage} />
            <Route path="/practice" component={Practice} />
            <Route path="/glossary" component={Glossary} />
            <Route path="/profile" component={Profile} />
            <Route>
              <div className="py-16 text-center">
                <p className="text-lg font-semibold">Страница не найдена</p>
              </div>
            </Route>
          </Switch>
        </Shell>
      </Router>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
