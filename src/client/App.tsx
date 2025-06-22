import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import trpcLogo from "./trpc.svg";

export function App() {
  return (
    <div className='app'>
      <div className='logo-container'>
        <img
          src={logo}
          alt='Bun Logo'
          className='logo bun-logo'
        />
        <img
          src={reactLogo}
          alt='React Logo'
          className='logo react-logo'
        />
        <img
          src={trpcLogo}
          alt='TRPC Logo'
          className='logo trpc-logo'
        />
      </div>

      <h1>Bun + React + tRPC</h1>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <APITester />
    </div>
  );
}

export default App;
