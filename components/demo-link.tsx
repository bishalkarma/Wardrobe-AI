"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type DemoLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

function toDemoHref(href: string): string {
  if (href === "/welcome" || href === "/demo" || href.startsWith("/demo/")) return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? "/demo" : `/demo${href}`;
}

/** Prefix internal prototype navigation so mock pages never enter account routes. */
export function DemoLink({ href, ...props }: DemoLinkProps) {
  return <Link href={toDemoHref(href)} {...props} />;
}
