"use client";
import { Stream } from "@cloudflare/stream-react";
import React from "react";

const VideoComponent = () => {
  return (
    <div className="mx-auto my-8 max-w-xl">
      <Stream controls src="f92a49f99118bb24aa138cc048c2c8c7" />
    </div>
  );
};

export default VideoComponent;
