"use client";
import { I18NProvider } from "@/app/components/(i18n)/i18n-provider";
import Map from "@/app/components/(map)/map";
import Nodes from "@/app/components/(map)/nodes";
import Territories from "@/app/components/(map)/territories";
import Tiles from "@/app/components/(map)/tiles";
import Menu from "@/app/components/menu";
import Search from "@/app/components/search";
import SearchParams from "@/app/components/search-params";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/app/lib/i18n";
import { useGameInfoStore, useSettingsStore } from "@/app/lib/storage";
import { useEffect, useState } from "react";
import Ads from "../components/ads";
import AppContainer from "../components/app-container";
import Header from "../components/header";
import MapContainer from "../components/map-container";
import Player from "../components/player";
import ResizeBorders from "../components/resize-borders";
import TraceLine from "../components/trace-line";
import { WINDOWS } from "../lib/config";
import { waitForOverwolf } from "../lib/overwolf";
import { getCurrentWindow } from "../lib/windows";

export default function App() {
  const [ready, setReady] = useState(false);
  const locale = useSettingsStore((state) => state.locale);
  const dict = loadDictionary(locale);
  const territory = useGameInfoStore((state) => state.player?.territory);
  const isWorldTerritory = territory !== -1;
  const setIsOverlay = useGameInfoStore((state) => state.setIsOverlay);

  useEffect(() => {
    waitForOverwolf().then(() => {
      getCurrentWindow().then((currentWindow) => {
        setIsOverlay(currentWindow.name === WINDOWS.OVERLAY);
        setReady(true);
      });
    });
  }, []);

  if (!ready) {
    return <></>;
  }

  return (
    <I18NProvider
      value={{
        dict,
        defaultLocale: DEFAULT_LOCALE,
        locale,
        locales: LOCALES,
      }}
    >
      <AppContainer>
        <Header />
        <MapContainer>
          <Map>
            {isWorldTerritory && (
              <>
                <Tiles />
                <Territories />
                <Nodes />
              </>
            )}
            <Player />
            <TraceLine />
          </Map>
        </MapContainer>
        <Search />
        <Menu />
        <SearchParams />
      </AppContainer>
      <ResizeBorders />
      <Ads />
    </I18NProvider>
  );
}
