"use client";

import RouteError from "@/components/common/RouteError";

export default function Error(props) {
  return <RouteError {...props} scope="(auth)" />;
}
