"use client";
import { useMap } from "@/app/components/(map)/map";
import { useGameInfoStore, useSettingsStore } from "@/app/lib/storage";
import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { shallow } from "zustand/shallow";

export default function MapContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const { lockedWindow, mapTransform, setMapTransform } = useSettingsStore(
    (state) => ({
      lockedWindow: state.lockedWindow,
      mapTransform: state.mapTransform,
      setMapTransform: state.setMapTransform,
    }),
    shallow
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const moveableRef = useRef<Moveable>(null);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);
  useEffect(() => {
    if (!isOverlay) {
      return;
    }
    moveableRef.current?.moveable.request(
      "draggable",
      { deltaX: 0, deltaY: 0 },
      true
    );

    const onResize = () => {
      // @ts-ignore
      moveableRef.current?.moveable.request(
        "draggable",
        { deltaX: 0, deltaY: 0 },
        true
      );
    };
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize, true);
    };
  }, []);

  if (!isOverlay) {
    return children;
  }
  return (
    <>
      <div
        ref={mapContainerRef}
        className={`absolute inset-0 top-[30px] m-2 `}
        style={mapTransform}
      >
        {!lockedWindow && (
          <div className="absolute -top-6 right-0 flex w-fit rounded-t-lg bg-opacity-50 bg-neutral-800 ml-auto text-neutral-300">
            <div className="cursor-move flex items-center p-1">
              <svg className="w-[16px] h-[16px]">
                <use xlinkHref="#icon-move" />
              </svg>
            </div>
            <div
              className="cursor-pointer flex items-center p-1"
              onClick={() => setIsEditMode((isEditMode) => !isEditMode)}
            >
              <svg className="w-[16px] h-[16px]">
                <use xlinkHref="#icon-resize" />
              </svg>
            </div>
          </div>
        )}
        {children}
      </div>
      {!lockedWindow && (
        <Moveable
          ref={moveableRef}
          target={mapContainerRef}
          draggable
          resizable={isEditMode}
          hideDefaultLines
          bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
          snappable
          origin={false}
          onDrag={(e) => {
            if (
              e.inputEvent &&
              e.inputEvent.type === "mousemove" &&
              e.inputEvent.srcElement?.tagName === "CANVAS"
            ) {
              return;
            }
            e.target.style.cssText += e.cssText;
          }}
          onResize={(e) => {
            e.target.style.cssText += e.cssText;
          }}
          onRenderEnd={(e) => {
            setMapTransform({
              transform: e.target.style.transform,
              width: e.target.style.width,
              height: e.target.style.height,
            });
            map?.invalidateSize();
          }}
        />
      )}
    </>
  );
}
