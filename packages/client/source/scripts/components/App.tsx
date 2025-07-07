import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import { Global } from "@emotion/react";
// import history from 'history/browser';

import Home from './Home';
import Authentication from './Authentication.tsx';
import Scene from "./3d/Scene.tsx";
import UltraHDRViewer from './3d/UltraHDRViewer.tsx';
import UltraHDR from './3d/UltraHDR.tsx';
import ThreeDLogo from "./3d/ThreeDLogo.tsx";
import Logo from "./3d/Logo.tsx";
import SkyComponent from './3d/Sky.tsx';
import Ocean from './3d/Ocean.tsx';
import KTX2 from './3d/KTX2.tsx';
import AI from './AI';
// import Contact from './Contact';
import Registration from './Registration.tsx';
// import SignIn from './SignIn';
import Resume from './Resume';
// import Navigation from './Navigation';
import NotFound from './NotFound';
import { GlobalProvider } from '../context/globalstate';

import GlobalStyle from "../../styles/globalstyle.ts";

const App: React.FunctionComponent = () => {
  // let history = useHistory();
  // let location = history.location;

  // let unlisten = history.listen(({location, action}) => {
  //     console.log(action, location.pathname, location.state);
  // });
  // unlisten();
  useEffect(() => {
    console.log(window.location.host)
    if (window.location.host ==='aestheticharmony.art') {
      document.title = "Aesthetic Harmony";
    } else if (window.location.host === 'peacefulstar.art') {
      document.title = "Peaceful Star";
    }
  }, []);

  return (
    <>
      {/*<header>*/}
      {/*  <Navigation/>*/}
      {/*</header>*/}
      <Global styles={GlobalStyle} />
      <main>
        <GlobalProvider>
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/authentication'} element={<Authentication />} />
            <Route path="/scene" element={<Scene />} />
            <Route path="/texture" element={<UltraHDRViewer />} />
            <Route path="/ultrahdr" element={<UltraHDR />} />
            <Route path='/3dlogo' element={<ThreeDLogo />} />
            <Route path={'/sky'} element={<SkyComponent />} />
            <Route path={'/logo'} element={<Logo />} />
            <Route path={'/ocean'} element={<Ocean />} />
            <Route path={'/ktx2'} element={<KTX2 />} />
            {/*<Route path={'/panorama'} element={<VideoPanoramaViewer />} />*/}
            <Route path={'/ai'} element={<AI />} />
            {/*<Route path={'/contact'} element={<Contact />} />*/}
            <Route path={'/registration'} element={<Registration />} />
            {/*<Route path={'/signin'} element={<SignIn />} />*/}
            <Route path={'/resume/:id'} element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GlobalProvider>
      </main>
    </>
  );
};

export default App;
