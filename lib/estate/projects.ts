export type Project = {
  id: string;
  name: string;
  community: string;
  developer: string;
  from: number; // starting price, AED
  plan: string; // e.g. "60/40"
  planNote: string;
  handover: string;
  types: string;
  photo: string;
  highlights: string[];
};

// Sample off-plan projects. Names and numbers are made up to show the layout.
export const PROJECTS: Project[] = [
  { id: "azure-creek", name: "Azure Creek Residences", community: "Dubai Creek Harbour", developer: "Sample Developer", from: 1450000, plan: "60/40", planNote: "60% during construction, 40% on handover", handover: "Q4 2028", types: "1 to 3 bed apartments", photo: "/img/pro/estate/5.jpg", highlights: ["Waterfront promenade", "Infinity pool", "Skyline views"] },
  { id: "marina-crest", name: "Marina Crest Tower", community: "Dubai Marina", developer: "Sample Developer", from: 1950000, plan: "70/30", planNote: "Pay 1% monthly, balance on handover", handover: "Q2 2028", types: "Studio to 2 bed", photo: "/img/pro/estate/2.jpg", highlights: ["Marina views", "Sky lounge", "Direct tram access"] },
  { id: "hills-gardens", name: "Hills Garden Villas", community: "Dubai Hills Estate", developer: "Sample Developer", from: 4300000, plan: "50/50", planNote: "Post-handover plan over 2 years", handover: "Q1 2029", types: "4 and 5 bed villas", photo: "/img/pro/estate/8.jpg", highlights: ["Private pool", "Golf course edge", "Smart home"] },
  { id: "canal-edge", name: "Canal Edge Suites", community: "Business Bay", developer: "Sample Developer", from: 890000, plan: "80/20", planNote: "Low entry, 20% on handover", handover: "Q3 2027", types: "Studio and 1 bed", photo: "/img/pro/estate/6.jpg", highlights: ["Canal frontage", "Co-working floor", "Strong rental yield"] },
  { id: "jvc-park", name: "Park Avenue JVC", community: "JVC", developer: "Sample Developer", from: 640000, plan: "1% monthly", planNote: "1% per month, 40% on handover", handover: "Q2 2027", types: "Studio to 2 bed", photo: "/img/pro/estate/7.jpg", highlights: ["Next to the park", "Gym and pool", "Investor favourite"] },
  { id: "palm-pearl", name: "Palm Pearl Penthouses", community: "Palm Jumeirah", developer: "Sample Developer", from: 12500000, plan: "40/60", planNote: "Flexible plan, private beach access", handover: "Q4 2029", types: "3 and 4 bed penthouses", photo: "/img/pro/estate/12.jpg", highlights: ["Beach access", "Private lift", "Concierge"] },
];
