import { useMap } from "@/app/components/(map)/map";
import { useGameInfoStore, useSettingsStore } from "@/app/lib/storage";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
// import {
//   GameSession,
//   addTraceLineItem,
//   getLatestGameSession,
// } from "../lib/game-sessions";

function createCircle(position: { x: number; y: number; z: number }) {
  return leaflet.circle([position.y, position.x] as [number, number], {
    radius: 0,
    interactive: false,
    color: "#8a8374",
  });
}

export default function TraceLine() {
  const map = useMap();
  const player = useGameInfoStore((state) => state.player);
  const lastPosition = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const layerGroup = useRef<leaflet.LayerGroup | null>(null);
  const unknownLayerGroup = useRef<leaflet.LayerGroup | null>(null);
  const settingsStore = useSettingsStore();

  useEffect(() => {
    layerGroup.current = new leaflet.LayerGroup();
    unknownLayerGroup.current = new leaflet.LayerGroup();

    // getLatestGameSession().then(gameSession => {
    //    gameSession.traceLine.forEach((position) => {
    //   const circle = createCircle(position);
    //   circle.addTo(layerGroup.current!);
    // });
    // });
  }, []);

  useEffect(() => {
    if (!settingsStore.showTraceLine) {
      return;
    }
    const targetLayerGroup =
      player?.territory === -1
        ? unknownLayerGroup.current!
        : layerGroup.current!;

    targetLayerGroup.addTo(map);

    return () => {
      targetLayerGroup.removeFrom(map);
      if (player?.territory === -1) {
        targetLayerGroup.clearLayers();
      }
    };
  }, [settingsStore.showTraceLine, player?.territory]);

  useEffect(() => {
    if (!player?.position) {
      return;
    }
    const targetLayerGroup =
      player.territory === -1
        ? unknownLayerGroup.current!
        : layerGroup.current!;
    if (
      Math.abs(player.position.x - lastPosition.current.x) > 0.05 ||
      Math.abs(player.position.y - lastPosition.current.y) > 0.05
    ) {
      const circle = createCircle(player.position);
      circle.addTo(targetLayerGroup);
      lastPosition.current = player.position;
      // addTraceLineItem(player.position);
    }
  }, [player?.position]);

  return <></>;
}
