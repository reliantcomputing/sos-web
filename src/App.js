import { Provider } from "react-redux";

import Store from "./redux-helpers/Store";
import Main from "./pages/Main";
import "react-tabs/style/react-tabs.css";

const App = () => {
    return (
        <Provider store={Store}>
            <Main />
        </Provider>
    );
};

export default App;
