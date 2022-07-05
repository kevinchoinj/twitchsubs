import { linkRenderer, moneyRenderer, numberRenderer } from "components/Cells";

export const LOADING_MESSAGE = "Loading Data for 4000+ streamers...";
export const HEADER_MESSAGE =
  "Information about earnings (subscriptions/bits) from Twitch and (a few large) donations that channels have accrued over the last 30 days. All columns recording monetary value are in US dollars. In the case of multiple channels having the same donations account (e.g. main/alt channels), sum up the values. Information is refreshed every ~15 minutes.";

export const possibleColors = [
  "#f6c85f",
  "#F22613",
  "#C8F7C5",
  "green",
  "#E0FFFF",
  "#FFFACD",
  "#FF8C00",
  "#00AA00",
  "pink",
  "purple",
];

export const initialColumnsVisible = {
  channel: true,
  estimated_earnings: true,
  recorded_subs: false,
  estimated_subs: true,
  bits: true,
  bits_from_extensions: false,
  recorded_prime_subs: true,
  gifted_by_broadcaster_tier1_subs: false,
  gifted_tier1_subs: false,
  gifted_tier2_subs: false,
  gifted_tier3_subs: false,
  recorded_tier1_subs: false,
  recorded_tier2_subs: false,
  recorded_tier3_subs: false,
  msgs: true,
  percentage_gifted: true,
};

export const visibleColumnsArray = [
  {
    label: "Channel",
    dataKey: "channel",
    cellRenderer: linkRenderer,
  },
  {
    label: "Earnings (30 days)",
    dataKey: "estimated_earnings",
    cellRenderer: moneyRenderer,
  },
  {
    label: "Rec. Subs",
    dataKey: "recorded_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Est. Subs",
    dataKey: "estimated_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Bits",
    dataKey: "bits",
    cellRenderer: numberRenderer,
  },
  {
    label: "Bits from Ext.",
    dataKey: "bits_from_extensions",
    cellRenderer: numberRenderer,
  },
  {
    label: "Prime Subs",
    dataKey: "recorded_prime_subs",
    cellRenderer: numberRenderer,
  },
  //hidden
  {
    label: "By Streamer",
    dataKey: "gifted_by_broadcaster_tier1_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Gifted T1",
    dataKey: "gifted_tier1_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Gifted T2",
    dataKey: "gifted_tier2_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Gifted T3",
    dataKey: "gifted_tier3_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "T1 Subs",
    dataKey: "recorded_tier1_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "T2 Subs",
    dataKey: "recorded_tier2_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "T3 Subs",
    dataKey: "recorded_tier3_subs",
    cellRenderer: numberRenderer,
  },
  {
    label: "Messages",
    dataKey: "msgs",
    cellRenderer: numberRenderer,
  },
  {
    label: "% Gifted",
    dataKey: "percentage_gifted",
    cellRenderer: numberRenderer,
  },
];
