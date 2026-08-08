/**
 * Noor-E-Haram Packages Configuration Database
 * Version 2.1.0 (CTO Approved)
 * Central source of truth for pricing, departures, variants, and booking availability windows.
 */

export const PACKAGE_CONFIG = {
  version: "2.1.0",
  lastUpdated: "2026-07-27",
  currency: "INR",
  packages: [
    {
      id: "hajj-2027",
      nameKey: "pkg.hajj.name",       // Hajj 2027
      typeKey: "pkg.hajj.type",       // Hajj Package
      status: "active",
      bookingOpen: "2026-06-01",
      bookingClose: "2027-04-30",
      travelStart: "2027-05-15",
      travelEnd: "2027-06-15",
      badge: "2027",
      featuresKey: "pkg.hajj.features",
      variants: [
        { id: "std", name: "Standard", price: 699786, isStarting: true }
      ],
      waQuery: "Hajj 2027 Package"
    },
    {
      id: "group-mumbai",
      nameKey: "pkg.group.name",      // Group Umrah (Mumbai)
      typeKey: "pkg.group.type",      // Group Package
      status: "active",
      bookingOpen: "2026-08-01",
      bookingClose: "2026-11-15",
      travelStart: "2026-12-01",
      travelEnd: "2026-12-06",
      departureCity: "Mumbai",
      featuresKey: "pkg.group.features",
      variants: [
        { id: "std", name: "Standard", price: 65786, isStarting: true },
        { id: "semi", name: "Semi Deluxe", price: 71786 },
        { id: "deluxe", name: "Deluxe", price: 78786 }
      ],
      waQuery: "Group Umrah Package (Mumbai Departure)"
    },
    {
      id: "group-hubli",
      nameKey: "pkg.group.hubli.name", // Group Umrah (Hubli)
      typeKey: "pkg.group.type",       // Group Package
      status: "active",
      bookingOpen: "2026-08-01",
      bookingClose: "2026-11-15",
      travelStart: "2026-12-01",
      travelEnd: "2026-12-08",
      departureCity: "Hubli",
      featuresKey: "pkg.group.hubli.features",
      variants: [
        { id: "std", name: "Standard", price: 81786, isStarting: true },
        { id: "semi", name: "Semi Deluxe", price: 91786 },
        { id: "deluxe", name: "Deluxe", price: 95786 },
        { id: "super", name: "Super Deluxe", price: 125786 },
        { id: "vip", name: "VIP", price: 165000, isStarting: false, isStartingLabel: true } // ₹165,000 onwards
      ],
      waQuery: "Group Umrah Package (Hubli Departure)"
    },
    {
      id: "couple",
      nameKey: "pkg.couple.name",     // Couple Umrah
      typeKey: "pkg.couple.type",     // Couple Package
      status: "active",
      bookingOpen: "2026-08-01",
      bookingClose: "2027-05-01",
      travelStart: "2026-10-01",
      travelEnd: "2027-05-30",
      featuresKey: "pkg.couple.features",
      variants: [
        { id: "std", name: "Standard", price: 185786, isStarting: true }
      ],
      waQuery: "Couple Umrah Package"
    },
    {
      id: "family",
      nameKey: "pkg.family.name",     // Family Umrah
      typeKey: "pkg.family.type",     // Family Package
      status: "active",
      bookingOpen: "2026-08-01",
      bookingClose: "2027-05-01",
      travelStart: "2026-10-01",
      travelEnd: "2027-05-30",
      featuresKey: "pkg.family.features",
      variants: [
        { id: "std", name: "Standard", price: 325786, isStarting: true }
      ],
      waQuery: "Family Umrah Package"
    },
    {
      id: "ziyarat",
      nameKey: "pkg.ziyarat.name",    // Ziyarat Package
      typeKey: "pkg.ziyarat.type",    // Ziyarat Tour
      status: "active",
      bookingOpen: "2026-08-01",
      bookingClose: "2027-05-01",
      travelStart: "2026-10-01",
      travelEnd: "2027-05-30",
      featuresKey: "pkg.ziyarat.features",
      variants: [
        { id: "std", name: "Standard", price: 48000, isStarting: true }
      ],
      waQuery: "Ziyarat Package"
    }
  ]
};
