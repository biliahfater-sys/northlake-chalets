"use client";

import Script from "next/script";
import { useCookieConsent } from "@/lib/cookie-consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

/**
 * Privacy-light analytics — nothing loads unless the env vars are set, so
 * the default build ships zero trackers. Clarity for session insight,
 * PostHog (EU host) for product analytics.
 *
 * 152-ФЗ: analytics cookies are loaded ONLY after the visitor accepts them
 * in the cookie banner. Until then (or if they choose "necessary only"),
 * no tracker is injected.
 */
export function Analytics() {
  const consent = useCookieConsent();
  if (consent !== "accepted") return null;

  return (
    <>
      {CLARITY_ID && (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});`}
        </Script>
      )}
      {POSTHOG_KEY && (
        <Script id="posthog" strategy="lazyOnload">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init(${JSON.stringify(POSTHOG_KEY)},{api_host:${JSON.stringify(POSTHOG_HOST)},capture_pageview:true,autocapture:false,disable_session_recording:true});`}
        </Script>
      )}
    </>
  );
}
